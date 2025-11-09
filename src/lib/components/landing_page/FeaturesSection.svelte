<script>
  import Code from '@lucide/svelte/icons/code';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Users from '@lucide/svelte/icons/users';
  import { m } from '$lib/paraglide/messages.js';

  const features = [
    {
      icon: Code,
      title: m.features_create_title(),
      description: m.features_create_description()
    },
    {
      icon: Trophy,
      title: m.features_organize_title(),
      description: m.features_organize_description()
    },
    {
      icon: Users,
      title: m.features_engage_title(),
      description: m.features_engage_description()
    }
  ];
</script>

<section id="features" class="relative overflow-hidden bg-background px-4 py-16">
  <!-- Network Background Design -->
  <div class="absolute inset-0 opacity-5">
    <svg class="h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1444 1026">
      <g>
        <!-- Connecting lines -->
        <path
          d="M1442.44 1024.41L405.5 194.724"
          stroke="var(--primary)"
          stroke-width="1"
          opacity="0.8"
        />
        <path
          d="M517 564.479L931.555 411.374"
          stroke="var(--primary)"
          stroke-width="1"
          opacity="0.8"
        />
        <path
          d="M517 564.479L1.29451 243.231"
          stroke="var(--primary)"
          stroke-width="1"
          opacity="0.8"
        />
        <path
          d="M100 800L800 200L1200 600"
          stroke="var(--secondary)"
          stroke-width="1"
          opacity="0.6"
        />
        <path
          d="M300 900L900 300L1300 700"
          stroke="var(--secondary)"
          stroke-width="1"
          opacity="0.6"
        />
        <!-- Connection nodes -->
        <circle cx="406" cy="194" r="4" fill="var(--primary)" opacity="0.8" />
        <circle cx="517" cy="564" r="4" fill="var(--primary)" opacity="0.8" />
        <circle cx="932" cy="412" r="4" fill="var(--primary)" opacity="0.8" />
        <circle cx="1212" cy="545" r="4" fill="var(--primary)" opacity="0.8" />
        <circle cx="800" cy="200" r="3" fill="var(--secondary)" opacity="0.6" />
        <circle cx="900" cy="300" r="3" fill="var(--secondary)" opacity="0.6" />
        <circle cx="1200" cy="600" r="3" fill="var(--secondary)" opacity="0.6" />
      </g>
    </svg>
  </div>

  <div class="relative mx-auto max-w-7xl">
    <div class="mb-12 text-center">
      <div
        class="mb-8 inline-block cursor-default rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-8 py-3 text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <h2 class="m-0 text-xl tracking-tight">{m.features_heading()}</h2>
      </div>
    </div>

    <div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
      {#each features as feature}
        <div
          class="group relative rounded-2xl border border-border bg-card p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-b from-[var(--primary)]/5 via-[var(--secondary)]/5 to-[var(--primary)]/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
          ></div>

          <div class="relative z-10">
            <div
              class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-lg transition-transform duration-300 group-hover:scale-110"
            >
              <feature.icon class="h-8 w-8 text-primary-foreground" />
            </div>

            <h3
              class="mb-4 text-xl tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
            >
              {feature.title}
            </h3>

            <p class="leading-relaxed tracking-tight text-muted-foreground">
              {feature.description}
            </p>

            <div
              class="absolute right-0 bottom-[-1] left-0 h-1 origin-left scale-x-0 transform rounded-b-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-transform duration-300 group-hover:scale-x-100"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
