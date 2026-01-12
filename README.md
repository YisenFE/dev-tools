# DevTools

A lightweight macOS developer tools collection, similar to DevUtils. Built with Tauri + React for minimal memory footprint and fast performance.

## Features

- **JSON Formatter** - Format, minify, validate, and sort JSON
- **Base64 Encoder** - Encode and decode Base64
- **URL Encoder** - Encode and decode URLs with parameter parsing
- **HTML Encoder** - Encode and decode HTML entities

### Enhanced Experience

- Global shortcut `Cmd+Shift+D` to toggle window
- Auto-detect clipboard content type
- One-click paste from clipboard
- Dark/Light/System theme support
- Fast search to filter tools

## Installation

### Download

Download the latest `.dmg` file from the [Releases](https://github.com/user/dev-tools/releases) page.

### Build from Source

```bash
# Prerequisites
# - Node.js 18+
# - Rust (https://rustup.rs/)

# Clone the repository
git clone https://github.com/user/dev-tools.git
cd dev-tools

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Tauri 2.x (Rust)
- **UI**: Tailwind CSS
- **Editor**: CodeMirror 6
- **State**: Zustand
- **Testing**: Vitest + Playwright

## Development

```bash
# Run development server
npm run tauri dev

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run tauri build
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+D` | Toggle window visibility |

## Project Structure

```
src/
├── components/       # Shared components
│   ├── Layout/       # Layout components
│   └── Editor/       # CodeMirror editor
├── tools/            # Tool modules
│   ├── json-formatter/
│   ├── base64/
│   ├── url-encoder/
│   └── html-encoder/
├── hooks/            # Custom React hooks
└── store/            # Zustand stores

src-tauri/            # Tauri/Rust backend
tests/
├── unit/             # Vitest unit tests
└── e2e/              # Playwright E2E tests
```

## License

MIT
