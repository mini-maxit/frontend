<script>
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
</script>

<section
  id="cta"
  class="relative overflow-hidden bg-gradient-to-br from-primary to-secondary px-4 py-20"
>
  <div class="absolute inset-0 opacity-10">
    <svg class="h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1200 600">
      <g>
        <path
          d="M100 100L300 200L500 150L700 300L900 200L1100 350"
          stroke="#F1F1F1"
          stroke-width="1"
          opacity="0.6"
        />
        <path
          d="M200 250L400 200L600 350L800 250L1000 400"
          stroke="#F1F1F1"
          stroke-width="1"
          opacity="0.6"
        />
        <path
          d="M150 450L350 350L550 500L750 400L950 550"
          stroke="#F1F1F1"
          stroke-width="1"
          opacity="0.6"
        />
        <circle cx="300" cy="200" r="2" fill="#F1F1F1" opacity="0.8" />
        <circle cx="500" cy="150" r="2" fill="#F1F1F1" opacity="0.8" />
        <circle cx="700" cy="300" r="2" fill="#F1F1F1" opacity="0.8" />
        <circle cx="600" cy="350" r="2" fill="#F1F1F1" opacity="0.8" />
        <circle cx="800" cy="250" r="2" fill="#F1F1F1" opacity="0.8" />
        <circle cx="550" cy="500" r="2" fill="#F1F1F1" opacity="0.8" />
      </g>
    </svg>
  </div>

  <div class="relative mx-auto max-w-4xl text-center">
    <h2 class="mb-6 text-3xl font-bold tracking-tight text-primary-foreground lg:text-4xl">
      {m.cta_heading()}
    </h2>

    <p
      class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed tracking-tight text-primary-foreground/90 lg:text-xl"
    >
      {m.cta_description()}
    </p>

    <Button
      size="lg"
      class="bg-primary-foreground px-8 py-6 text-lg text-primary shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-primary-foreground/90"
    >
      {m.cta_button()}
    </Button>
  </div>
</section>
