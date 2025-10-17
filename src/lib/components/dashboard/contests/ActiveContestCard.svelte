<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Users from '@lucide/svelte/icons/users';
  import Clock from '@lucide/svelte/icons/clock';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import Zap from '@lucide/svelte/icons/zap';
  import { onMount, onDestroy } from 'svelte';
  import * as m from '$lib/paraglide/messages';

  interface ActiveContestCardProps {
    name: string;
    status: 'live' | 'upcoming';
    endsIn: number; // minutes until end/start
    participants: number;
    totalTasks: number;
    completedTasks: number;
    currentRank?: number;
  }

  let {
    name,
    status,
    endsIn,
    participants,
    totalTasks,
    completedTasks,
    currentRank
  }: ActiveContestCardProps = $props();

  let timeLeft = $state(endsIn);
  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    interval = setInterval(() => {
      if (timeLeft > 0 && timeLeft !== -1) {
        timeLeft--;
      }
    }, 60000); // Update every minute
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  const formatTime = (minutes: number) => {
    // Handle special case for contests with no end time
    if (minutes === -1) {
      return '∞';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    } else if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };

  const statusConfig = $derived(
    status === 'live'
      ? {
          label: m.contest_card_live(),
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-600',
          buttonText: m.contest_card_continue()
        }
      : {
          label: m.contest_card_upcoming(),
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-600',
          buttonText: m.contest_card_show()
        }
  );
</script>

<Card.Root
  class="group relative overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br {statusConfig.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <Card.Title class="text-xl transition-colors group-hover:text-primary">
          {name}
        </Card.Title>
      </div>
      <div
        class="flex items-center gap-1.5 rounded-full {statusConfig.bgColor} px-3 py-1 {statusConfig.textColor}"
      >
        <span class="relative flex h-2 w-2">
          {#if status === 'live'}
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"
            ></span>
          {/if}
          <span class="relative inline-flex h-2 w-2 rounded-full {statusConfig.bgColor}"></span>
        </span>
        <span class="text-xs font-bold">{statusConfig.label}</span>
      </div>
    </div>
  </Card.Header>

  <Card.Content class="relative space-y-4">
    <!-- Countdown Timer -->
    <div class="rounded-lg border-2 {statusConfig.textColor} border-current bg-card p-4">
      <div class="flex items-center justify-center gap-2">
        <Clock class="h-5 w-5 {statusConfig.textColor}" />
        <span class="text-sm font-medium text-muted-foreground">
          {status === 'live' ? m.contest_card_ends_in() : m.contest_card_starts_in()}
        </span>
        <span class="text-2xl font-bold {statusConfig.textColor}">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>

    <!-- Contest Info Grid -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Participants -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground"
            >{m.contest_card_participants()}</span
          >
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{participants}</p>
      </div>

      <!-- Tasks Progress -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <ListTodo class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground">{m.contest_card_tasks()}</span>
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">
          {completedTasks}/{totalTasks}
        </p>
      </div>
    </div>

    {#if currentRank && status === 'live'}
      <div class="rounded-lg bg-gradient-to-r {statusConfig.color} p-3 text-center">
        <p class="text-sm font-medium text-white">
          {m.contest_card_current_rank({ rank: currentRank })}
        </p>
      </div>
    {/if}

    <!-- Action Button -->
    <Button
      class="w-full bg-gradient-to-r {statusConfig.color} text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <Zap class="mr-2 h-4 w-4" />
      {statusConfig.buttonText}
    </Button>
  </Card.Content>
</Card.Root>
