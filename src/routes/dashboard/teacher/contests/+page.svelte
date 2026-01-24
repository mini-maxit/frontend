<script lang="ts">
  import { createQuery } from '$lib/utils/query.svelte';
  import { getContestsManagementInstance } from '$lib/services';
  import { CreateContestButton, ContestsList } from '$lib/components/dashboard/admin/contests';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import Trophy from '@lucide/svelte/icons/trophy';
  import * as m from '$lib/paraglide/messages';

  const contestsManagementService = getContestsManagementInstance();

  const contestsQuery = createQuery(async () => {
    if (!contestsManagementService) throw new Error('Service unavailable');
    return await contestsManagementService.getManagedContests();
  });
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.admin_contests_title()}</h1>
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CreateContestButton onSuccess={() => contestsQuery.refresh()} />
    </div>
  </div>

  <!-- Contests List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_all_contests()}</h2>

    {#if contestsQuery.error}
      <ErrorCard
        title={m.admin_contests_load_error_title()}
        error={contestsQuery.error}
        onRetry={() => contestsQuery.refresh()}
      />
    {:else if contestsQuery.loading}
      <LoadingSpinner />
    {:else if contestsQuery.current && contestsQuery.current.length === 0}
      <EmptyState
        title={m.admin_contests_no_contests_title()}
        description={m.admin_contests_no_contests_description()}
        icon={Trophy}
      />
    {:else if contestsQuery.current}
      <ContestsList contests={contestsQuery.current} />
    {/if}
  </div>
</div>
