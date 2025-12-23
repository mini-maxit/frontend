<script lang="ts">
  import AdminGroupCard from '$lib/components/dashboard/groups/AdminGroupCard.svelte';
  import type { Group } from '$lib/dto/group';

  interface GroupsListProps {
    groups: Group[];
  }

  let { groups }: GroupsListProps = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each groups as group (group.id)}
    <AdminGroupCard {group} />
  {/each}
</div>
