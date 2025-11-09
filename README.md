# Mini-Maxit Frontend

Frontend application for the Mini-Maxit programming contest platform, built with Svelte 5 + SvelteKit.

## 📋 Documentation

- **[API_COVERAGE.md](./API_COVERAGE.md)** - Comprehensive mapping of backend API endpoints to frontend implementation
- **[PRIORITY_TODO.md](./PRIORITY_TODO.md)** - Prioritized roadmap of features to implement
- **[REMOTE_FUNCTIONS_EXPLANATION.md](./REMOTE_FUNCTIONS_EXPLANATION.md)** - Guide to SvelteKit remote functions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 10.15.1+ (required - do not use npm or yarn)

### Installation

```sh
# Install dependencies
pnpm install

# Compile i18n messages (required before first run)
npx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide
```

### Development

Start the development server:

```sh
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

### Building

To create a production version:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

### Code Quality

```sh
# Type checking
pnpm check

# Linting
pnpm lint

# Formatting
pnpm format
```

## 🏗️ Tech Stack

- **Svelte 5** - UI framework with runes and async components
- **SvelteKit** - Full-stack framework with remote functions
- **TypeScript** - Type safety (strict mode)
- **Tailwind CSS 4** - Styling
- **Paraglide** - Internationalization (English and Polish)
- **Valibot** - Schema validation
- **pnpm** - Package manager

## 📊 Current Status

**API Coverage: ~33%** (20 of 60 endpoints fully integrated)

### ✅ Working Features
- Authentication (login, register, logout)
- Contest browsing and registration
- Task viewing and submission
- Basic admin contest management
- User profile management

### 🚧 In Progress / Missing
- Groups management (0% - shows mock data)
- User management (admin)
- Detailed submission results viewing
- Contest/task editing and deletion
- Advanced submission filtering and monitoring

See [API_COVERAGE.md](./API_COVERAGE.md) for detailed status and [PRIORITY_TODO.md](./PRIORITY_TODO.md) for the implementation roadmap.

## 🤝 Contributing

1. Check [PRIORITY_TODO.md](./PRIORITY_TODO.md) for high-priority tasks
2. Review the development guidelines in the priority doc
3. Follow the existing code patterns and service layer structure
4. Use TypeScript strict mode and Svelte 5 runes conventions
5. Add appropriate error handling and loading states

## 📝 License

See LICENSE file for details.
