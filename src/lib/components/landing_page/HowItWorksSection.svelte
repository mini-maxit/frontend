<script>
  import Settings from '@lucide/svelte/icons/settings';
  import Zap from '@lucide/svelte/icons/zap';
  import Award from '@lucide/svelte/icons/award';
  import { m } from '$lib/paraglide/messages.js';

  const steps = [
    {
      title: m.how_it_works_create_title(),
      description: m.how_it_works_create_description(),
      icon: Settings
    },
    {
      title: m.how_it_works_compete_title(),
      description: m.how_it_works_compete_description(),
      icon: Zap
    },
    {
      title: m.how_it_works_evaluate_title(),
      description: m.how_it_works_evaluate_description(),
      icon: Award
    }
  ];
</script>

<section id="howitworks" class="relative overflow-hidden bg-background px-4 py-16">
  <!-- Subtle Network Background -->
  <div class="absolute inset-0 opacity-5">
    <svg class="h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1200 800">
      <g>
        <path
          d="M100 100L300 200L500 150L700 300L900 200L1100 350"
          stroke="var(--primary)"
          stroke-width="1"
          opacity="0.6"
        />
        <path
          d="M200 400L400 300L600 450L800 350L1000 500"
          stroke="var(--secondary)"
          stroke-width="1"
          opacity="0.6"
        />
        <circle cx="300" cy="200" r="2" fill="var(--primary)" opacity="0.8" />
        <circle cx="700" cy="300" r="2" fill="var(--secondary)" opacity="0.8" />
        <circle cx="900" cy="200" r="2" fill="var(--primary)" opacity="0.8" />
      </g>
    </svg>
  </div>

  <div class="relative mx-auto max-w-7xl">
    <div class="mb-16 text-center">
      <div
        class="mb-8 inline-block cursor-default rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-3 text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <h2 class="m-0 text-xl tracking-tight">{m.how_it_works_heading()}</h2>
      </div>
      <p class="mx-auto max-w-3xl text-lg tracking-tight text-muted-foreground">
        {m.how_it_works_description()}
      </p>
    </div>

    <div class="mb-16 hidden lg:block">
      <div class="flex items-start justify-between px-8">
        {#each steps as step, index}
          <div class="relative z-10 flex w-80 flex-col items-center">
            <div class="mb-4 flex items-center">
              {#if index > 0}
                <div
                  class="-ml-40 h-1 w-40 bg-gradient-to-r from-transparent via-secondary to-primary"
                ></div>
              {/if}

              <div class="h-4 w-4 flex-shrink-0 rounded-full bg-primary"></div>

              {#if index < steps.length - 1}
                <div
                  class="-mr-40 h-1 w-40 bg-gradient-to-r from-primary via-secondary to-transparent"
                ></div>
              {/if}
            </div>

            <div
              class="mb-4 h-8 w-0.5 bg-gradient-to-b from-primary to-transparent opacity-60"
            ></div>

            <div
              class="group relative w-full overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                class="pointer-events-none absolute top-0 right-0 translate-x-8 -translate-y-4 transform text-[12rem] leading-none font-bold text-primary opacity-[0.08] select-none"
              >
                {index + 1}
              </div>

              <div
                class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-30"
              ></div>

              <div class="relative z-10 text-center">
                <div class="mb-6 flex justify-center">
                  <div
                    class="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md transition-transform duration-300 group-hover:scale-110"
                  >
                    <step.icon class="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>

                <h3
                  class="mb-4 text-xl tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
                >
                  {step.title}
                </h3>

                <p class="text-sm leading-relaxed tracking-tight text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="lg:hidden">
      <div class="flex flex-col items-center">
        {#each steps as step, index}
          <div class="flex flex-col items-center">
            <div
              class="group relative mb-3 w-80 max-w-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                class="pointer-events-none absolute top-0 right-0 translate-x-3 -translate-y-1 transform text-[6rem] leading-none font-bold text-primary opacity-[0.08] select-none"
              >
                {index + 1}
              </div>

              <div
                class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-30"
              ></div>

              <div class="relative z-10 text-center">
                <div class="mb-4 flex justify-center">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md transition-transform duration-300 group-hover:scale-110"
                  >
                    <step.icon class="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>

                <h3
                  class="mb-3 text-lg tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
                >
                  {step.title}
                </h3>

                <p class="text-sm leading-relaxed tracking-tight text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>

            {#if index < steps.length - 1}
              <div class="mb-3 flex justify-center">
                <div class="flex flex-col items-center">
                  <div
                    class="h-4 w-0.5 bg-gradient-to-b from-primary to-secondary opacity-60"
                  ></div>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" class="mt-1">
                    <path
                      d="M10 2L10 18M10 18L4 12M10 18L16 12"
                      stroke="var(--secondary)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
