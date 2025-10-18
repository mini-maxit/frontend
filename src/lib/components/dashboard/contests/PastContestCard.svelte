<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Users from '@lucide/svelte/icons/users';
  import Calendar from '@lucide/svelte/icons/calendar';
  import TrendingUp from '@lucide/svelte/icons/trending-up';
  import Eye from '@lucide/svelte/icons/eye';
  import * as m from '$lib/paraglide/messages';

  interface PastContestCardProps {
    name: string;
    score: number;
    maxScore: number;
    completionPercentage: number;
    date: string;
    participants: number;
  }

  let { name, score, maxScore, completionPercentage, date, participants }: PastContestCardProps =
    $props();

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'from-green-500 to-green-600';
    if (percentage >= 70) return 'from-blue-500 to-blue-600';
    if (percentage >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const scoreColor = $derived(getScoreColor(completionPercentage));
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br {scoreColor} opacity-5 transition-opacity duration-300 group-hover:opacity-10"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start gap-3">
      <div
        class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br {scoreColor} shadow-md transition-transform duration-300 group-hover:scale-110"
      >
        <Trophy class="h-6 w-6 text-white" />
      </div>
      <div class="min-w-0 flex-1">
        <Card.Title class="text-lg transition-colors group-hover:text-primary">
          {name}
        </Card.Title>
        <p class="mt-1 text-sm text-muted-foreground">{m.past_contest_completed()}</p>
      </div>
    </div>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    <!-- Score Display -->
    <div class="rounded-lg bg-gradient-to-r {scoreColor} p-4 text-center">
      <p class="text-sm font-medium text-white/90">{m.past_contest_score_achieved()}</p>
      <p class="mt-1 text-3xl font-bold text-white">
        {score}/{maxScore}
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Completion Percentage -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <TrendingUp class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.past_contest_completion()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{completionPercentage}%</p>
      </div>

      <!-- Participants -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.past_contest_participants()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{participants}</p>
      </div>
    </div>

    <!-- Date -->
    <div class="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
      <Calendar class="h-4 w-4 text-primary" />
      <span class="text-sm text-muted-foreground">{date}</span>
    </div>

    <!-- Action Button -->
    <Button
      variant="outline"
      class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <Eye class="mr-2 h-4 w-4" />
      {m.past_contest_view_details()}
    </Button>
  </Card.Content>
</Card.Root>
