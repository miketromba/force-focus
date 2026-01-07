import { createMessageHandler, onMessage } from '@/shared/messages';
import {
  initializeStorage,
  getLocalStorage,
  setLocalStorage,
  getSyncStorage,
  setSyncStorage,
  resetDailyData,
} from '@/shared/storage';
import { isUrlAllowed } from '@/shared/patterns';
import type {
  CheckUrlPayload,
  CheckUrlResponse,
  AddPatternPayload,
  StatusResponse,
  Pattern,
} from '@/shared/types';
import { ALARMS, TIME } from '@/shared/constants';
import { setupAlarms, handleAlarm } from './alarms';

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Force Focus extension installed');
  await initializeStorage();
  await setupAlarms();
});

// Initialize extension on startup
chrome.runtime.onStartup.addListener(async () => {
  console.log('Force Focus extension started');
  await setupAlarms();
});

// Handle alarms
chrome.alarms.onAlarm.addListener(handleAlarm);

// Message handler
const messageHandler = createMessageHandler({
  CHECK_URL: async (payload: CheckUrlPayload): Promise<CheckUrlResponse> => {
    const { url } = payload;
    const { dailyGoal, patterns = [], focusEnabled = false } = await getLocalStorage(['dailyGoal', 'patterns', 'focusEnabled']);
    const { settings } = await getSyncStorage();

    // If browser is locked (no goal set), block everything - check this FIRST
    if (settings.isLocked || !dailyGoal) {
      return {
        allowed: false,
        reason: 'No focus goal set for today',
        isLocked: true,
        goal: undefined,
      };
    }

    // If focus mode is disabled (and goal is set), allow everything
    if (!focusEnabled) {
      return {
        allowed: true,
        reason: 'Focus mode is disabled',
        isLocked: false,
        goal: dailyGoal?.text,
      };
    }

    // Check if URL matches any pattern
    const allowed = isUrlAllowed(url, patterns);

    return {
      allowed,
      reason: allowed ? 'URL matches whitelist' : 'URL not in whitelist',
      goal: dailyGoal.text,
      isLocked: false,
    };
  },

  ADD_PATTERN: async (payload: AddPatternPayload): Promise<void> => {
    const { pattern, temporary = false } = payload;
    const { patterns = [] } = await getLocalStorage(['patterns']);

    // Check for duplicate pattern
    const isDuplicate = patterns.some(p => p.pattern === pattern);
    if (isDuplicate) {
      return; // Don't add duplicate
    }

    const newPattern: Pattern = {
      id: `pattern-${Date.now()}`,
      pattern,
      enabled: true,
      temporary,
      addedAt: Date.now(),
    };

    patterns.push(newPattern);
    await setLocalStorage({ patterns });

    // Notify all tabs to re-check their URL
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'PATTERNS_CHANGED' }).catch(() => {});
      }
    });
  },

  REMOVE_PATTERN: async (patternId: string): Promise<void> => {
    const { patterns = [] } = await getLocalStorage(['patterns']);
    const filtered = patterns.filter(p => p.id !== patternId);
    await setLocalStorage({ patterns: filtered });

    // Notify all tabs to re-check their URL
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'PATTERNS_CHANGED' }).catch(() => {});
      }
    });
  },

  GET_STATUS: async (): Promise<StatusResponse> => {
    const { dailyGoal, focusEnabled = false } = await getLocalStorage(['dailyGoal', 'focusEnabled']);
    const { settings } = await getSyncStorage();

    return {
      isLocked: settings.isLocked,
      hasGoal: !!dailyGoal,
      goalCompleted: dailyGoal?.completed || false,
      goal: dailyGoal?.text,
      focusEnabled,
    };
  },

  SET_GOAL: async (goalText: string): Promise<void> => {
    const newGoal = {
      text: goalText,
      setAt: Date.now(),
      completed: false,
    };

    // Set goal and enable focus mode
    await setLocalStorage({
      dailyGoal: newGoal,
      focusEnabled: true,
    });

    // Unlock the browser
    const { settings } = await getSyncStorage();
    settings.isLocked = false;
    await setSyncStorage({ settings });

    // Notify all tabs that goal is set (this will trigger re-check)
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'GOAL_SET',
          payload: goalText,
        }).catch(() => {
          // Ignore errors for tabs that don't have content script
        });
      }
    });
  },

  COMPLETE_GOAL: async (): Promise<void> => {
    // End focus session by disabling focus mode
    await setLocalStorage({ focusEnabled: false });

    // Notify all tabs that goal is completed (focus mode off)
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'GOAL_COMPLETED',
        }).catch(() => {
          // Ignore errors
        });
      }
    });
  },

  TOGGLE_FOCUS: async (): Promise<boolean> => {
    const { focusEnabled = false } = await getLocalStorage(['focusEnabled']);
    const newValue = !focusEnabled;
    await setLocalStorage({ focusEnabled: newValue });

    // Notify all tabs of focus state change
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'FOCUS_TOGGLED',
          payload: newValue,
        }).catch(() => {
          // Ignore errors
        });
      }
    });

    return newValue;
  },

  GET_PATTERNS: async (): Promise<Pattern[]> => {
    const { patterns = [] } = await getLocalStorage(['patterns']);
    return patterns;
  },

  UPDATE_SETTINGS: async (newSettings: Partial<Settings>): Promise<void> => {
    const { settings } = await getSyncStorage();
    const updated = { ...settings, ...newSettings };
    await setSyncStorage({ settings: updated });

    // If reset hour changed, update alarms
    if (newSettings.resetHour !== undefined) {
      await setupAlarms();
    }
  },

  RESET_DAY: async (): Promise<void> => {
    await resetDailyData();
  },

  ADD_TO_WHITELIST: async (payload: { url: string; option: 'exact' | 'domain' | 'domain-wildcard' | 'custom'; customPattern?: string }): Promise<void> => {
    const { url, option, customPattern } = payload;
    let pattern: string;

    if (option === 'custom' && customPattern) {
      pattern = customPattern;
    } else {
      try {
        const urlObj = new URL(url);
        switch (option) {
          case 'exact':
            pattern = `${urlObj.hostname}${urlObj.pathname}`;
            break;
          case 'domain':
            pattern = urlObj.hostname;
            break;
          case 'domain-wildcard':
            pattern = `*.${urlObj.hostname}`;
            break;
          default:
            pattern = urlObj.hostname;
        }
      } catch {
        pattern = url;
      }
    }

    // Add pattern directly to storage
    const { patterns = [] } = await getLocalStorage(['patterns']);

    // Check for duplicate pattern
    const isDuplicate = patterns.some(p => p.pattern === pattern);
    if (isDuplicate) {
      return; // Don't add duplicate
    }

    const newPattern: Pattern = {
      id: `pattern-${Date.now()}`,
      pattern,
      enabled: true,
      temporary: false,
      addedAt: Date.now(),
    };
    patterns.push(newPattern);
    await setLocalStorage({ patterns });

    // Notify all tabs to re-check their URL
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'PATTERNS_CHANGED' }).catch(() => {});
      }
    });
  },
});

// Listen for messages
onMessage(messageHandler);