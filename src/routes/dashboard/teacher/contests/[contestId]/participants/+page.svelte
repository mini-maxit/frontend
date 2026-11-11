<script lang="ts">
  import {
    LoadingSpinner,
    ErrorCard,
    EmptyState,
    BackButton
  } from '#lib/components/common/index.js';
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import { getContestsManagementInstance } from '#lib/services/index.js';
  import {
    AddParticipantsToContestButton,
    AddGroupToContestButton,
    AssignedGroupsList,
    ParticipantsList
  } from '#lib/components/dashboard/admin/contests/index.js';
  import { SortDirection, UserSortKey } from '#lib/dto/pagination.js';
  import { readIntParam, readParam, writeSearchParams } from '#lib/utils/url-state.js';
  import { page } from '$app/state';
  import Users from '@lucide/svelte/icons/users';
  import * as m from '#lib/paraglide/messages.js';

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

  const assignableParticipantsQuery = createParameterizedQuery(
    () => contestId,
    async (id) => {
      if (!contestsService) throw new Error('Service unavailable');
      const result = await contestsService.getAssignableParticipants(id, { limit: 100 });
      return result.items;
    }
  );

  const groupsQuery = createParameterizedQuery(
    () => contestId,
    async (id) => {
      if (!contestsService) throw new Error('Service unavailable');
      return await contestsService.getContestGroups(id);
    }
  );

  const assignableGroupsQuery = createParameterizedQuery(
    () => contestId,
    async (id) => {
      if (!contestsService) throw new Error('Service unavailable');
      return await contestsService.getAssignableGroups(id);
    }
  );

  function refreshParticipants() {
    participantsQuery.refresh();
    assignableParticipantsQuery.refresh();
  }

  function refreshGroups() {
    groupsQuery.refresh();
    assignableGroupsQuery.refresh();
  }

  function refreshAll() {
    refreshParticipants();
    refreshGroups();
  }

  // A removal can shrink the effective set below the current offset; snap back to the last real page.
  $effect(() => {
    const result = participantsQuery.current;
    if (!result || result.items.length > 0 || offset === 0) return;
    const total = result.pagination.totalItems;
    offset = total > 0 ? Math.floor((total - 1) / limit) * limit : 0;
  });
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
    <div class="flex flex-wrap gap-2">
      {#if assignableParticipantsQuery.current}
        <AddParticipantsToContestButton
          {contestId}
          assignableUsers={assignableParticipantsQuery.current}
          onSuccess={() => {
            refreshParticipants();
          }}
        />
      {/if}
      {#if assignableGroupsQuery.current}
        <AddGroupToContestButton
          {contestId}
          assignableGroups={assignableGroupsQuery.current}
          onSuccess={() => {
            refreshAll();
          }}
        />
      {/if}
    </div>
  </div>

  <!-- Assigned Groups -->
  <div class="space-y-4">
    {#if groupsQuery.error}
      <ErrorCard
        title={m.contest_groups_load_error()}
        error={groupsQuery.error}
        onRetry={() => groupsQuery.refresh()}
      />
    {:else if groupsQuery.loading}
      <LoadingSpinner message={m.contest_groups_loading()} />
    {:else if groupsQuery.current && groupsQuery.current.length === 0}
      <EmptyState
        title={m.contest_groups_no_groups_title()}
        description={m.contest_groups_no_groups_description()}
        icon={Users}
      />
    {:else if groupsQuery.current}
      <AssignedGroupsList
        {contestId}
        groups={groupsQuery.current}
        onSuccess={() => {
          refreshAll();
        }}
      />
    {/if}
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
          refreshParticipants();
        }}
      />
    {/if}
  </div>
</div>
