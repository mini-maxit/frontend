<script lang="ts">
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import { page } from '$app/state';
  import { getContestsManagementInstance } from '#lib/services/index.js';
  import {
    CreateContestButton,
    ContestsList
  } from '#lib/components/dashboard/admin/contests/index.js';
  import {
    LoadingSpinner,
    ErrorCard,
    EmptyState,
    ListPagination
  } from '#lib/components/common/index.js';
  import { readIntParam, writeSearchParams } from '#lib/utils/url-state.js';
  import Trophy from '@lucide/svelte/icons/trophy';
  import * as m from '#lib/paraglide/messages.js';

  const contestsManagementService = getContestsManagementInstance();

  // Admin "All Contests" sidebar entry opens this page with ?scope=all
  const showAll = $derived(page.url.searchParams.get('scope') === 'all');
  // Read from the URL so reloads keep the page and switching scope (a real navigation) resets it.
  // Page clicks only shallow-update the URL, which doesn't change page.url, so offset is
  // overridden locally (writable $derived) and re-derived on the next real navigation.
  const limit = $derived(readIntParam(page.url, 'limit', 12));
  let offset = $derived(readIntParam(page.url, 'offset', 0));

  const contestsQuery = createParameterizedQuery(
    () => ({ all: showAll, limit, offset }),
    async (params) => {
      if (!contestsManagementService) throw new Error('Service unavailable');
      return await contestsManagementService.getManagedContests(params);
    }
  );

  function goToOffset(newOffset: number) {
    offset = newOffset;
    writeSearchParams({ offset: newOffset || null });
    window.scrollTo({ top: 0 });
  }
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
    {:else if contestsQuery.current && contestsQuery.current.pagination.totalItems === 0}
      <EmptyState
        title={m.admin_contests_no_contests_title()}
        description={m.admin_contests_no_contests_description()}
        icon={Trophy}
      />
    {:else if contestsQuery.current}
      <ContestsList
        contests={contestsQuery.current.items}
        onContestUpdated={() => contestsQuery.refresh()}
      />
      <ListPagination
        total={contestsQuery.current.pagination.totalItems}
        {limit}
        {offset}
        totalLabel={m.admin_contests_pagination_total({
          total: contestsQuery.current.pagination.totalItems
        })}
        onOffsetChange={goToOffset}
      />
    {/if}
  </div>
</div>
