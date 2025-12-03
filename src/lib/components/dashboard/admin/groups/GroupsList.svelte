<script lang="ts">
  import type { Group } from '$lib/dto/group';
  import * as Table from '$lib/components/ui/table';
  import FolderOpen from '@lucide/svelte/icons/folder-open';
  import UserIcon from '@lucide/svelte/icons/user';
  import Calendar from '@lucide/svelte/icons/calendar';
  import { formatDistanceToNow, format, isSameDay } from 'date-fns';
  import * as m from '$lib/paraglide/messages';

  interface GroupsListProps {
    groups: Group[];
  }

  let { groups }: GroupsListProps = $props();

  function formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    const now = new Date();
    if (isSameDay(date, now)) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, 'dd/MMM/yyyy');
  }
</script>

<div class="space-y-3">
  <!-- Top bar: count -->
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div class="text-xs text-muted-foreground">
      {m.admin_groups_showing_count({
        count: groups.length,
        total: groups.length
      })}
    </div>
  </div>

  <!-- Data table -->
  <Table.Root class="mt-1">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-14">
          {m.admin_groups_column_id()}
        </Table.Head>
        <Table.Head>
          {m.admin_groups_column_name()}
        </Table.Head>
        <Table.Head class="hidden sm:table-cell">
          {m.admin_groups_column_created_by()}
        </Table.Head>
        <Table.Head class="hidden lg:table-cell">
          {m.admin_groups_column_created_at()}
        </Table.Head>
        <Table.Head class="hidden xl:table-cell">
          {m.admin_groups_column_updated_at()}
        </Table.Head>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#each groups as group (group.id)}
        <Table.Row>
          <Table.Cell class="font-mono text-xs">{group.id}</Table.Cell>
          <Table.Cell>
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <FolderOpen class="h-4 w-4 text-primary" />
              </div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate font-medium text-foreground">{group.name}</span>
              </div>
            </div>
          </Table.Cell>
          <Table.Cell class="hidden sm:table-cell">
            <div class="flex items-center gap-2 text-muted-foreground">
              <UserIcon class="h-4 w-4" />
              <span>{m.admin_groups_created_by_prefix()}{group.createdBy}</span>
            </div>
          </Table.Cell>
          <Table.Cell class="hidden lg:table-cell">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Calendar class="h-4 w-4" />
              <span class="whitespace-nowrap">
                {formatCreatedAt(group.createdAt)}
              </span>
            </div>
          </Table.Cell>
          <Table.Cell class="hidden xl:table-cell">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Calendar class="h-4 w-4" />
              <span class="whitespace-nowrap">
                {formatCreatedAt(group.updatedAt)}
              </span>
            </div>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
