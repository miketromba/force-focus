# Force Focus - Chrome Extension

A Chrome extension that enforces deep work by blocking distracting websites until you set a daily focus goal.

## Features

- **Daily Focus Lock**: Browser is blocked until you set a focus goal for the day
- **Pattern-Based Whitelist**: Only allows access to websites matching your configured patterns
- **Smart Blocking Overlay**: Shows a fullscreen overlay on blocked sites with options to:
  - Go back to work
  - Add the site to whitelist (if it's actually relevant)
  - Mark your goal as complete
- **Progress Tracking**: Track focus time, blocked attempts, and goal completion
- **Customizable Patterns**: Use glob patterns to whitelist specific domains and paths

## Installation

### Development Setup

1. Install dependencies:
```bash
bun install
```

2. Build the extension:
```bash
bun run build
```

3. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Development Mode

Run in development mode with hot reload:
```bash
bun run dev
```

## Usage

1. **Set Your Daily Goal**: Click the extension icon and set a specific, measurable goal for the day
2. **Browse Freely**: Access whitelisted sites without interruption
3. **Stay Focused**: Non-whitelisted sites show a blocking overlay
4. **Track Progress**: View statistics on focus time and blocked attempts
5. **Complete Goal**: Mark your goal as complete to unlock free browsing

## Configuration

### Whitelist Patterns

Examples of glob patterns you can use:
- `github.com/*` - Allow all GitHub pages
- `*.stackoverflow.com` - Allow Stack Overflow and all subdomains
- `localhost:3000` - Allow local development server
- `docs.google.com/*` - Allow Google Docs

### Default Whitelisted Domains

The extension comes with sensible defaults for developers:
- `localhost:*`
- `github.com/*`
- `stackoverflow.com/*`
- `developer.mozilla.org/*`
- And more...

## Project Structure

```
force-focus/
├── src/
│   ├── background/     # Service worker (background script)
│   ├── content/       # Content script with blocking overlay
│   ├── popup/         # React popup interface
│   ├── shared/        # Shared utilities and types
│   └── styles/        # Global styles and Tailwind CSS
├── public/
│   └── icons/         # Extension icons
├── manifest.json      # Chrome extension manifest
└── dist/             # Built extension (generated)
```

## Technology Stack

- **Bun**: Runtime and package manager
- **TypeScript**: Type safety throughout
- **React 18**: Popup interface
- **Vite**: Build tool with CRXJS plugin
- **Tailwind CSS**: Styling
- **Chrome Extension Manifest V3**: Latest extension architecture

## Development

### Type Checking
```bash
bun run type-check
```

### Building for Production
```bash
bun run build
```

## License

MIT

---
*This project was created using `bun init` in bun v1.3.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.*
