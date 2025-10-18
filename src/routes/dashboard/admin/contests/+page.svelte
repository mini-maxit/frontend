<script lang="ts">
  import { createContest, getAllContests } from './contests.remote';
  import {
    CreateContestButton,
    ContestsErrorCard,
    ContestsLoadingSpinner,
    ContestsEmptyState,
    ContestsList
  } from '$lib/components/dashboard/admin/contests';
  import * as m from '$lib/paraglide/messages';

  const contestsQuery = getAllContests();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.admin_contests_title()}</h1>
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CreateContestButton {createContest} />
    </div>
  </div>

  <!-- Contests List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_all_contests()}</h2>

    {#if contestsQuery.error}
      <ContestsErrorCard error={contestsQuery.error} onRetry={() => contestsQuery.refresh()} />
    {:else if contestsQuery.loading}
      <ContestsLoadingSpinner />
    {:else if contestsQuery.current && contestsQuery.current.length === 0}
      <ContestsEmptyState />
    {:else if contestsQuery.current}
      <ContestsList contests={contestsQuery.current} />
    {/if}
  </div>
</div>
