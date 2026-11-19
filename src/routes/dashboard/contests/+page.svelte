<script lang="ts">
  import { page } from '$app/state';
  import { toast } from 'svelte-sonner';
  import Trophy from '@lucide/svelte/icons/trophy';
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import { getContestInstance } from '#lib/services/index.js';
  import {
    LoadingSpinner,
    ErrorCard,
    EmptyState,
    ListPagination
  } from '#lib/components/common/index.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import PublicContestCard from '#lib/components/dashboard/contests/PublicContestCard.svelte';
  import { ContestStatus } from '#lib/dto/contest.js';
  import { readIntParam, writeSearchParams } from '#lib/utils/url-state.js';
  import { localizeHref } from '#lib/paraglide/runtime.js';
  import { AppRoutes } from '#lib/routes.js';
  import * as m from '#lib/paraglide/messages.js';

  const contestService = getContestInstance();
  const limit = 12;

  const filters = [
    { status: undefined, label: m.public_contests_filter_all() },
    { status: ContestStatus.Ongoing, label: m.contests_live_section() },
    { status: ContestStatus.Upcoming, label: m.contests_upcoming_section() },
    { status: ContestStatus.Past, label: m.contests_past_section() }
  ];

  const status = $derived(
    Object.values(ContestStatus).find((s) => s === page.url.searchParams.get('status'))
  );
  // Page clicks only shallow-update the URL, so offset is overridden locally (see teacher contests page).
  let offset = $derived(readIntParam(page.url, 'offset', 0));
  let registering = $state<number | null>(null);

  const contestsQuery = createParameterizedQuery(
    () => ({ status, limit, offset }),
    async (params) => {
      if (!contestService) throw new Error('Service unavailable');
      return await contestService.getPublicContests(params);
    }
  );

  function goToOffset(newOffset: number) {
    offset = newOffset;
    writeSearchParams({ offset: newOffset || null });
    window.scrollTo({ top: 0 });
  }

  async function handleRegister(contestId: number) {
    if (!contestService) return;
    registering = contestId;
    const result = await contestService.registerForContest(contestId);
    registering = null;
    if (result.success) {
      toast.success(m.public_contest_request_sent());
    } else {
      toast.error(result.error || m.contests_registration_error());
    }
    await contestsQuery.refresh();
  }
</script>

<div class="space-y-6">
  <div class="space-y-2">
    <h1 class="text-3xl font-bold text-foreground">{m.contests_page_title()}</h1>
    <p class="text-muted-foreground">{m.contests_page_description()}</p>
  </div>

  <div class="flex flex-wrap gap-2">
    {#each filters as filter (filter.label)}
      <Button
        size="sm"
        variant={filter.status === status ? 'default' : 'outline'}
        href={localizeHref(
          filter.status
            ? `${AppRoutes.BrowseContests}?status=${filter.status}`
            : AppRoutes.BrowseContests
        )}
      >
        {filter.label}
      </Button>
    {/each}
  </div>

  {#if contestsQuery.error}
    <ErrorCard
      title={m.contests_error_title()}
      error={contestsQuery.error}
      onRetry={() => contestsQuery.refresh()}
    />
  {:else if contestsQuery.loading}
    <LoadingSpinner message={m.contests_loading()} />
  {:else if contestsQuery.current && contestsQuery.current.pagination.totalItems === 0}
    <EmptyState
      title={m.public_contests_empty_title()}
      description={m.public_contests_empty_description()}
      icon={Trophy}
    />
  {:else if contestsQuery.current}
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each contestsQuery.current.items as contest (contest.id)}
        <PublicContestCard
          {contest}
          onRegister={handleRegister}
          isRegistering={registering === contest.id}
        />
      {/each}
    </div>
    <ListPagination
      total={contestsQuery.current.pagination.totalItems}
      {limit}
      {offset}
      totalLabel={m.public_contests_pagination_total({
        total: contestsQuery.current.pagination.totalItems
      })}
      onOffsetChange={goToOffset}
    />
  {/if}
</div>
