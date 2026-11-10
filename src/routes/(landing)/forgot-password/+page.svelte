<script lang="ts">
  import { m } from '#lib/paraglide/messages.js';
  import * as Card from '#lib/components/ui/card/index.js';
  import MaxitLogo from '#lib/assets/MaxitLogo.svelte';
  import { isMobile } from '#lib/hooks/is-mobile.svelte.js';
  import { AppRoutes } from '#lib/routes.js';
  import BackgroundDecoration from '#lib/components/BackgroundDecoration.svelte';
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
          <Card.Title class="text-2xl font-bold tracking-tight">{m.login_forgot_title()}</Card.Title>
          <Card.Description class="text-muted-foreground">
            {m.login_forgot_message()}
          </Card.Description>
        </Card.Header>

        <Card.Footer>
          <div class="w-full text-center text-sm">
            <a
              href={AppRoutes.Login}
              class="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              {m.login_forgot_back()}
            </a>
          </div>
        </Card.Footer>
      </Card.Root>
    </div>
  </div>
</div>
