<script lang="ts">
  import type { GroupWithMembers } from '#lib/dto/group.js';
  import * as Table from '#lib/components/ui/table/index.js';
  import * as m from '#lib/paraglide/messages.js';
  import RemoveGroupFromContestButton from './RemoveGroupFromContestButton.svelte';

  interface Props {
    groups: GroupWithMembers[];
    contestId: number;
    onSuccess?: () => void;
  }

  let { groups, contestId, onSuccess }: Props = $props();

  const badgeClass =
    'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20';

  function formatMemberName(member: GroupWithMembers['members'][number]): string {
    return `${member.name} ${member.surname}`;
  }
</script>

<div class="space-y-3">
  <h2 class="text-2xl font-bold text-foreground">{m.contest_groups_assigned_title()}</h2>

  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>{m.groups_form_name_label()}</Table.Head>
        <Table.Head>{m.contest_groups_members_column()}</Table.Head>
        <Table.Head>{m.contest_groups_access_granted_column()}</Table.Head>
        <Table.Head class="text-right">{m.contest_participants_column_actions()}</Table.Head>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#each groups as group (group.id)}
        <Table.Row>
          <Table.Cell>
            <span class={badgeClass}>{group.name}</span>
          </Table.Cell>
          <Table.Cell>{group.members.length}</Table.Cell>
          <Table.Cell>
            {#if group.members.length > 0}
              <span class="text-sm text-foreground">
                {group.members.map(formatMemberName).join(', ')}
              </span>
            {:else}
              <span class="text-muted-foreground">{m.contest_groups_no_members()}</span>
            {/if}
          </Table.Cell>
          <Table.Cell class="text-right">
            <RemoveGroupFromContestButton
              {contestId}
              groupId={group.id}
              groupName={group.name}
              {onSuccess}
            />
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
