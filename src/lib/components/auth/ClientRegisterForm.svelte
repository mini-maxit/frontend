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
  import { RegisterSchema } from '$lib/schemas';
  import { superForm } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';

  interface Props {
    redirectTo?: string;
  }

  let { redirectTo = AppRoutes.Dashboard }: Props = $props();

  // Get singleton auth service instance
  const authService = browser ? getClientAuthInstance() : null;

  // Initialize superform for SPA mode with client-side validation
  const { form, errors, enhance, submitting } = superForm(
    {
      email: '',
      name: '',
      surname: '',
      username: '',
      password: '',
      confirmPassword: ''
    },
    {
      validators: valibot(RegisterSchema),
      SPA: true,
      dataType: 'json',
      resetForm: false,
      // In SPA mode, onUpdate is called after successful client-side validation
      async onUpdate({ form }) {
        if (!authService || !form.valid) {
          return;
        }

        try {
          const registerResult = await authService.register({
            email: form.data.email.trim(),
            name: form.data.name.trim(),
            surname: form.data.surname.trim(),
            username: form.data.username.trim(),
            password: form.data.password,
            confirmPassword: form.data.confirmPassword
          });

          if (registerResult.success) {
            toast.success(m.register_success());

            // Sanitize redirectTo to prevent open redirect vulnerability
            let safeRedirect: string = AppRoutes.Dashboard;
            if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
              safeRedirect = redirectTo;
            }

            await goto(safeRedirect);
          } else {
            toast.error(registerResult.error || m.error_default_message());
          }
        } catch (error) {
          console.error('Register error:', error);
          toast.error(m.error_default_message());
        }
      }
    }
  );
</script>

<form method="POST" use:enhance class="space-y-4">
  <div class="space-y-2">
    <Label for="email">{m.register_email_label()}</Label>
    <Input
      id="email"
      name="email"
      type="email"
      bind:value={$form.email}
      placeholder={m.register_email_placeholder()}
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
    <Label for="name">{m.register_name_label()}</Label>
    <Input
      id="name"
      name="name"
      type="text"
      bind:value={$form.name}
      placeholder={m.register_name_placeholder()}
      autocomplete="given-name"
      disabled={$submitting}
      aria-invalid={$errors.name ? 'true' : undefined}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if $errors.name}
      <p class="text-sm text-destructive">{$errors.name}</p>
    {/if}
  </div>

  <div class="space-y-2">
    <Label for="surname">{m.register_surname_label()}</Label>
    <Input
      id="surname"
      name="surname"
      type="text"
      bind:value={$form.surname}
      placeholder={m.register_surname_placeholder()}
      autocomplete="family-name"
      disabled={$submitting}
      aria-invalid={$errors.surname ? 'true' : undefined}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if $errors.surname}
      <p class="text-sm text-destructive">{$errors.surname}</p>
    {/if}
  </div>

  <div class="space-y-2">
    <Label for="username">{m.register_username_label()}</Label>
    <Input
      id="username"
      name="username"
      type="text"
      bind:value={$form.username}
      placeholder={m.register_username_placeholder()}
      autocomplete="username"
      disabled={$submitting}
      aria-invalid={$errors.username ? 'true' : undefined}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if $errors.username}
      <p class="text-sm text-destructive">{$errors.username}</p>
    {/if}
  </div>

  <div class="space-y-2">
    <Label for="password">{m.register_password_label()}</Label>
    <Input
      id="password"
      name="password"
      type="password"
      bind:value={$form.password}
      placeholder={m.register_password_placeholder()}
      autocomplete="new-password"
      disabled={$submitting}
      aria-invalid={$errors.password ? 'true' : undefined}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if $errors.password}
      <p class="text-sm text-destructive">{$errors.password}</p>
    {/if}
  </div>

  <div class="space-y-2">
    <Label for="confirmPassword">{m.register_confirm_password_label()}</Label>
    <Input
      id="confirmPassword"
      name="confirmPassword"
      type="password"
      bind:value={$form.confirmPassword}
      placeholder={m.register_confirm_password_placeholder()}
      autocomplete="new-password"
      disabled={$submitting}
      aria-invalid={$errors.confirmPassword ? 'true' : undefined}
      class="transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
    {#if $errors.confirmPassword}
      <p class="text-sm text-destructive">{$errors.confirmPassword}</p>
    {/if}
  </div>

  <Button
    type="submit"
    disabled={$submitting}
    class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    size="lg"
  >
    {$submitting ? 'Loading...' : m.register_submit()}
  </Button>
</form>
