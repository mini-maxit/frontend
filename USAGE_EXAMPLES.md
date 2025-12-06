# Client API Usage Examples

This document provides practical examples of using the new client API for authentication and other features.

## Example 1: Using ClientLoginForm Component

The simplest way to add client-side login to a page:

```svelte
<!-- src/routes/(landing)/login/+page.svelte -->
<script lang="ts">
  import { ClientLoginForm } from '$lib/components/auth';
  import * as Card from '$lib/components/ui/card';
  import { m } from '$lib/paraglide/messages.js';
  import MaxitLogo from '$lib/assets/MaxitLogo.svelte';
  import BackgroundDecoration from '$lib/components/BackgroundDecoration.svelte';
  
  // Get redirect parameter from URL
  import { page } from '$app/stores';
  const redirectTo = $page.url.searchParams.get('redirectTo') || '/dashboard';
</script>

<div class="min-h-screen flex items-center justify-center">
  <BackgroundDecoration />
  
  <div class="w-full max-w-md">
    <div class="mb-8 flex justify-center">
      <MaxitLogo width={150} height={150} />
    </div>
    
    <Card.Root>
      <Card.Header>
        <Card.Title>{m.login_title()}</Card.Title>
        <Card.Description>{m.login_subtitle()}</Card.Description>
      </Card.Header>
      
      <Card.Content>
        <!-- Use the reusable client login form -->
        <ClientLoginForm redirectTo={redirectTo} />
      </Card.Content>
    </Card.Root>
  </div>
</div>
```

## Example 2: Custom Login Form with Client API

For more control over the form layout and behavior:

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
  let errors = $state<{ email?: string; password?: string }>({});
  
  // Create client API instance (only in browser)
  const apiClient = browser ? createClientApiClient() : null;
  const authService = apiClient ? new ClientAuthService(apiClient) : null;
  
  async function handleLogin(event: Event) {
    event.preventDefault();
    
    if (!authService) {
      toast.error('Service not available');
      return;
    }
    
    // Validation
    errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length > 0) return;
    
    isSubmitting = true;
    
    try {
      const result = await authService.login({ email, password });
      
      if (result.success) {
        toast.success('Welcome back!');
        await goto('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleLogin}>
  <div>
    <Input
      type="email"
      bind:value={email}
      placeholder="Email"
      disabled={isSubmitting}
    />
    {#if errors.email}
      <p class="text-sm text-destructive">{errors.email}</p>
    {/if}
  </div>
  
  <div>
    <Input
      type="password"
      bind:value={password}
      placeholder="Password"
      disabled={isSubmitting}
    />
    {#if errors.password}
      <p class="text-sm text-destructive">{errors.password}</p>
    {/if}
  </div>
  
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Logging in...' : 'Login'}
  </Button>
</form>
```

## Example 3: Using ClientLogoutButton

Replace remote function logout with client logout:

```svelte
<script lang="ts">
  import { ClientLogoutButton } from '$lib/components/auth';
  import { m } from '$lib/paraglide/messages.js';
  import LogOut from '@lucide/svelte/icons/log-out';
</script>

<!-- Simple usage -->
<ClientLogoutButton class="btn btn-ghost">
  Logout
</ClientLogoutButton>

<!-- With custom content -->
<ClientLogoutButton class="flex items-center gap-2">
  <LogOut class="h-4 w-4" />
  <span>{m.sidebar_logout()}</span>
</ClientLogoutButton>
```

## Example 4: Programmatic Logout

For logout triggered from JavaScript logic:

```svelte
<script lang="ts">
  import { clientLogout } from '$lib/auth/client-logout';
  
  async function handleSessionTimeout() {
    toast.info('Session expired. Please login again.');
    await clientLogout();
  }
  
  async function handleSecurityCheck() {
    const needsReauth = await checkSecurityStatus();
    if (needsReauth) {
      await clientLogout();
    }
  }
</script>
```

## Example 5: Registration Form

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { toast } from 'svelte-sonner';
  import { createClientApiClient, ClientAuthService } from '$lib/services';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  
  let formData = $state({
    email: '',
    name: '',
    surname: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  let isSubmitting = $state(false);
  
  const apiClient = browser ? createClientApiClient() : null;
  const authService = apiClient ? new ClientAuthService(apiClient) : null;
  
  async function handleRegister(event: Event) {
    event.preventDefault();
    
    if (!authService) {
      toast.error('Service not available');
      return;
    }
    
    // Validation would go here...
    
    isSubmitting = true;
    
    try {
      const result = await authService.register(formData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        await goto('/dashboard');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleRegister}>
  <Input bind:value={formData.email} placeholder="Email" />
  <Input bind:value={formData.name} placeholder="First Name" />
  <Input bind:value={formData.surname} placeholder="Last Name" />
  <Input bind:value={formData.username} placeholder="Username" />
  <Input type="password" bind:value={formData.password} placeholder="Password" />
  <Input type="password" bind:value={formData.confirmPassword} placeholder="Confirm Password" />
  
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Creating account...' : 'Register'}
  </Button>
</form>
```

## Example 6: Proactive Token Refresh

Refresh token before it expires to maintain smooth UX:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { createClientApiClient, ClientAuthService } from '$lib/services';
  
  const apiClient = browser ? createClientApiClient() : null;
  const authService = apiClient ? new ClientAuthService(apiClient) : null;
  
  // Refresh token every 10 minutes
  onMount(() => {
    if (!authService) return;
    
    const interval = setInterval(async () => {
      try {
        await authService.refreshToken();
        console.log('Token refreshed proactively');
      } catch (error) {
        console.error('Proactive refresh failed:', error);
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    return () => clearInterval(interval);
  });
</script>
```

## Example 7: Handling Auth State in Layout

Check auth status and display user info:

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { clientLogout } from '$lib/auth/client-logout';
  
  // User data comes from server-side auth check
  const user = $derived($page.data.user);
  
  async function handleLogout() {
    await clientLogout();
  }
</script>

{#if user}
  <nav>
    <span>Welcome, {user.name}!</span>
    <button onclick={handleLogout}>Logout</button>
  </nav>
{:else}
  <nav>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  </nav>
{/if}
```

## Example 8: Protected API Calls

Make authenticated requests to other endpoints:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { createClientApiClient } from '$lib/services';
  import type { ApiResponse } from '$lib/dto/response';
  import type { User } from '$lib/dto/user';
  
  let userProfile = $state<User | null>(null);
  let isLoading = $state(true);
  
  const apiClient = browser ? createClientApiClient() : null;
  
  onMount(async () => {
    if (!apiClient) return;
    
    try {
      const response = await apiClient.get<ApiResponse<User>>({
        url: '/users/profile'
      });
      
      userProfile = response.data;
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <p>Loading...</p>
{:else if userProfile}
  <div>
    <h2>{userProfile.name} {userProfile.surname}</h2>
    <p>{userProfile.email}</p>
  </div>
{:else}
  <p>Failed to load profile</p>
{/if}
```

## Example 9: Form with Loading States

Proper loading and error states:

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { toast } from 'svelte-sonner';
  import { createClientApiClient, ClientAuthService } from '$lib/services';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Loader2 } from '@lucide/svelte';
  
  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let error = $state<string | null>(null);
  
  const apiClient = browser ? createClientApiClient() : null;
  const authService = apiClient ? new ClientAuthService(apiClient) : null;
  
  async function handleSubmit(event: Event) {
    event.preventDefault();
    error = null;
    
    if (!authService) {
      error = 'Service not available';
      return;
    }
    
    isSubmitting = true;
    
    try {
      const result = await authService.login({ email, password });
      
      if (result.success) {
        await goto('/dashboard');
      } else {
        error = result.error || 'Login failed';
      }
    } catch (err) {
      error = 'An unexpected error occurred';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleSubmit}>
  {#if error}
    <div class="alert alert-error">
      {error}
    </div>
  {/if}
  
  <Input
    type="email"
    bind:value={email}
    disabled={isSubmitting}
    required
  />
  
  <Input
    type="password"
    bind:value={password}
    disabled={isSubmitting}
    required
  />
  
  <Button type="submit" disabled={isSubmitting}>
    {#if isSubmitting}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      Logging in...
    {:else}
      Login
    {/if}
  </Button>
</form>
```

## Example 10: Environment-Specific API URL

Override API URL for different environments:

```svelte
<script lang="ts">
  import { browser } from '$app/environment';
  import { createClientApiClient, ClientAuthService } from '$lib/services';
  
  // Use custom API URL based on environment
  const apiUrl = browser 
    ? import.meta.env.MODE === 'staging'
      ? 'https://staging-api.example.com/api/v1'
      : undefined // Use default from env
    : null;
  
  const apiClient = browser ? createClientApiClient(apiUrl) : null;
  const authService = apiClient ? new ClientAuthService(apiClient) : null;
</script>
```

## Best Practices

### 1. Always Check Browser Context

```typescript
const apiClient = browser ? createClientApiClient() : null;
```

### 2. Handle Service Unavailability

```typescript
if (!authService) {
  toast.error('Service not available');
  return;
}
```

### 3. Use Loading States

```typescript
let isLoading = $state(false);

async function doSomething() {
  isLoading = true;
  try {
    // ...
  } finally {
    isLoading = false;
  }
}
```

### 4. Proper Error Handling

```typescript
try {
  const result = await authService.login(data);
  if (result.success) {
    // Success
  } else {
    // Handle API error
    toast.error(result.error);
  }
} catch (error) {
  // Handle unexpected error
  console.error(error);
  toast.error('Unexpected error');
}
```

### 5. Use TypeScript Types

```typescript
import type { UserLoginDto } from '$lib/dto/user';
import type { ApiResponse } from '$lib/dto/response';
```

## Migration Checklist

When migrating a feature from remote functions to client API:

- [ ] Create/use appropriate client service
- [ ] Handle browser context check
- [ ] Implement loading states
- [ ] Add error handling
- [ ] Test success path
- [ ] Test error paths
- [ ] Test loading states
- [ ] Update navigation/redirects
- [ ] Remove old remote function (if fully migrated)
- [ ] Update documentation

## Common Pitfalls

### ❌ Don't: Create client on server

```typescript
// This will error!
const apiClient = createClientApiClient();
```

### ✅ Do: Check browser context

```typescript
const apiClient = browser ? createClientApiClient() : null;
```

### ❌ Don't: Forget loading states

```typescript
// Bad UX - no feedback
await authService.login(data);
```

### ✅ Do: Show loading states

```typescript
isSubmitting = true;
try {
  await authService.login(data);
} finally {
  isSubmitting = false;
}
```

### ❌ Don't: Ignore errors

```typescript
// Silent failure
const result = await authService.login(data);
```

### ✅ Do: Handle errors properly

```typescript
const result = await authService.login(data);
if (!result.success) {
  toast.error(result.error);
}
```

## Next Steps

After implementing authentication with client API:

1. Test thoroughly with backend
2. Monitor for errors in production
3. Migrate other features incrementally
4. Update team documentation
5. Share learnings with team
