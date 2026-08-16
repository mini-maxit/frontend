<script lang="ts">
  import { LoadingSpinner, ErrorCard, EmptyState, BackButton } from '$lib/components/common';
  import { createParameterizedQuery } from '$lib/utils/query.svelte';
  import { getContestsManagementInstance } from '$lib/services';
  import {
    AddParticipantsToContestButton,
    ParticipantsList
  } from '$lib/components/dashboard/admin/contests';
  import { SortDirection, UserSortKey } from '$lib/dto/pagination';
  import { readIntParam, readParam, writeSearchParams } from '$lib/utils/url-state';
  import { page } from '$app/state';
  import Users from '@lucide/svelte/icons/users';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    data: { contestId: number };
  }

  let { data }: Props = $props();
  const contestId = $derived(data.contestId);
  const contestsService = getContestsManagementInstance();

  const initialSort = readParam(page.url, 'sort');
  const [initialSortKey, initialSortDir] = initialSort.split(':');
  const isValidSortKey = Object.values(UserSortKey).includes(initialSortKey as UserSortKey);
  const isValidSortDir = Object.values(SortDirection).includes(initialSortDir as SortDirection);

  let limit = $state(readIntParam(page.url, 'limit', 20));
  let offset = $state(readIntParam(page.url, 'offset', 0));
  let sortKey = $state<UserSortKey>(
    isValidSortKey ? (initialSortKey as UserSortKey) : UserSortKey.Name
  );
  let sortDir = $state<SortDirection>(
    isValidSortDir ? (initialSortDir as SortDirection) : SortDirection.Asc
  );

  $effect(() => {
    writeSearchParams({
      limit,
      offset,
      sort: `${sortKey}:${sortDir}`
    });
  });

  const getQueryParams = () => ({ limit, offset, sort: `${sortKey}:${sortDir}` });

  const participantsQuery = createParameterizedQuery(getQueryParams, async (params) => {
    if (!contestsService) throw new Error('Service unavailable');
    return await contestsService.getContestParticipants(contestId, params);
  });

  const assignableQuery = createParameterizedQuery(
    () => contestId,
    async (id) => {
      if (!contestsService) throw new Error('Service unavailable');
      const result = await contestsService.getAssignableParticipants(id, { limit: 100 });
      return result.items;
    }
  );
</script>

<div class="space-y-6">
  <BackButton href="/dashboard/teacher/contests" />
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">
      {m.contest_participants_page_title({ contestId: data.contestId.toString() })}
    </h1>
  </div>

  <!-- Quick Actions -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#if assignableQuery.current}
        <AddParticipantsToContestButton
          {contestId}
          assignableUsers={assignableQuery.current}
          onSuccess={() => {
            participantsQuery.refresh();
            assignableQuery.refresh();
          }}
        />
      {/if}
    </div>
  </div>

  <!-- Contest Participants Table -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.contest_participants_title()}</h2>

    {#if participantsQuery.error}
      <ErrorCard
        title={m.contest_participants_load_error()}
        error={participantsQuery.error}
        onRetry={() => participantsQuery.refresh()}
      />
    {:else if participantsQuery.loading}
      <LoadingSpinner message={m.contest_participants_loading()} />
    {:else if participantsQuery.current && participantsQuery.current.items.length === 0}
      <EmptyState
        title={m.contest_participants_no_participants_title()}
        description={m.contest_participants_no_participants_description()}
        icon={Users}
      />
    {:else if participantsQuery.current}
      <ParticipantsList
        {contestId}
        participants={participantsQuery.current.items}
        total={participantsQuery.current.pagination.totalItems}
        bind:limit
        bind:offset
        bind:sortKey
        bind:sortDir
        onSuccess={() => {
          participantsQuery.refresh();
          assignableQuery.refresh();
        }}
      />
    {/if}
  </div>
</div>
