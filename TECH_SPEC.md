# Force Focus - Technical Specification

## Technology Stack

### Core Technologies
- **Runtime/Package Manager**: Bun
- **Language**: TypeScript (strict mode enabled)
- **UI Framework**: React 18 (functional components with hooks)
- **Build Tool**: Vite with @crxjs/vite-plugin
- **Styling**: Tailwind CSS with JIT mode

### Chrome Extension Architecture
- **Manifest Version**: V3
- **Background Script**: Service Worker for persistent state and scheduling
- **Content Script**: DOM manipulation for overlay injection
- **Popup Interface**: React application for settings and configuration

### State Management & Storage
- **State Management**: React Context API with useReducer
- **Primary Storage**: chrome.storage.local (patterns, logs, daily goals)
- **Sync Storage**: chrome.storage.sync (user preferences)
- **Memory Cache**: In-memory caching for pattern matching performance

### Key Libraries
- **Pattern Matching**: picomatch (glob pattern support)
- **Scheduling**: Chrome Alarms API (daily resets)
- **Date Handling**: Native JavaScript Date objects

## Project Structure

```
force-focus/
├── src/
│   ├── background/
│   │   ├── index.ts           # Service worker entry point
│   │   ├── alarms.ts          # Daily reset scheduling
│   │   ├── storage.ts         # Storage operations
│   │   └── messages.ts        # Message handling
│   │
│   ├── content/
│   │   ├── index.ts           # Content script entry
│   │   ├── overlay.tsx        # Blocking overlay component
│   │   └── injector.ts        # DOM injection logic
│   │
│   ├── popup/
│   │   ├── App.tsx            # Main popup component
│   │   ├── index.tsx          # Popup entry point
│   │   ├── components/        # React components
│   │   │   ├── GoalSetter.tsx
│   │   │   ├── PatternManager.tsx
│   │   │   ├── Statistics.tsx
│   │   │   └── Settings.tsx
│   │   └── hooks/             # Custom React hooks
│   │       ├── useStorage.ts
│   │       └── usePatterns.ts
│   │
│   ├── shared/
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── constants.ts       # Shared constants
│   │   ├── patterns.ts        # Pattern matching utilities
│   │   └── messages.ts        # Message type definitions
│   │
│   └── styles/
│       ├── globals.css        # Global styles and Tailwind imports
│       └── overlay.css        # Overlay-specific styles
│
├── public/
│   ├── icons/                 # Extension icons
│   └── manifest.json          # Extension manifest
│
├── scripts/
│   └── build.ts               # Build scripts
│
├── .gitignore
├── bun.lockb
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Key Components

### 1. Service Worker (Background)
- Manages extension lifecycle
- Handles daily reset logic via Chrome Alarms
- Coordinates storage operations
- Processes messages between components

### 2. Content Script
- Injects blocking overlay on non-whitelisted pages
- Listens for navigation events
- Communicates with service worker for pattern matching
- Manages overlay state and user interactions

### 3. Popup Interface
- Goal setting interface
- Pattern configuration UI
- Statistics dashboard
- Import/export functionality

### 4. Pattern Matching Engine
- Glob pattern evaluation using picomatch
- URL normalization
- Pattern caching for performance
- Default pattern sets

## Data Models

### Storage Schema

```typescript
// chrome.storage.local
interface LocalStorage {
  dailyGoal: {
    text: string;
    setAt: number; // timestamp
    completed: boolean;
  };
  patterns: {
    id: string;
    pattern: string;
    enabled: boolean;
    temporary?: boolean; // expires at day end
  }[];
  statistics: {
    date: string; // YYYY-MM-DD
    focusTime: number; // minutes
    blockedAttempts: number;
    completedGoals: number;
  }[];
  blockedUrls: {
    url: string;
    timestamp: number;
    count: number;
  }[];
}

// chrome.storage.sync
interface SyncStorage {
  settings: {
    resetHour: number; // 0-23, when day resets
    defaultPatterns: string[];
    strictMode: boolean;
  };
}
```

## Message Protocol

### Message Types
```typescript
type MessageType =
  | 'CHECK_URL'
  | 'ADD_PATTERN'
  | 'REMOVE_PATTERN'
  | 'GET_STATUS'
  | 'SET_GOAL'
  | 'COMPLETE_GOAL'
  | 'OVERRIDE_BLOCK';

interface Message {
  type: MessageType;
  payload: any;
}
```

## Implementation Details

### Pattern Matching Flow
1. Content script detects navigation
2. Sends URL to service worker
3. Service worker checks against pattern cache
4. Returns allow/block decision
5. Content script shows/hides overlay accordingly

### Daily Reset Logic
1. Chrome Alarm triggers at configured time
2. Service worker resets daily goal
3. Clears temporary patterns
4. Archives statistics
5. Notifies all tabs to update state

### Overlay Injection
1. Content script loads on all pages
2. Creates shadow DOM root for isolation
3. Injects React-rendered overlay at max z-index
4. Prevents interaction with underlying page
5. Handles user actions (back, whitelist, complete)

## Development Workflow

### Setup
```bash
bun install
bun run dev
```

### Build
```bash
bun run build
```

### Type Checking
```bash
bun run type-check
```

### Loading in Chrome
1. Build the extension
2. Open Chrome Extensions page
3. Enable Developer Mode
4. Load unpacked from `dist/` directory

## Performance Considerations

### Pattern Matching
- Cache compiled patterns in memory
- Batch pattern evaluation
- Use early return for common domains
- Maintain MRU cache for recent checks

### Storage Operations
- Batch storage writes
- Use chrome.storage API efficiently
- Implement debouncing for frequent updates
- Archive old statistics periodically

### Overlay Rendering
- Use Shadow DOM for style isolation
- Lazy load overlay component
- Minimize re-renders with React.memo
- Keep overlay CSS minimal

## Security Considerations

### Content Security Policy
- Strict CSP in manifest.json
- No inline scripts
- No eval() usage
- Sanitize user inputs

### Permissions
- Minimal permission set
- Host permissions only when needed
- Storage permission for persistence
- Alarms permission for scheduling

## Testing Strategy

### Unit Tests
- Pattern matching logic
- Storage operations
- Date/time utilities
- Message handling

### Integration Tests
- Cross-component messaging
- Storage sync behavior
- Overlay injection
- User flows

### Manual Testing
- Install/uninstall flow
- Daily reset behavior
- Pattern configuration
- Edge cases (incognito, multiple windows)