<script>
  import MaxitLogo from '$lib/assets/MaxitLogo.svelte';
  import { isMobile } from '$lib/hooks/is-mobile.svelte';
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
</script>

<section
  id="hero"
  class="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] pb-16 sm:pb-0"
>
  <div class="absolute inset-0 opacity-20">
    <svg
      class="h-full w-full"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 800"
    >
      <g>
        <!-- Connecting lines -->
        <path
          d="M100 100L300 200L500 150L700 300L900 200L1100 350"
          stroke="var(--primary-foreground)"
          stroke-width="1"
          opacity="0.6"
        />
        <path
          d="M200 400L400 300L600 450L800 350L1000 500"
          stroke="var(--primary-foreground)"
          stroke-width="1"
          opacity="0.6"
        />
        <path
          d="M150 600L350 500L550 650L750 550L950 700"
          stroke="var(--primary-foreground)"
          stroke-width="1"
          opacity="0.6"
        />
        <!-- Connection nodes -->
        <circle cx="100" cy="100" r="3" fill="var(--primary-foreground)" opacity="0.8" />
        <circle cx="300" cy="200" r="3" fill="var(--primary-foreground)" opacity="0.8" />
        <circle cx="500" cy="150" r="3" fill="var(--primary-foreground)" opacity="0.8" />
        <circle cx="700" cy="300" r="3" fill="var(--primary-foreground)" opacity="0.8" />
        <circle cx="900" cy="200" r="3" fill="var(--primary-foreground)" opacity="0.8" />
        <circle cx="200" cy="400" r="3" fill="var(--primary-foreground)" opacity="0.8" />
        <circle cx="400" cy="300" r="3" fill="var(--primary-foreground)" opacity="0.8" />
        <circle cx="600" cy="450" r="3" fill="var(--primary-foreground)" opacity="0.8" />
        <circle cx="800" cy="350" r="3" fill="var(--primary-foreground)" opacity="0.8" />
      </g>
    </svg>
  </div>

  <div class="relative z-10 flex min-h-screen items-center justify-center px-4 pt-20">
    <div class="mx-auto max-w-7xl">
      <div class="flex flex-col items-center justify-center gap-16 lg:flex-row lg:gap-24">
        <MaxitLogo width={isMobile.current ? 320 : 512} height={isMobile.current ? 320 : 512} />

        <div class="flex max-w-2xl flex-col items-center lg:items-start">
          <div class="mb-8 text-center lg:text-left">
            <h1
              class="mb-6 text-3xl leading-tight tracking-tight text-primary-foreground lg:text-5xl"
            >
              {m.hero_title()}
            </h1>
          </div>
          <Button
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
