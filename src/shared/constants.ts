// Default patterns (empty - user configures their own)
export const DEFAULT_PATTERNS: string[] = [];

// Storage keys
export const STORAGE_KEYS = {
  LOCAL: {
    DAILY_GOAL: 'dailyGoal',
    PATTERNS: 'patterns',
  },
  SYNC: {
    SETTINGS: 'settings',
  },
} as const;

// Alarm names
export const ALARMS = {
  DAILY_RESET: 'daily-reset',
} as const;

// Time constants
export const TIME = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  DEFAULT_RESET_HOUR: 4, // 4 AM default reset
} as const;

// UI constants
export const UI = {
  POPUP_WIDTH: 400,
  POPUP_HEIGHT: 600,
  OVERLAY_Z_INDEX: 2147483647, // Maximum z-index value
} as const;