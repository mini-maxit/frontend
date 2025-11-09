<script lang="ts">
  import { login } from './login.remote';
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
  import { isHttpError, type HttpError } from '@sveltejs/kit';
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
          <Card.Title class="text-2xl font-bold tracking-tight">{m.login_title()}</Card.Title>
          <Card.Description class="text-muted-foreground">
            {m.login_subtitle()}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <form
            {...login.enhance(async ({ submit }) => {
              try {
                await submit();
              } catch (error: HttpError | unknown) {
                if (isHttpError(error)) {
                  toast.error(error.body.message);
                } else {
                  toast.error(m.error_default_message());
                }
              }
            })}
            class="space-y-6"
          >
            <div class="space-y-2">
              <Label for="email">{m.login_email_label()}</Label>
              <Input
                {...login.fields.email.as('email')}
                id="email"
                name="email"
                type="email"
                placeholder={m.login_email_placeholder()}
                required
                autocomplete="email"
                class="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
              {#each login.fields.email.issues() as issue}
                <p class="text-sm text-destructive">{issue.message}</p>
              {/each}
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="_password">{m.login_password_label()}</Label>
                <a
                  href="/forgot-password"
                  class="text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                  {m.login_forgot_password()}
                </a>
              </div>
              <Input
                {...login.fields._password.as('password')}
                id="_password"
                name="_password"
                type="password"
                placeholder={m.login_password_placeholder()}
                required
                autocomplete="current-password"
                class="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
              {#each login.fields._password.issues() as issue}
                <p class="text-sm text-destructive">{issue.message}</p>
              {/each}
            </div>

            <Button
              type="submit"
              class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              size="lg"
            >
              {m.login_submit()}
            </Button>
          </form>
        </Card.Content>

        <Card.Footer>
          <div class="w-full text-center text-sm text-muted-foreground">
            {m.login_no_account()}
            <a
              href={AppRoutes.Register}
              class="ml-1 font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              {m.login_register_link()}
            </a>
          </div>
        </Card.Footer>
      </Card.Root>

      <p class="mt-8 text-center text-sm text-primary-foreground/70">
        {m.footer_copyright()}
      </p>
    </div>
  </div>
</div>
