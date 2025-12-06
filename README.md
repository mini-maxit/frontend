# Frontend

Frontend application for the programming contest platform built with SvelteKit and Svelte 5.

## Documentation

- [Remote Functions Explanation](./REMOTE_FUNCTIONS_EXPLANATION.md) - Legacy server-side remote functions
- [Client API Migration Guide](./CLIENT_API_MIGRATION.md) - **NEW**: Direct client-to-backend API integration
- [Client API Usage Examples](./USAGE_EXAMPLES.md) - **NEW**: Practical examples for using the client API

## Architecture

This application supports two architectural patterns:

1. **Remote Functions (Legacy)**: Server-side form handling with SvelteKit's remote functions
2. **Client API (New)**: Direct browser-to-backend communication with HttpOnly cookies

### Client API (Recommended for New Features)

The new client API provides:
- Direct browser-to-backend communication
- HttpOnly cookie security for tokens
- Automatic token refresh with race condition protection
- SPA-like user experience
- Full TypeScript support

See [CLIENT_API_MIGRATION.md](./CLIENT_API_MIGRATION.md) for details.

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
pnpm dev

# Type check
pnpm check

# Build for production
pnpm build
```

## Environment Variables

```env
# Server-side (private)
BACKEND_API_URL=http://localhost:8000

# Client-side (public)
PUBLIC_BACKEND_API_URL=http://localhost:8000/api/v1
```

## Technologies

- **Framework**: SvelteKit with Svelte 5
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **i18n**: Paraglide (English & Polish)
- **Validation**: Valibot
- **Package Manager**: pnpm (required)

## Development

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

## Testing

```sh
# Type checking
pnpm check

# Watch mode
pnpm check:watch

# Linting
pnpm lint

# Format code
pnpm format
```

## Project Structure

```
src/
├── lib/
│   ├── auth/              # Client-side auth utilities
│   ├── components/        # Reusable components
│   │   └── auth/         # Auth-specific components (NEW)
│   ├── dto/              # Data transfer objects
│   ├── services/         # API services
│   │   ├── ApiService.ts          # Server-side API client
│   │   ├── ClientApiService.ts    # Browser-side API client (NEW)
│   │   ├── AuthService.ts         # Server-side auth
│   │   └── ClientAuthService.ts   # Browser-side auth (NEW)
│   └── token.ts          # Token management
└── routes/               # SvelteKit routes
```
