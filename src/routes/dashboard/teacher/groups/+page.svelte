<script lang="ts">
  import { createGroup, getAllGroups } from './groups.remote';
  import { CreateGroupButton } from '$lib/components/dashboard/admin/groups';
  import GroupCard from '$lib/components/dashboard/admin/groups/GroupCard.svelte';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import Users from '@lucide/svelte/icons/users';
  import * as m from '$lib/paraglide/messages';

  const groupsQuery = getAllGroups();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.groups_management_title()}</h1>
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CreateGroupButton {createGroup} />
    </div>
  </div>

  <!-- Groups List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.groups_all_groups()}</h2>

    {#if groupsQuery.error}
      <ErrorCard
        title={m.groups_load_error_title()}
        error={groupsQuery.error}
        onRetry={() => groupsQuery.refresh()}
      />
    {:else if groupsQuery.loading}
      <LoadingSpinner message={m.groups_loading()} />
    {:else if groupsQuery.current && groupsQuery.current.length === 0}
      <EmptyState
        title={m.groups_no_groups_title()}
        description={m.groups_no_groups_description()}
        icon={Users}
      />
    {:else if groupsQuery.current}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupsQuery.current as group (group.id)}
          <GroupCard {group} />
        {/each}
      </div>
    {/if}
  </div>
</div>
