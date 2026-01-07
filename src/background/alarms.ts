import { ALARMS } from '@/shared/constants';
import { getSyncStorage, resetFocusSession } from '@/shared/storage';

/**
 * Setup alarms for daily reset
 */
export async function setupAlarms(): Promise<void> {
  const { settings } = await getSyncStorage();

  // Clear existing alarms
  await chrome.alarms.clearAll();

  // Calculate next reset time
  const now = new Date();
  const resetTime = new Date();
  resetTime.setHours(settings.resetHour, 0, 0, 0);

  // If reset time has passed today, set for tomorrow
  if (resetTime.getTime() <= now.getTime()) {
    resetTime.setDate(resetTime.getDate() + 1);
  }

  // Create daily reset alarm
  await chrome.alarms.create(ALARMS.DAILY_RESET, {
    when: resetTime.getTime(),
    periodInMinutes: 24 * 60, // Repeat every 24 hours
  });

  console.log(`Daily reset scheduled for ${resetTime.toLocaleString()}`);
}

/**
 * Handle alarm events
 */
export async function handleAlarm(alarm: chrome.alarms.Alarm): Promise<void> {
  console.log(`Alarm triggered: ${alarm.name}`);

  switch (alarm.name) {
    case ALARMS.DAILY_RESET:
      await handleDailyReset();
      break;
    default:
      console.warn(`Unknown alarm: ${alarm.name}`);
  }
}

/**
 * Handle daily reset
 */
async function handleDailyReset(): Promise<void> {
  console.log('Performing daily reset...');

  // Reset focus session
  await resetFocusSession();

  // Notify all tabs about the reset
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'SESSION_RESET',
      }).catch(() => {
        // Ignore errors for tabs that don't have content script
      });
    }
  });

  // Show notification
  chrome.notifications.create('daily-reset', {
    type: 'basic',
    iconUrl: '/icons/icon-48.png',
    title: 'Force Focus - New Day',
    message: 'Time to set your focus goal for today!',
    priority: 2,
  });
}