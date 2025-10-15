<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import CircleDot from '@lucide/svelte/icons/circle-dot';
  import Circle from '@lucide/svelte/icons/circle';
  import TrendingUp from '@lucide/svelte/icons/trending-up';
  import Tag from '@lucide/svelte/icons/tag';

  interface AvailableTaskCardProps {
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    status: 'solved' | 'attempted' | 'not-attempted';
    acceptanceRate: number;
    category: string;
  }

  let { name, difficulty, status, acceptanceRate, category }: AvailableTaskCardProps = $props();

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
    solved: {
      icon: CheckCircle,
      color: 'text-green-600',
      buttonText: 'View Solution',
      buttonVariant: 'outline' as const
    },
    attempted: {
      icon: CircleDot,
      color: 'text-yellow-600',
      buttonText: 'Try Again',
      buttonVariant: 'default' as const
    },
    'not-attempted': {
      icon: Circle,
      color: 'text-gray-400',
      buttonText: 'Solve Task',
      buttonVariant: 'default' as const
    }
  };

  const diffConfig = $derived(difficultyConfig[difficulty]);
  const statConfig = $derived(statusConfig[status]);
</script>

<Card.Root
  class="group relative overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br {diffConfig.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10"
  ></div>

  <Card.Content class="relative p-4">
    <!-- Header: Difficulty & Status -->
    <div class="mb-3 flex items-center justify-between">
      <span
        class="inline-flex items-center rounded-full {diffConfig.bgColor} px-2.5 py-0.5 text-xs font-bold {diffConfig.textColor}"
      >
        {diffConfig.label}
      </span>
      {#if status === 'solved'}
        <CheckCircle class="h-5 w-5 {statConfig.color}" />
      {:else if status === 'attempted'}
        <CircleDot class="h-5 w-5 {statConfig.color}" />
      {:else}
        <Circle class="h-5 w-5 {statConfig.color}" />
      {/if}
    </div>

    <!-- Task Name -->
    <h3
      class="mb-3 text-lg font-semibold text-foreground transition-colors group-hover:text-primary"
    >
      {name}
    </h3>

    <!-- Stats Grid -->
    <div class="mb-3 grid grid-cols-2 gap-2">
      <!-- Acceptance Rate -->
      <div class="rounded-lg border border-border bg-card p-2 transition-colors hover:bg-accent">
        <div class="flex items-center gap-1.5">
          <TrendingUp class="h-3.5 w-3.5 text-primary" />
          <span class="text-xs text-muted-foreground">Acceptance</span>
        </div>
        <p class="mt-0.5 text-sm font-bold text-foreground">{acceptanceRate}%</p>
      </div>

      <!-- Category -->
      <div class="rounded-lg border border-border bg-card p-2 transition-colors hover:bg-accent">
        <div class="flex items-center gap-1.5">
          <Tag class="h-3.5 w-3.5 text-primary" />
          <span class="text-xs text-muted-foreground">Category</span>
        </div>
        <p class="mt-0.5 truncate text-sm font-bold text-foreground" title={category}>
          {category}
        </p>
      </div>
    </div>

    <!-- Action Button -->
    <Button
      variant={statConfig.buttonVariant}
      class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {statConfig.buttonText}
    </Button>
  </Card.Content>
</Card.Root>
