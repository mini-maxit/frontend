<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Zap from '@lucide/svelte/icons/zap';
  import Calendar from '@lucide/svelte/icons/calendar';
  import { calculateContestStats } from '$lib/utils/contest';
  import type { Contest } from '$lib/dto/contest';
  import * as m from '$lib/paraglide/messages';

  interface AvailableContestsStatsProps {
    contests: Contest[];
  }

  let { contests }: AvailableContestsStatsProps = $props();

  const contestStats = $derived(calculateContestStats(contests));

  const stats = $derived([
    {
      icon: Trophy,
      label: m.available_contests_stats_available(),
      value: contestStats.total.toString()
    },
    {
      icon: Zap,
      label: m.available_contests_stats_live(),
      value: contestStats.live.toString()
    },
    {
      icon: Calendar,
      label: m.available_contests_stats_upcoming(),
      value: contestStats.upcoming.toString()
    }
  ]);
</script>

<div class="grid gap-6 sm:grid-cols-3">
  {#each stats as stat (stat.label)}
    <Card.Root
      class="group relative overflow-hidden border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-[var(--secondary)]/5 to-[var(--primary)]/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
      ></div>

      <Card.Content class="relative p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p class="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-md transition-transform duration-300 group-hover:scale-110"
          >
            <stat.icon class="h-6 w-6 text-primary-foreground" />
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full origin-left scale-x-0 transform rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-transform duration-500 group-hover:scale-x-100"
          ></div>
        </div>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
