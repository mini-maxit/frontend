<script lang="ts">
  import { goto } from '$app/navigation';
  import * as m from '$lib/paraglide/messages.js';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { toast } from 'svelte-sonner';
  import { AppRoutes } from '$lib/routes';
  import { getClientAuthInstance } from '$lib/services';
  import { browser } from '$app/environment';
  import * as v from 'valibot';

  interface Props {
    redirectTo?: string;
  }

  let { redirectTo = AppRoutes.Dashboard }: Props = $props();

  // Client-side state
  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let errors = $state<{ email?: string; password?: string }>({});

  // Get singleton auth service instance
  const authService = browser ? getClientAuthInstance() : null;

  // Valibot schema matching the remote function pattern
  const LoginSchema = v.object({
    email: v.pipe(
      v.string(m.validation_email_required()),
      v.nonEmpty(m.validation_email_required()),
      v.email(m.validation_email_invalid())
    ),
    password: v.pipe(
      v.string(m.validation_password_required()),
      v.nonEmpty(m.validation_password_required())
    )
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!authService) {
      toast.error('Authentication service not available');
      return;
    }

    // Reset errors
    errors = {};

    // Validate with Valibot
    const result = v.safeParse(LoginSchema, {
      email: email.trim(),
      password: password
    });

    if (!result.success) {
      // Use flatten to get type-safe field-level errors
      const flatErrors = v.flatten<typeof LoginSchema>(result.issues);
      if (flatErrors.nested) {
        if (flatErrors.nested.email) {
          errors.email = flatErrors.nested.email[0];
        }
        if (flatErrors.nested.password) {
          errors.password = flatErrors.nested.password[0];
        }
      }
      return;
    }

    isSubmitting = true;

    try {
      const loginResult = await authService.login({
        email: result.output.email,
        password: result.output.password
      });

      if (loginResult.success) {
        toast.success(m.login_success());

        // Sanitize redirectTo to prevent open redirect vulnerability
        // Only allow relative paths starting with /
        let safeRedirect: string = AppRoutes.Dashboard;
        if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
          safeRedirect = redirectTo;
        }

        await goto(safeRedirect);
      } else {
        toast.error(loginResult.error || m.error_default_message());
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
