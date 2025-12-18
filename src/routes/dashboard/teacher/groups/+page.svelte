<script lang="ts">
  import { getGroups } from './groups.remote';
  import { GroupsList } from '$lib/components/dashboard/admin/groups';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import Users from '@lucide/svelte/icons/users';
  import * as m from '$lib/paraglide/messages';

  const groupsQuery = getGroups();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.admin_groups_title()}</h1>
  </div>

  <!-- Groups List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_groups_all_groups()}</h2>

    {#if groupsQuery.error}
      <ErrorCard
        title={m.admin_groups_load_error_title()}
        error={groupsQuery.error}
        onRetry={() => groupsQuery.refresh()}
      />
    {:else if groupsQuery.loading}
      <LoadingSpinner />
    {:else if groupsQuery.current && groupsQuery.current.length === 0}
      <EmptyState
        title={m.admin_groups_no_groups_title()}
        description={m.admin_groups_no_groups_description()}
        icon={Users}
      />
    {:else if groupsQuery.current}
      <GroupsList groups={groupsQuery.current} />
    {/if}
  </div>
</div>
