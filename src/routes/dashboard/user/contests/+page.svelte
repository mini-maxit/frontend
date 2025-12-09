<script lang="ts">
  import ActiveContestCard from '$lib/components/dashboard/contests/ActiveContestCard.svelte';
  import PastContestCard from '$lib/components/dashboard/contests/PastContestCard.svelte';
  import { calculateTimeInMinutes, formatRelativeDate } from '$lib/utils/contest';
  import { getUserContests } from './contests.remote';
  import * as m from '$lib/paraglide/messages';
  import { Button } from '$lib/components/ui/button';

  const contestsQuery = getUserContests();
</script>

<svelte:boundary onerror={(error) => console.error('Contest page error:', error)}>
  <div class="space-y-8 p-4 sm:p-6 lg:p-8">
    <!-- Page Header -->
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight text-foreground">
        {m.user_contests_page_title()}
      </h1>
      <p class="text-lg text-muted-foreground">
        {m.user_contests_page_description()}
      </p>
    </div>

    <!-- Active Contests Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-foreground">{m.user_contests_active_section()}</h2>
        <span
          class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"
            ></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          {#if contestsQuery.loading}
            {m.contests_live_count({ count: 0 })}
          {:else if contestsQuery.current}
            {m.contests_live_count({ count: contestsQuery.current.active.length })}
          {:else}
            {m.contests_live_count({ count: 0 })}
          {/if}
        </span>
      </div>

      {#if contestsQuery.error}
        <div
          class="flex flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 p-8"
        >
          <p class="text-lg font-medium text-destructive">{m.user_contests_load_error()}</p>
          <p class="mt-1 text-sm text-muted-foreground">
            {contestsQuery.error?.message || m.error_unknown_error()}
          </p>
          <Button variant="outline" class="mt-4" onclick={() => contestsQuery.refresh()}>
            {m.error_try_again()}
          </Button>
        </div>
      {:else if contestsQuery.loading}
        <div class="grid gap-6 lg:grid-cols-3">
          {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
            <div class="h-64 animate-pulse rounded-lg bg-muted"></div>
          {/each}
        </div>
      {:else if contestsQuery.current}
        <div class="grid gap-6 lg:grid-cols-3">
          {#each contestsQuery.current.active as contest (contest.id)}
            <ActiveContestCard
              contestId={contest.id}
              name={contest.name}
              status={contest.status}
              endsIn={calculateTimeInMinutes(contest.startAt, contest.endAt, contest.status)}
              participants={contest.participantCount}
              totalTasks={contest.taskCount}
              completedTasks={contest.solvedTaskCount}
              currentRank={undefined}
            />
          {/each}
          {#if contestsQuery.current.active.length === 0}
            <div
              class="col-span-full flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8"
            >
              <p class="text-muted-foreground">{m.user_contests_no_active()}</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Past Contests Section -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-foreground">{m.user_contests_past_section()}</h2>

      {#if contestsQuery.error}
        <div
          class="flex flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 p-8"
        >
          <p class="text-lg font-medium text-destructive">{m.user_contests_past_load_error()}</p>
          <p class="mt-1 text-sm text-muted-foreground">
            {contestsQuery.error?.message || m.error_unknown_error()}
          </p>
          <Button variant="outline" class="mt-4" onclick={() => contestsQuery.refresh()}>
            {m.error_try_again()}
          </Button>
        </div>
      {:else if contestsQuery.loading}
        <div class="grid gap-6 sm:grid-cols-2">
          {#each Array.from({ length: 2 }, (_, i) => i) as i (i)}
            <div class="h-48 animate-pulse rounded-lg bg-muted"></div>
          {/each}
        </div>
      {:else if contestsQuery.current}
        <div class="grid gap-6 sm:grid-cols-2">
          {#each contestsQuery.current.past as contest (contest.id)}
            <PastContestCard
              name={contest.name}
              score={contest.score}
              maxScore={contest.maximumScore}
              completionPercentage={Math.round(contest.solvedPercentage)}
              date={formatRelativeDate(contest.endAt)}
              participants={contest.participantCount}
            />
          {/each}
          {#if contestsQuery.current.past.length === 0}
            <div
              class="col-span-full flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8"
            >
              <p class="text-muted-foreground">{m.user_contests_no_past()}</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</svelte:boundary>
