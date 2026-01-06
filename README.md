# Force Focus

A Chrome extension that enforces deep work by blocking websites until you set a daily focus goal.

## How It Works

1. **Set a Goal** - Enable focus mode by setting a specific goal (min 10 characters)
2. **Browse Allowed Sites** - Only sites matching your whitelist patterns are accessible
3. **Get Blocked** - Non-whitelisted sites show a full-screen overlay with your goal reminder
4. **End Session** - Toggle off focus mode when you're done

## Features

- **Focus Mode Toggle** - Enable/disable blocking with a simple toggle
- **Goal-Based Locking** - Must set a specific goal before focus mode activates
- **Pattern-Based Whitelist** - Allow sites using glob patterns with wildcards (`*`, `**`)
- **Blocking Overlay** - Full-screen modal on blocked sites with options to go back, allow the site, or end session
- **Daily Auto-Reset** - Configurable reset time clears your goal daily
- **Export/Import** - Backup and sync your configuration across devices

## Installation

```bash
bun install
bun run build
```

Load in Chrome:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist` folder

## Popup Interface

**Focus Tab** - Set your daily goal and see current status

**Sites Tab** - Manage allowed site patterns:
- `github.com/*` - All GitHub pages
- `*.google.com/*` - All Google subdomains
- `localhost:*` - Any localhost port

**Settings Tab** - Configure reset time, export/import config, reset extension

## Blocking Overlay

When you visit a blocked site, the overlay shows:
- Your current focus goal
- The blocked URL
- Options: **Back to work**, **Allow in focus mode**, **End focus session**

The "Allow in focus mode" option lets you quickly add the site with different pattern scopes (exact page, whole domain, subdomains, or path prefix).

## Development

```bash
bun run dev      # Hot reload
bun run build    # Production build
```

## License

MIT
