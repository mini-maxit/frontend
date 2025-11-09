<script>
  import MaxitLogo from '$lib/assets/MaxitLogo.svelte';
  import { isMobile } from '$lib/hooks/is-mobile.svelte';
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
  import BackgroundDecoration from '$lib/components/BackgroundDecoration.svelte';
  import { AppRoutes } from '$lib/routes';
</script>

<section
  id="hero"
  class="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] pb-16 sm:pb-0"
>
  <BackgroundDecoration />

  <div class="relative z-10 flex min-h-screen items-center justify-center px-4 pt-20">
    <div class="mx-auto max-w-7xl">
      <div class="flex flex-col items-center justify-center gap-16 lg:flex-row lg:gap-24">
        <MaxitLogo
          width={isMobile.current ? 320 : 512}
          height={isMobile.current ? 320 : 512}
          clickable={false}
        />

        <div class="flex max-w-2xl flex-col items-center lg:items-start">
          <div class="mb-8 text-center lg:text-left">
            <h1
              class="mb-6 text-3xl leading-tight tracking-tight text-primary-foreground lg:text-5xl"
            >
              {m.hero_title()}
            </h1>
          </div>
          <Button
            href={AppRoutes.Dashboard}
            size="lg"
            class="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {m.hero_cta()}
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>
