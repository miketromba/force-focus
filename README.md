# Force Focus

A Chrome extension that enforces deep work by blocking distracting websites until you set a daily focus goal.

## How It Works

1. **Set Your Daily Goal** - Browser is blocked until you commit to a specific, measurable goal for the day
2. **Work Without Distractions** - Only whitelisted sites are accessible while your goal is active
3. **Stay Accountable** - Non-whitelisted sites show a blocking overlay reminding you of your goal
4. **Complete & Unlock** - Mark your goal as complete to unlock free browsing

## Features

- **Daily Focus Lock** - Browser blocks everything until you set a goal
- **Pattern-Based Whitelist** - Use glob patterns to allow specific domains and paths
- **Smart Blocking Overlay** - Full-screen overlay on blocked sites with options to go back, add to whitelist, or mark goal complete
- **Progress Tracking** - Track focus time, blocked attempts, and goal completion streaks

## Installation

### From Source

```bash
# Install dependencies
bun install

# Build the extension
bun run build
```

Then load in Chrome:
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

### Development

```bash
# Run with hot reload
bun run dev

# Type check
bun run type-check
```

## Whitelist Patterns

Examples of glob patterns:

| Pattern | Matches |
|---------|---------|
| `github.com/*` | All GitHub pages |
| `*.stackoverflow.com` | Stack Overflow and subdomains |
| `localhost:*` | Any localhost port |
| `docs.google.com/*` | Google Docs |

Default whitelist includes common developer tools (GitHub, Stack Overflow, MDN, localhost, etc.)

## Project Structure

```
src/
├── background/     # Service worker
├── content/        # Blocking overlay (React)
├── popup/          # Extension popup (React)
├── shared/         # Shared types and utilities
└── styles/         # Tailwind CSS
```

## Tech Stack

- TypeScript
- React 19
- Tailwind CSS
- Vite + CRXJS
- Chrome Extension Manifest V3

## License

MIT
