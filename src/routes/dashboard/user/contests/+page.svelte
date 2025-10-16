<script lang="ts">
  import ContestsStats from '$lib/components/dashboard/contests/ContestsStats.svelte';
  import ActiveContestCard from '$lib/components/dashboard/contests/ActiveContestCard.svelte';
  import PastContestCard from '$lib/components/dashboard/contests/PastContestCard.svelte';
  import { calculateTimeInMinutes, formatRelativeDate } from '$lib/utils/contest';
  import { getUserContests } from './contests.remote';

  // Get contest data directly from API
  const contests = getUserContests();
</script>

<svelte:boundary onerror={(error) => console.error('Contest page error:', error)}>
  <div class="space-y-8 p-4 sm:p-6 lg:p-8">
    <!-- Page Header -->
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight text-foreground">Your Contests</h1>
      <p class="text-lg text-muted-foreground">
        Participate in contests and compete with other students
      </p>
    </div>

    <!-- Stats Banner -->
    <!-- <ContestsStats /> -->

    <!-- Active Contests Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-foreground">Active & Upcoming Contests</h2>
        <span
          class="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"
            ></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
          {#await contests}
            0 Live
          {:then data}
            {data.ongoing.length} Live
          {:catch}
            0 Live
          {/await}
        </span>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        {#await contests}
          <!-- Loading state -->
          {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
            <div class="h-64 animate-pulse rounded-lg bg-muted"></div>
          {/each}
        {:then data}
          {#each [...data.ongoing, ...data.upcoming] as contest (contest.id)}
            <ActiveContestCard
              name={contest.name}
              status={contest.status === 'ongoing' ? 'live' : 'upcoming'}
              endsIn={calculateTimeInMinutes(contest.startAt, contest.endAt, contest.status)}
              participants={contest.participantCount}
              totalTasks={contest.taskCount}
              completedTasks={contest.solvedTaskCount}
              currentRank={undefined}
            />
          {/each}
          {#if data.ongoing.length + data.upcoming.length === 0}
            <div
              class="col-span-full flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8"
            >
              <p class="text-muted-foreground">No active or upcoming contests</p>
            </div>
          {/if}
        {:catch}
          <div
            class="col-span-full flex items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 p-8"
          >
            <p class="text-destructive">Failed to load contests. Please try again later.</p>
          </div>
        {/await}
      </div>
    </div>

    <!-- Past Contests Section -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-foreground">Past Contests</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        {#await contests}
          <!-- Loading state -->
          {#each Array.from({ length: 2 }, (_, i) => i) as i (i)}
            <div class="h-48 animate-pulse rounded-lg bg-muted"></div>
          {/each}
        {:then data}
          {#each data.past as contest (contest.id)}
            <PastContestCard
              name={contest.name}
              score={contest.taskCount > 0
                ? Math.round(
                    (contest.solvedTaskCount / contest.taskCount) * contest.taskCount * 100
                  )
                : 0}
              maxScore={contest.taskCount * 100}
              completionPercentage={contest.taskCount > 0
                ? Math.round((contest.solvedTaskCount / contest.taskCount) * 100)
                : 0}
              date={formatRelativeDate(contest.endAt)}
              participants={contest.participantCount}
            />
          {/each}
          {#if data.past.length === 0}
            <div
              class="col-span-full flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8"
            >
              <p class="text-muted-foreground">No past contests</p>
            </div>
          {/if}
        {:catch}
          <div
            class="col-span-full flex items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 p-8"
          >
            <p class="text-destructive">Failed to load past contests. Please try again later.</p>
          </div>
        {/await}
      </div>
    </div>
  </div>
</svelte:boundary>
