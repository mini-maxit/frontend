# Client API Migration Guide

This document describes the new direct client-to-backend API integration for authentication and provides a reference for migrating other features.

## Overview

The new architecture allows direct communication between the browser and backend API without going through SvelteKit remote functions. This is implemented as a **proof of concept** for authentication, demonstrating the pattern for future migrations.

## Security Model

### Token Storage

**Access Tokens**: Stored in HttpOnly cookies for maximum security
- **Set by**: Backend on login/register/refresh responses
- **Managed by**: Browser automatically sends with each request via `credentials: 'include'`
- **Security**: Protected from XSS attacks (JavaScript cannot access)
- **Cookie Attributes**: 
  - `HttpOnly`: true
  - `Secure`: true (in production)
  - `SameSite`: Strict (CSRF protection)

**Refresh Tokens**: Also stored in HttpOnly cookies
- **Set by**: Backend on login/register responses
- **Used for**: Token refresh when access token expires
- **Security**: Same HttpOnly protection as access tokens

### CSRF Protection

- `SameSite=Strict` cookie attribute prevents CSRF attacks
- No additional CSRF tokens needed for same-site requests
- Cross-origin requests blocked by browser

## Architecture

### Services

#### 1. ClientApiService (`src/lib/services/ClientApiService.ts`)

Browser-only API client that:
- Makes HTTP requests to backend with `credentials: 'include'`
- Automatically handles 401 responses by refreshing tokens
- Implements race condition protection for concurrent refreshes
- Throws `ApiError` on failures

```typescript
import { createClientApiClient } from '$lib/services';

const apiClient = createClientApiClient();
// or with custom URL
const apiClient = createClientApiClient('https://api.example.com/api/v1');
```

#### 2. ClientAuthService (`src/lib/services/ClientAuthService.ts`)

Client-side authentication service providing:
- `login(credentials)` - Authenticate user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `refreshToken()` - Manually refresh token

```typescript
import { createClientApiClient, ClientAuthService } from '$lib/services';

const apiClient = createClientApiClient();
const authService = new ClientAuthService(apiClient);

const result = await authService.login({
  email: 'user@example.com',
  password: 'password'
});
```

### Components

#### ClientLoginForm (`src/lib/components/auth/ClientLoginForm.svelte`)

Reusable login form using client API:

```svelte
<script>
  import { ClientLoginForm } from '$lib/components/auth';
</script>

<ClientLoginForm redirectTo="/dashboard" />
```

#### ClientLogoutButton (`src/lib/components/auth/ClientLogoutButton.svelte`)

Logout button using client API:

```svelte
<script>
  import { ClientLogoutButton } from '$lib/components/auth';
</script>

<ClientLogoutButton class="btn-primary">
  Logout
</ClientLogoutButton>
```

### Helper Functions

#### clientLogout (`src/lib/auth/client-logout.ts`)

Standalone logout function:

```typescript
import { clientLogout } from '$lib/auth/client-logout';

await clientLogout(); // Logs out and redirects to login
```

## Environment Variables

Add to `.env` or `.env.local`:

```env
# Server-side (private)
BACKEND_API_URL=http://localhost:8000

# Client-side (public)
PUBLIC_BACKEND_API_URL=http://localhost:8000/api/v1
```

## Token Refresh Flow

1. **Request fails with 401**: ClientApiService intercepts
2. **Check if refreshing**: If already refreshing, wait for existing refresh
3. **Refresh token**: Call `/auth/refresh` with credentials
4. **Backend sets new cookie**: New access token in HttpOnly cookie
5. **Retry original request**: Automatically with new token
6. **Handle refresh failure**: Redirect to login page

### Race Condition Handling

The refresh mechanism uses promise-based queuing:

```typescript
private isRefreshing = false;
private refreshPromise: Promise<void> | null = null;

private async refreshToken(): Promise<void> {
  if (this.isRefreshing && this.refreshPromise) {
    return this.refreshPromise; // Wait for existing refresh
  }
  
  this.isRefreshing = true;
  this.refreshPromise = (async () => {
    // Perform refresh...
  })();
  
  return this.refreshPromise;
}
```

## Migration Patterns

### Pattern 1: Replace Remote Function with Client API

**Before (Remote Function):**
```typescript
// login.remote.ts
import { form } from '$app/server';
import { AuthService } from '$lib/services/AuthService';

export const login = form(Schema, async (data) => {
  const apiClient = createApiClient(event.cookies);
  const authService = new AuthService(apiClient);
  const result = await authService.login(data);
  // ...
});
```

**After (Client API):**
```typescript
// Component
import { createClientApiClient, ClientAuthService } from '$lib/services';

const apiClient = createClientApiClient();
const authService = new ClientAuthService(apiClient);

async function handleLogin() {
  const result = await authService.login({
    email,
    password
  });
  
  if (result.success) {
    await goto('/dashboard');
  } else {
    toast.error(result.error);
  }
}
```

### Pattern 2: Using Client API in Components

```svelte
<script lang="ts">
  import { browser } from '$app/environment';
  import { createClientApiClient, ClientAuthService } from '$lib/services';
  
  // Only create in browser
  const apiClient = browser ? createClientApiClient() : null;
  const authService = apiClient ? new ClientAuthService(apiClient) : null;
  
  async function handleSubmit() {
    if (!authService) {
      toast.error('Service not available');
      return;
    }
    
    const result = await authService.login(credentials);
    // Handle result...
  }
</script>
```

## Comparison: Remote Functions vs Client API

| Aspect | Remote Functions | Client API |
|--------|------------------|------------|
| **Execution** | Server-side | Browser-side |
| **Token Access** | Server cookies via `Cookies` API | HttpOnly cookies (automatic) |
| **Form Integration** | `.enhance()` for forms | Manual event handlers |
| **Type Safety** | Full TypeScript + Valibot validation | Client-side validation only |
| **Security** | Server-side validation | Client + server validation |
| **Use Case** | Traditional forms, SSR | Dynamic SPAs, client interactions |

## When to Use Each Approach

### Use Client API When:
- Building SPA-like experiences
- Need dynamic, interactive UI updates
- Want to avoid full page loads
- Implementing real-time features
- Building mobile-like web apps

### Keep Remote Functions When:
- Traditional form submissions work well
- Need server-side validation before API call
- Want progressive enhancement
- SEO is critical (forms work without JS)

## Example: Complete Login Page with Client API

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { toast } from 'svelte-sonner';
  import { createClientApiClient, ClientAuthService } from '$lib/services';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  
  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  
  const apiClient = browser ? createClientApiClient() : null;
  const authService = apiClient ? new ClientAuthService(apiClient) : null;
  
  async function handleLogin(event: Event) {
    event.preventDefault();
    
    if (!authService) {
      toast.error('Service not available');
      return;
    }
    
    isSubmitting = true;
    
    try {
      const result = await authService.login({ email, password });
      
      if (result.success) {
        toast.success('Login successful!');
        await goto('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleLogin}>
  <Input
    type="email"
    bind:value={email}
    placeholder="Email"
    disabled={isSubmitting}
  />
  <Input
    type="password"
    bind:value={password}
    placeholder="Password"
    disabled={isSubmitting}
  />
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Logging in...' : 'Login'}
  </Button>
</form>
```

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new user
- [ ] Logout functionality
- [ ] Token refresh on 401
- [ ] Multiple concurrent 401s (race condition)
- [ ] Navigate after login
- [ ] Session persistence across page reloads
- [ ] Logout clears session

### Backend Requirements

The backend must:
1. Set HttpOnly cookies for access and refresh tokens
2. Include `SameSite=Strict` and `Secure` (in prod) attributes
3. Support `/auth/refresh` endpoint
4. Return 401 for expired access tokens
5. Clear cookies on `/auth/logout`

## Future Migration Steps

1. **Phase 1**: Authentication (✅ Completed - POC)
2. **Phase 2**: User profile management
3. **Phase 3**: Task/Contest submissions
4. **Phase 4**: Admin operations
5. **Phase 5**: Real-time features

Each phase should:
- Create corresponding `Client*Service` class
- Maintain backward compatibility
- Document migration patterns
- Test thoroughly

## Troubleshooting

### Token Not Being Sent

**Problem**: Requests not including cookies

**Solution**: Ensure `credentials: 'include'` in fetch options

### CORS Issues

**Problem**: CORS errors in browser console

**Solution**: Backend must set:
```
Access-Control-Allow-Origin: <frontend-url>
Access-Control-Allow-Credentials: true
```

### Token Refresh Loop

**Problem**: Infinite refresh loop

**Solution**: Check backend returns proper 401 and refresh endpoint works

### Logout Not Clearing Session

**Problem**: User still authenticated after logout

**Solution**: Verify backend clears HttpOnly cookies on `/auth/logout`

## Security Considerations

1. **HttpOnly Cookies**: Prevent XSS token theft
2. **SameSite=Strict**: Prevent CSRF attacks
3. **Secure Flag**: HTTPS only in production
4. **Token Refresh**: Short-lived access tokens (e.g., 15 min)
5. **Backend Validation**: Always validate on backend
6. **CORS Configuration**: Restrict allowed origins
7. **Rate Limiting**: Implement on backend
8. **SSL/TLS**: Required in production

## References

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN: HttpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [MDN: SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
