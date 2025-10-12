<script lang="ts">
  import { register } from './auth.remote';
  import { m } from '$lib/paraglide/messages.js';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import MaxitLogo from '$lib/assets/MaxitLogo.svelte';
  import { isMobile } from '$lib/hooks/is-mobile.svelte';
  import { toast } from 'svelte-sonner';
  import { AppRoutes } from '$lib/routes';
  import BackgroundDecoration from '$lib/components/BackgroundDecoration.svelte';
</script>

<div
  class="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
>
  <BackgroundDecoration />

  <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="mb-8 flex justify-center">
        <MaxitLogo width={isMobile.current ? 120 : 150} height={isMobile.current ? 120 : 150} />
      </div>

      <Card.Root class="shadow-2xl backdrop-blur-sm">
        <Card.Header class="space-y-1 text-center">
          <Card.Title class="text-2xl font-bold tracking-tight">
            {m.register_title()}
          </Card.Title>
          <Card.Description class="text-muted-foreground">
            {m.register_subtitle()}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <form
            {...register.enhance(async ({ submit }) => {
              try {
                await submit();
              } catch (error: unknown) {
                if (error instanceof Error) {
                  toast.error(error.message);
                } else {
                  toast.error('An unknown error occurred');
                }
              }
            })}
            class="space-y-4"
          >
            <div class="space-y-2">
              <Label for="email">{m.register_email_label()}</Label>
              <Input
                {...register.fields.email.as('email')}
                id="email"
                name="email"
                type="email"
                placeholder={m.register_email_placeholder()}
                required
                autocomplete="email"
                class="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="space-y-2">
              <Label for="name">{m.register_name_label()}</Label>
              <Input
                {...register.fields.name.as('text')}
                id="name"
                name="name"
                type="text"
                placeholder={m.register_name_placeholder()}
                required
                autocomplete="given-name"
                class="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="space-y-2">
              <Label for="surname">{m.register_surname_label()}</Label>
              <Input
                {...register.fields.surname.as('text')}
                id="surname"
                name="surname"
                type="text"
                placeholder={m.register_surname_placeholder()}
                required
                autocomplete="family-name"
                class="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="space-y-2">
              <Label for="username">{m.register_username_label()}</Label>
              <Input
                {...register.fields.username.as('text')}
                id="username"
                name="username"
                type="text"
                placeholder={m.register_username_placeholder()}
                required
                autocomplete="username"
                class="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="space-y-2">
              <Label for="_password">{m.register_password_label()}</Label>
              <Input
                {...register.fields._password.as('password')}
                id="_password"
                name="_password"
                type="password"
                placeholder={m.register_password_placeholder()}
                required
                autocomplete="new-password"
                class="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="space-y-2">
              <Label for="_confirmPassword">{m.register_confirm_password_label()}</Label>
              <Input
                {...register.fields._confirmPassword.as('password')}
                id="_confirmPassword"
                name="_confirmPassword"
                type="password"
                placeholder={m.register_confirm_password_placeholder()}
                required
                autocomplete="new-password"
                class="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              size="lg"
            >
              {m.register_submit()}
            </Button>
          </form>
        </Card.Content>

        <Card.Footer>
          <div class="w-full text-center text-sm text-muted-foreground">
            {m.register_have_account()}
            <a
              href={AppRoutes.Login}
              class="ml-1 font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              {m.register_login_link()}
            </a>
          </div>
        </Card.Footer>
      </Card.Root>

      <!-- Additional info -->
      <p class="mt-8 text-center text-sm text-primary-foreground/70">
        {m.footer_copyright()}
      </p>
    </div>
  </div>
</div>
