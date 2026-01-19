<script lang="ts">
  // TODO: getContestGroups, getAssignableGroups were imported from groups.remote which no longer exists
  // import { getContestGroups, getAssignableGroups } from './groups.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';

  // Placeholder functions - to be replaced when remote functions are implemented
  const getContestGroups = (contestId: number) => ({
    current: null,
    loading: true,
    error: null,
    refresh: () => {}
  });
  const getAssignableGroups = (contestId: number) => ({
    current: null,
    loading: true,
    error: null,
    refresh: () => {}
  });
  import {
    AddGroupToContestButton,
    RemoveGroupFromContestButton
  } from '$lib/components/dashboard/admin/contests';
  import * as Card from '$lib/components/ui/card';
  import Users from '@lucide/svelte/icons/users';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    data: { contestId: number };
  }

  let { data }: Props = $props();

  const groupsQuery = getContestGroups(data.contestId);
  const assignableQuery = getAssignableGroups(data.contestId);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">
      {m.contest_groups_page_title({ contestId: data.contestId.toString() })}
    </h1>
  </div>

  <!-- Quick Actions -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#if assignableQuery.current}
        <AddGroupToContestButton
          contestId={data.contestId}
          assignableGroups={assignableQuery.current}
        />
      {/if}
    </div>
  </div>

  <!-- Contest Groups List -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.contest_groups_title()}</h2>

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
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {#each groupsQuery.current as group (group.id)}
          <Card.Root>
            <Card.Header>
              <div class="flex items-center justify-between">
                <Card.Title>{group.name}</Card.Title>
                <RemoveGroupFromContestButton
                  contestId={data.contestId}
                  groupId={group.id}
                  groupName={group.name}
                />
              </div>
            </Card.Header>
            <Card.Content>
              <p class="text-sm text-muted-foreground">
                {m.group_card_id()}: #{group.id}
              </p>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    {/if}
  </div>
</div>
