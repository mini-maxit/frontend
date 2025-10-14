<script lang="ts">
  import AvailableContestsStats from '$lib/components/dashboard/available-contests/AvailableContestsStats.svelte';
  import AvailableContestCard from '$lib/components/dashboard/available-contests/AvailableContestCard.svelte';
  import { getContests } from './contests.remote';

  const contestsQuery = getContests();

  const contestGroups = $derived.by(() => {
    if (contestsQuery.error || contestsQuery.loading) return { live: [], upcoming: [], past: [] };
    const contests = contestsQuery.current || [];
    return {
      live: contests.filter((c) => c.status === 'live'),
      upcoming: contests.filter((c) => c.status === 'upcoming'),
      past: contests.filter((c) => c.status === 'past')
    };
  });

  const liveContests = $derived(contestGroups.live);
  const upcomingContests = $derived(contestGroups.upcoming);
  const pastContests = $derived(contestGroups.past);
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">Available Contests</h1>
    <p class="text-lg text-muted-foreground">
      Browse and join contests to compete with other students
    </p>
  </div>

  <!-- Loading State -->
  {#if contestsQuery.loading}
    <div class="flex items-center justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
      <span class="ml-2 text-muted-foreground">Loading contests...</span>
    </div>
  {:else if contestsQuery.error}
    <!-- Error State -->
    <div class="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
      <h2 class="mb-2 text-lg font-semibold text-destructive">Failed to load contests</h2>
      <p class="mb-4 text-muted-foreground">
        Something went wrong while fetching the contest data.
      </p>
      <button
        onclick={() => contestsQuery.refresh()}
        class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  {:else}
    <!-- Stats Banner -->
    <AvailableContestsStats contests={contestsQuery.current || []} />

    <!-- Live Contests Section -->
    {#if liveContests.length > 0}
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-foreground">Live Contests</h2>
          <span
            class="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"
              ></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            {liveContests.length} Live
          </span>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each liveContests as contest (contest.id)}
            <AvailableContestCard
              name={contest.name}
              status={contest.status}
              startDate={contest.startDate}
              endDate={contest.endDate}
              participantCount={contest.participantCount ?? 0}
              tasksCount={contest.tasksCount ?? 0}
              isRegistered={contest.isRegistered ?? false}
              endsInMinutes={contest.endsInMinutes}
            />
          {/each}
        </div>
      </div>
    {/if}

    <!-- Upcoming Contests Section -->
    {#if upcomingContests.length > 0}
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-foreground">Upcoming Contests</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each upcomingContests as contest (contest.id)}
            <AvailableContestCard
              name={contest.name}
              status={contest.status}
              startDate={contest.startDate}
              endDate={contest.endDate}
              participantCount={contest.participantCount ?? 0}
              tasksCount={contest.tasksCount ?? 0}
              isRegistered={contest.isRegistered ?? false}
            />
          {/each}
        </div>
      </div>
    {/if}

    <!-- Past Contests Section -->
    {#if pastContests.length > 0}
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-foreground">Past Contests</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each pastContests as contest (contest.id)}
            <AvailableContestCard
              name={contest.name}
              status={contest.status}
              startDate={contest.startDate}
              endDate={contest.endDate}
              participantCount={contest.participantCount ?? 0}
              tasksCount={contest.tasksCount ?? 0}
              isRegistered={contest.isRegistered ?? false}
            />
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>
