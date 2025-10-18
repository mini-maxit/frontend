<script lang="ts">
  import AvailableContestsStats from '$lib/components/dashboard/available-contests/AvailableContestsStats.svelte';
  import AvailableContestCard from '$lib/components/dashboard/available-contests/AvailableContestCard.svelte';
  import {
    getOngoingContests,
    getUpcomingContests,
    getPastContests,
    registerForContest
  } from './contests.remote';
  import { toast } from 'svelte-sonner';
  import { ContestRegistrationStatus } from '$lib/dto/contest';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import * as m from '$lib/paraglide/messages';

  const ongoingContestsQuery = getOngoingContests();
  const upcomingContestsQuery = getUpcomingContests();
  const pastContestsQuery = getPastContests();
  let registering = $state<number | null>(null);

  function handleViewContest(contestId: number) {
    // Navigate to contest detail page
    // This will work when the route /dashboard/contests/[id] is implemented
    const contestPath = '/dashboard/contests/' + contestId;
    goto(contestPath);
  }

  async function handleRegister(contestId: number) {
    registering = contestId;
    try {
      await registerForContest(contestId).updates(
        ongoingContestsQuery.withOverride((contests) =>
          contests.map((contest) =>
            contest.id === contestId
              ? { ...contest, registrationStatus: ContestRegistrationStatus.Registered }
              : contest
          )
        ),
        upcomingContestsQuery.withOverride((contests) =>
          contests.map((contest) =>
            contest.id === contestId
              ? { ...contest, registrationStatus: ContestRegistrationStatus.Registered }
              : contest
          )
        )
      );
      toast.success(m.contests_registration_success());
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(m.contests_registration_error());
    } finally {
      registering = null;
    }
  }

  function refreshAllQueries() {
    ongoingContestsQuery.refresh();
    upcomingContestsQuery.refresh();
    pastContestsQuery.refresh();
  }

  // Check if any query has an error
  const hasError = $derived(
    ongoingContestsQuery.error || upcomingContestsQuery.error || pastContestsQuery.error
  );

  // Check if any query is loading
  const isLoading = $derived(
    ongoingContestsQuery.loading || upcomingContestsQuery.loading || pastContestsQuery.loading
  );

  // Calculate all contests for stats (only when all queries have data)
  const allContests = $derived(() => {
    if (
      ongoingContestsQuery.current &&
      upcomingContestsQuery.current &&
      pastContestsQuery.current
    ) {
      return [
        ...ongoingContestsQuery.current,
        ...upcomingContestsQuery.current,
        ...pastContestsQuery.current
      ];
    }
    return [];
  });
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">{m.contests_page_title()}</h1>
    <p class="text-lg text-muted-foreground">
      {m.contests_page_description()}
    </p>
  </div>

  <!-- Global Error State -->
  {#if hasError}
    <div
      class="flex flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 p-8"
    >
      <h2 class="mb-2 text-lg font-semibold text-destructive">{m.contests_error_title()}</h2>
      <p class="mb-4 text-muted-foreground">
        {m.contests_error_description()}
      </p>
      <Button variant="outline" onclick={() => refreshAllQueries()}>
        {m.contests_try_again()}
      </Button>
    </div>
  {:else if isLoading}
    <!-- Global Loading State -->
    <div class="flex items-center justify-center py-12">
      <Loader class="h-8 w-8 animate-spin text-primary" />
      <span class="ml-2 text-muted-foreground">{m.contests_loading()}</span>
    </div>
  {:else}
    <!-- Stats Banner -->
    <AvailableContestsStats contests={allContests()} />

    <!-- Live Contests Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-foreground">{m.contests_live_section()}</h2>
        <span
          class="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"
            ></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
          {ongoingContestsQuery.current
            ? m.contests_live_count({ count: ongoingContestsQuery.current.length })
            : m.contests_live_count({ count: 0 })}
        </span>
      </div>

      {#if ongoingContestsQuery.error}
        <div
          class="flex flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 p-6"
        >
          <p class="text-destructive">{m.contests_error_title()}</p>
          <Button variant="outline" class="mt-2" onclick={() => ongoingContestsQuery.refresh()}>
            {m.contests_try_again()}
          </Button>
        </div>
      {:else if ongoingContestsQuery.loading}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
            <div class="h-64 animate-pulse rounded-lg bg-muted"></div>
          {/each}
        </div>
      {:else if ongoingContestsQuery.current && ongoingContestsQuery.current.length > 0}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each ongoingContestsQuery.current as contest (contest.id)}
            <AvailableContestCard
              {contest}
              onRegister={handleRegister}
              onViewContest={handleViewContest}
              isRegistering={registering === contest.id}
            />
          {/each}
        </div>
      {:else}
        <div
          class="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8"
        >
          <p class="text-muted-foreground">{m.user_contests_no_active()}</p>
        </div>
      {/if}
    </div>

    <!-- Upcoming Contests Section -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-foreground">{m.contests_upcoming_section()}</h2>

      {#if upcomingContestsQuery.error}
        <div
          class="flex flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 p-6"
        >
          <p class="text-destructive">{m.contests_error_title()}</p>
          <Button variant="outline" class="mt-2" onclick={() => upcomingContestsQuery.refresh()}>
            {m.contests_try_again()}
          </Button>
        </div>
      {:else if upcomingContestsQuery.loading}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
            <div class="h-64 animate-pulse rounded-lg bg-muted"></div>
          {/each}
        </div>
      {:else if upcomingContestsQuery.current && upcomingContestsQuery.current.length > 0}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each upcomingContestsQuery.current as contest (contest.id)}
            <AvailableContestCard
              {contest}
              onRegister={handleRegister}
              onViewContest={handleViewContest}
              isRegistering={registering === contest.id}
            />
          {/each}
        </div>
      {:else}
        <div
          class="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8"
        >
          <p class="text-muted-foreground">{m.user_contests_no_active()}</p>
        </div>
      {/if}
    </div>

    <!-- Past Contests Section -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-foreground">{m.contests_past_section()}</h2>

      {#if pastContestsQuery.error}
        <div
          class="flex flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 p-6"
        >
          <p class="text-destructive">{m.contests_error_title()}</p>
          <Button variant="outline" class="mt-2" onclick={() => pastContestsQuery.refresh()}>
            {m.contests_try_again()}
          </Button>
        </div>
      {:else if pastContestsQuery.loading}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
            <div class="h-64 animate-pulse rounded-lg bg-muted"></div>
          {/each}
        </div>
      {:else if pastContestsQuery.current && pastContestsQuery.current.length > 0}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each pastContestsQuery.current as contest (contest.id)}
            <AvailableContestCard
              {contest}
              onRegister={handleRegister}
              onViewContest={handleViewContest}
              isRegistering={registering === contest.id}
            />
          {/each}
        </div>
      {:else}
        <div
          class="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8"
        >
          <p class="text-muted-foreground">{m.user_contests_no_past()}</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
