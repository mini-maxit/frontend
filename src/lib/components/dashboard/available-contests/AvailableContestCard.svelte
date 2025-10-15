<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Users from '@lucide/svelte/icons/users';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import Clock from '@lucide/svelte/icons/clock';
  import Calendar from '@lucide/svelte/icons/calendar';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import { onMount, onDestroy } from 'svelte';

  interface AvailableContestCardProps {
    name: string;
    status: 'live' | 'upcoming' | 'past';
    startDate: string;
    endDate: string;
    participantCount: number;
    tasksCount: number;
    isRegistered: boolean;
    endsInMinutes?: number; // For countdown on live contests
  }

  let {
    name,
    status,
    startDate,
    endDate,
    participantCount,
    tasksCount,
    isRegistered,
    endsInMinutes
  }: AvailableContestCardProps = $props();

  let timeLeft = $state(endsInMinutes || 0);
  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    if (status === 'live' && endsInMinutes) {
      interval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
        }
      }, 60000); // Update every minute
    }
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  const formatTime = (minutes: number) => {
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

  const statusConfig = {
    live: {
      label: 'LIVE',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600'
    },
    upcoming: {
      label: 'UPCOMING',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-600'
    },
    past: {
      label: 'PAST',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-600'
    }
  };

  const config = $derived(statusConfig[status]);
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br {config.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start justify-between gap-2">
      <div
        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br {config.color} shadow-md transition-transform duration-300 group-hover:scale-110"
      >
        <Trophy class="h-5 w-5 text-white" />
      </div>
      <div
        class="flex items-center gap-1.5 rounded-full {config.bgColor} px-3 py-1 {config.textColor}"
      >
        {#if status === 'live'}
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"
            ></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        {/if}
        <span class="text-xs font-bold">{config.label}</span>
      </div>
    </div>
    <Card.Title class="mt-3 text-xl transition-colors group-hover:text-primary">
      {name}
    </Card.Title>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    <!-- Duration Display -->
    <div class="space-y-2 rounded-lg border border-border bg-card p-3">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar class="h-4 w-4 text-primary" />
        <span>Duration</span>
      </div>
      <p class="text-sm font-semibold text-foreground">
        {startDate} - {endDate}
      </p>
    </div>

    {#if status === 'live' && endsInMinutes}
      <!-- Countdown Timer for Live Contests -->
      <div class="rounded-lg border-2 {config.textColor} border-current bg-card p-3">
        <div class="flex items-center justify-center gap-2">
          <Clock class="h-4 w-4 {config.textColor}" />
          <span class="text-xs font-medium text-muted-foreground">Ends in:</span>
          <span class="text-xl font-bold {config.textColor}">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    {/if}

    <!-- Contest Info Grid -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Participants -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground">Participants</span>
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{participantCount}</p>
      </div>

      <!-- Tasks -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center gap-2">
          <ListTodo class="h-4 w-4 text-primary" />
          <span class="text-xs font-medium text-muted-foreground">Tasks</span>
        </div>
        <p class="mt-1 text-lg font-bold text-foreground">{tasksCount}</p>
      </div>
    </div>

    <!-- Registration Status & Action Buttons -->
    <div class="space-y-2">
      {#if isRegistered && status !== 'past'}
        <div
          class="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 py-2 text-green-600"
        >
          <CheckCircle class="h-4 w-4" />
          <span class="text-sm font-semibold">Registered</span>
        </div>
        <Button
          variant="default"
          class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          {status === 'live' ? 'Go to Contest' : 'View Contest'}
        </Button>
      {:else if status === 'past'}
        <Button
          variant="outline"
          class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          View Results
        </Button>
      {:else}
        <Button
          class="w-full bg-gradient-to-r {config.color} text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {status === 'live' ? 'Join Contest' : 'Register'}
        </Button>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
