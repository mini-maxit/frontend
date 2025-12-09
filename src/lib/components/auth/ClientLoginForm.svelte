<script lang="ts">
  import { goto } from '$app/navigation';
  import * as m from '$lib/paraglide/messages.js';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { toast } from 'svelte-sonner';
  import { AppRoutes } from '$lib/routes';
  import { getClientAuthInstance, getClientUserInstance } from '$lib/services';
  import { browser } from '$app/environment';
  import { LoginSchema } from '$lib/schemas';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';

  interface Props {
    redirectTo?: string;
  }

  let { redirectTo = AppRoutes.Dashboard }: Props = $props();

  // Get singleton auth service instance
  const authService = browser ? getClientAuthInstance() : null;

  // Initialize superform for SPA mode with client-side validation
  const { form, errors, enhance, submitting } = superForm(defaults(valibot(LoginSchema)), {
    validators: valibot(LoginSchema),
    SPA: true,
    dataType: 'json',
    resetForm: false,
    async onUpdate({ form }) {
      if (!authService || !form.valid) {
        return;
      }

      try {
        const loginResult = await authService.login({
          email: form.data.email.trim(),
          password: form.data.password
        });

        if (loginResult.success) {
          // Fetch user data to populate userStore
          const userService = browser ? getClientUserInstance() : null;
          if (userService) {
            await userService.getCurrentUser();
          }

          toast.success(m.login_success());

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
      }
    }
  });
</script>

<form method="POST" use:enhance class="space-y-6">
  <div class="space-y-2">
    <Label for="email">{m.login_email_label()}</Label>
    <Input
      id="email"
      name="email"
      type="email"
      bind:value={$form.email}
      placeholder={m.login_email_placeholder()}
      autocomplete="email"
      disabled={$submitting}
      aria-invalid={$errors.email ? 'true' : undefined}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if $errors.email}
      <p class="text-sm text-destructive">{$errors.email}</p>
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
      bind:value={$form.password}
      placeholder={m.login_password_placeholder()}
      autocomplete="current-password"
      disabled={$submitting}
      aria-invalid={$errors.password ? 'true' : undefined}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if $errors.password}
      <p class="text-sm text-destructive">{$errors.password}</p>
    {/if}
  </div>

  <Button
    type="submit"
    disabled={$submitting}
    class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    size="lg"
  >
    {$submitting ? 'Loading...' : m.login_submit()}
  </Button>
</form>
