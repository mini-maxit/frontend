<script lang="ts">
  import { getGroups } from './groups.remote';
  import { GroupsList } from '$lib/components/dashboard/admin/groups';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import { Input } from '$lib/components/ui/input';
  import type { Group } from '$lib/dto/group';
  import FolderOpen from '@lucide/svelte/icons/folder-open';
  import Search from '@lucide/svelte/icons/search';
  import * as m from '$lib/paraglide/messages';

  let groupsQuery = $derived(getGroups());

  let searchQuery = $state('');

  let filteredGroups: Group[] = $derived.by(() => {
    if (!groupsQuery.current) return [];

    let filtered = groupsQuery.current.items;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((group) => group.name.toLowerCase().includes(query));
    }

    return filtered;
  });
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.admin_groups_title()}</h1>
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_groups_search_filter()}</h2>

    <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div class="relative">
        <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={m.admin_groups_search_placeholder()}
          bind:value={searchQuery}
          class="pl-9"
        />
      </div>
    </div>
  </div>

  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-foreground">{m.admin_groups_all_groups()}</h2>
      {#if groupsQuery.current}
        <p class="text-sm text-muted-foreground">
          {m.admin_groups_showing_count({
            count: filteredGroups.length,
            total: filteredGroups.length
          })}
        </p>
      {/if}
    </div>

    {#if groupsQuery.error}
      <ErrorCard
        title={m.admin_groups_load_error()}
        error={groupsQuery.error}
        onRetry={() => groupsQuery.refresh()}
      />
    {:else if groupsQuery.loading}
      <LoadingSpinner />
    {:else if groupsQuery.current && groupsQuery.current.items.length === 0}
      <EmptyState
        title={m.admin_groups_no_groups_title()}
        description={m.admin_groups_no_groups_description()}
        icon={FolderOpen}
      />
    {:else if filteredGroups.length === 0}
      <EmptyState
        title={m.admin_groups_no_matching_title()}
        description={m.admin_groups_no_matching_description()}
        icon={FolderOpen}
      />
    {:else}
      <GroupsList groups={filteredGroups} />
    {/if}
  </div>
</div>
