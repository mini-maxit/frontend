<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import CircleDashed from '@lucide/svelte/icons/circle-dashed';
  import Code from '@lucide/svelte/icons/code';
  import TrendingUp from '@lucide/svelte/icons/trending-up';
  import Target from '@lucide/svelte/icons/target';

  interface TaskCardProps {
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    status: 'completed' | 'in-progress' | 'not-started';
    bestScore?: number;
    maxScore: number;
    attempts: number;
  }

  let { name, difficulty, status, bestScore, maxScore, attempts }: TaskCardProps = $props();

  const difficultyConfig = {
    easy: {
      label: 'Easy',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600'
    },
    medium: {
      label: 'Medium',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-600'
    },
    hard: {
      label: 'Hard',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600'
    }
  };

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      label: 'Completed',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      buttonText: 'View Results',
      buttonVariant: 'outline' as const
    },
    'in-progress': {
      icon: Clock,
      label: 'In Progress',
      color: 'from-yellow-500 to-orange-600',
      textColor: 'text-yellow-600',
      buttonText: 'Continue',
      buttonVariant: 'default' as const
    },
    'not-started': {
      icon: CircleDashed,
      label: 'Not Started',
      color: 'from-gray-500 to-gray-600',
      textColor: 'text-gray-600',
      buttonText: 'Solve Task',
      buttonVariant: 'default' as const
    }
  };

  const diffConfig = $derived(difficultyConfig[difficulty]);
  const statConfig = $derived(statusConfig[status]);
  const scorePercentage = $derived(bestScore ? (bestScore / maxScore) * 100 : 0);
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br {diffConfig.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start justify-between gap-2">
      <span
        class="inline-flex items-center rounded-full {diffConfig.bgColor} px-2.5 py-0.5 text-xs font-bold {diffConfig.textColor}"
      >
        {diffConfig.label}
      </span>
      <span
        class="inline-flex items-center gap-1 rounded-full {statConfig.textColor} text-xs font-medium"
      >
        {#if status === 'completed'}
          <CheckCircle class="h-3.5 w-3.5" />
        {:else if status === 'in-progress'}
          <Clock class="h-3.5 w-3.5" />
        {:else}
          <CircleDashed class="h-3.5 w-3.5" />
        {/if}
        {statConfig.label}
      </span>
    </div>
    <Card.Title class="mt-3 text-lg transition-colors group-hover:text-primary">
      {name}
    </Card.Title>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    {#if status !== 'not-started'}
      <!-- Score Display -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-1.5 text-muted-foreground">
            <Target class="h-3.5 w-3.5" />
            Best Score
          </span>
          <span class="font-bold text-foreground">
            {bestScore}/{maxScore}
          </span>
        </div>
        <!-- Progress Bar -->
        <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-gradient-to-r {statConfig.color} transition-all duration-500"
            style="width: {scorePercentage}%"
          ></div>
        </div>
      </div>

      <!-- Attempts -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TrendingUp class="h-3.5 w-3.5 text-primary" />
            Attempts
          </span>
          <span class="text-sm font-bold text-foreground">{attempts}</span>
        </div>
      </div>
    {:else}
      <!-- Not Started Placeholder -->
      <div class="rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center">
        <Code class="mx-auto h-8 w-8 text-muted-foreground" />
        <p class="mt-2 text-sm text-muted-foreground">No attempts yet</p>
      </div>
    {/if}

    <!-- Action Button -->
    <Button
      variant={statConfig.buttonVariant}
      class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {statConfig.buttonText}
    </Button>
  </Card.Content>
</Card.Root>
