<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import * as Card from '$lib/components/ui/card';
  import MaxitLogo from '$lib/assets/MaxitLogo.svelte';
  import { isMobile } from '$lib/hooks/is-mobile.svelte';
  import { AppRoutes } from '$lib/routes';
  import BackgroundDecoration from '$lib/components/BackgroundDecoration.svelte';
  import { ClientRegisterForm } from '$lib/components/auth';
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
          <ClientRegisterForm />
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
