// Storage types
export interface DailyGoal {
  text: string;
  setAt: number; // timestamp
  completed: boolean;
}

export interface Pattern {
  id: string;
  pattern: string;
  enabled: boolean;
  temporary?: boolean; // expires at day end
  addedAt: number;
}

export interface Settings {
  resetHour: number; // 0-23, when day resets
  defaultPatterns: string[];
  strictMode: boolean;
  isLocked: boolean; // whether browser is locked until goal is set
}

// Local storage structure
export interface LocalStorage {
  dailyGoal?: DailyGoal;
  patterns: Pattern[];
  focusEnabled: boolean;
}

// Sync storage structure
export interface SyncStorage {
  settings: Settings;
}

// Message types for communication between components
export type MessageType =
  | 'CHECK_URL'
  | 'ADD_PATTERN'
  | 'REMOVE_PATTERN'
  | 'GET_STATUS'
  | 'SET_GOAL'
  | 'COMPLETE_GOAL'
  | 'TOGGLE_FOCUS'
  | 'OVERRIDE_BLOCK'
  | 'GET_PATTERNS'
  | 'UPDATE_SETTINGS'
  | 'RESET_DAY'
  | 'ADD_TO_WHITELIST'
  // Broadcast messages (background -> content scripts)
  | 'GOAL_SET'
  | 'GOAL_COMPLETED'
  | 'DAILY_RESET'
  | 'FOCUS_TOGGLED';

export interface Message<T = any> {
  type: MessageType;
  payload?: T;
}

export interface CheckUrlPayload {
  url: string;
  tabId?: number;
}

export interface CheckUrlResponse {
  allowed: boolean;
  reason?: string;
  goal?: string;
  isLocked?: boolean;
}

export interface AddPatternPayload {
  pattern: string;
  temporary?: boolean;
}

export interface StatusResponse {
  isLocked: boolean;
  hasGoal: boolean;
  goalCompleted: boolean;
  goal?: string;
  focusEnabled: boolean;
}