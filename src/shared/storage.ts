import type { LocalStorage, SyncStorage, Pattern, DailyGoal, Settings } from './types';
import { STORAGE_KEYS, DEFAULT_PATTERNS, TIME } from './constants';

/**
 * Get data from chrome.storage.local
 */
export async function getLocalStorage<K extends keyof LocalStorage>(
  keys?: K[]
): Promise<Partial<LocalStorage>> {
  const result = await chrome.storage.local.get(keys);
  return result as Partial<LocalStorage>;
}

/**
 * Set data in chrome.storage.local
 */
export async function setLocalStorage(
  data: Partial<LocalStorage>
): Promise<void> {
  await chrome.storage.local.set(data);
}

/**
 * Get data from chrome.storage.sync
 */
export async function getSyncStorage(): Promise<SyncStorage> {
  const result = await chrome.storage.sync.get(STORAGE_KEYS.SYNC.SETTINGS);
  return {
    settings: result.settings || getDefaultSettings(),
  };
}

/**
 * Set data in chrome.storage.sync
 */
export async function setSyncStorage(
  data: Partial<SyncStorage>
): Promise<void> {
  await chrome.storage.sync.set(data);
}

/**
 * Get default settings
 */
export function getDefaultSettings(): Settings {
  return {
    resetHour: TIME.DEFAULT_RESET_HOUR,
    defaultPatterns: DEFAULT_PATTERNS,
    strictMode: true,
    isLocked: true,
  };
}

/**
 * Initialize storage with default values
 */
export async function initializeStorage(): Promise<void> {
  // Check if storage is already initialized
  const local = await getLocalStorage();
  const sync = await getSyncStorage();

  // Initialize local storage
  if (!local.patterns) {
    const defaultPatterns: Pattern[] = DEFAULT_PATTERNS.map((pattern, index) => ({
      id: `default-${index}`,
      pattern,
      enabled: true,
      addedAt: Date.now(),
    }));

    await setLocalStorage({
      patterns: defaultPatterns,
    });
  }

  // Initialize sync storage
  if (!sync.settings) {
    await setSyncStorage({
      settings: getDefaultSettings(),
    });
  }
}

/**
 * Clear expired temporary patterns
 */
export async function clearTemporaryPatterns(): Promise<void> {
  const { patterns = [] } = await getLocalStorage(['patterns']);
  const permanentPatterns = patterns.filter(p => !p.temporary);
  await setLocalStorage({ patterns: permanentPatterns });
}

/**
 * Reset daily data
 */
export async function resetDailyData(): Promise<void> {
  await setLocalStorage({
    dailyGoal: undefined,
  });
  await clearTemporaryPatterns();

  // Lock the browser until new goal is set
  const { settings } = await getSyncStorage();
  settings.isLocked = true;
  await setSyncStorage({ settings });
}