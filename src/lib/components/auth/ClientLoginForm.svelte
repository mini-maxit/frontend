<script lang="ts">
  import { goto } from '$app/navigation';
  import { m } from '$lib/paraglide/messages.js';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { toast } from 'svelte-sonner';
  import { AppRoutes } from '$lib/routes';
  import { createClientApiClient, ClientAuthService } from '$lib/services';
  import { browser } from '$app/environment';

  interface Props {
    redirectTo?: string;
  }

  let { redirectTo = AppRoutes.Dashboard }: Props = $props();

  // Client-side state
  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let errors = $state<{ email?: string; password?: string }>({});

  // Create client API instance
  const apiClient = browser ? createClientApiClient() : null;
  const authService = apiClient ? new ClientAuthService(apiClient) : null;

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!authService) {
      toast.error('Authentication service not available');
      return;
    }

    // Reset errors
    errors = {};

    // Basic validation
    if (!email || !email.trim()) {
      errors.email = m.validation_email_required();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = m.validation_email_invalid();
      return;
    }
    if (!password || !password.trim()) {
      errors.password = m.validation_password_required();
      return;
    }

    isSubmitting = true;

    try {
      const result = await authService.login({
        email: email.trim(),
        password: password
      });

      if (result.success) {
        toast.success('Login successful!');
        // Navigate to redirect target
        await goto(redirectTo);
      } else {
        toast.error(result.error || m.error_default_message());
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(m.error_default_message());
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="space-y-6">
  <div class="space-y-2">
    <Label for="email">{m.login_email_label()}</Label>
    <Input
      id="email"
      name="email"
      type="email"
      bind:value={email}
      placeholder={m.login_email_placeholder()}
      required
      autocomplete="email"
      disabled={isSubmitting}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if errors.email}
      <p class="text-sm text-destructive">{errors.email}</p>
    {/if}
  </div>

  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <Label for="password">{m.login_password_label()}</Label>
      <a
        href="/forgot-password"
        class="text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
      >
        {m.login_forgot_password()}
      </a>
    </div>
    <Input
      id="password"
      name="password"
      type="password"
      bind:value={password}
      placeholder={m.login_password_placeholder()}
      required
      autocomplete="current-password"
      disabled={isSubmitting}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if errors.password}
      <p class="text-sm text-destructive">{errors.password}</p>
    {/if}
  </div>

  <Button
    type="submit"
    disabled={isSubmitting}
    class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    size="lg"
  >
    {isSubmitting ? 'Loading...' : m.login_submit()}
  </Button>
</form>
