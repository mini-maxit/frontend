<script lang="ts">
  import AvailableContestsStats from '$lib/components/dashboard/available-contests/AvailableContestsStats.svelte';
  import AvailableContestCard from '$lib/components/dashboard/available-contests/AvailableContestCard.svelte';
  import { groupContestsByStatus } from '$lib/utils/contest';
  const { data } = $props();

  const contestGroups = $derived(groupContestsByStatus(data.contests));
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

  <!-- Stats Banner -->
  <AvailableContestsStats contests={data.contests} />

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
</div>
