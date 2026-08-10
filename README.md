# Frontend

Frontend application for the programming contest platform built with SvelteKit and Svelte 5.

## Architecture

This application uses a **direct client-to-backend API** model. All data fetching happens in the browser via service classes; there are no server-proxied remote functions.

- **Client API**: Service classes in `src/lib/services/api/` call the backend directly.
- **Authentication**: Access token kept in memory (`tokenStore`); refresh token in an HttpOnly cookie set by the backend. Silent refresh on page load via `/auth/refresh`.
- **Security**: HttpOnly refresh cookie, SameSite=Strict, automatic token refresh on 401.

### Example usage

```typescript
import { getAuthInstance } from '$lib/services';

const authService = getAuthInstance();
if (authService) {
  const result = await authService.login({ email, password });
}
```

### Data fetching

Components use `createQuery` / `createParameterizedQuery` from `$lib/utils/query.svelte` for reactive queries with loading/error state.

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
# Client-side (public) - backend API base URL
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
│   ├── schemas/          # Valibot schemas
│   ├── services/         # API services
│   │   ├── api/          # Client-side API services (browser)
│   │   │   ├── ApiService.ts        # Base HTTP client (token refresh, 401 retry)
│   │   │   ├── AuthService.ts
│   │   │   └── ...
│   │   └── index.ts      # Public exports + singleton getters
│   ├── stores/           # Svelte runes stores (token, user, service instances)
│   ├── utils/            # createQuery/createParameterizedQuery, helpers
│   └── routes.ts         # Route constants
└── routes/               # SvelteKit routes
```
