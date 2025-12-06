# Frontend

Frontend application for the programming contest platform built with SvelteKit and Svelte 5.

## Architecture

This application uses **SvelteKit with remote functions** for server-side operations and data fetching. Additionally, it provides a **client-side API** for scenarios requiring direct browser-to-backend communication.

### Client API

For use cases requiring direct client-to-backend communication (e.g., real-time features, SPA-like interactions):

- **Global Instance**: Use `getClientApiInstance()` for a singleton API client
- **Authentication**: `ClientAuthService` for login, register, logout
- **Security**: HttpOnly cookies, automatic token refresh, CSRF protection via SameSite=Strict

Example usage:
```typescript
import { getClientApiInstance, ClientAuthService } from '$lib/services';

const apiClient = getClientApiInstance();
if (apiClient) {
  const authService = new ClientAuthService(apiClient);
  const result = await authService.login({ email, password });
}
```

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

# Client-side (public) - for direct client API usage
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
│   │   └── auth/         # Auth-specific components
│   ├── dto/              # Data transfer objects
│   ├── services/         # API services
│   │   ├── ApiService.ts          # Server-side API client
│   │   ├── ClientApiService.ts    # Browser-side API client
│   │   ├── client-api-instance.ts # Global singleton instance
│   │   ├── AuthService.ts         # Server-side auth
│   │   └── ClientAuthService.ts   # Browser-side auth
│   └── token.ts          # Token management
└── routes/               # SvelteKit routes
```
