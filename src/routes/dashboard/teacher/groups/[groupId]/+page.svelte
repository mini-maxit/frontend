<script lang="ts">
  // TODO: getGroup, getGroupMembers, updateGroup were imported from group.remote which no longer exists
  // import { getGroup, getGroupMembers, updateGroup } from './group.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';

  // Placeholder functions - to be replaced when remote functions are implemented
  const getGroup = (groupId: number) => ({
    current: null,
    loading: true,
    error: null,
    refresh: () => {}
  });
  const getGroupMembers = (groupId: number) => ({
    current: null,
    loading: true,
    error: null,
    refresh: () => {}
  });
  const updateGroup = { enhance: (callback: any) => callback, fields: {} };
  import {
    EditGroupDialog,
    AddUsersToGroupButton,
    RemoveUserFromGroupButton
  } from '$lib/components/dashboard/admin/groups';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Users from '@lucide/svelte/icons/users';
  import Mail from '@lucide/svelte/icons/mail';
  import Edit from '@lucide/svelte/icons/pencil';
  import * as m from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { AppRoutes } from '$lib/routes';

  interface Props {
    data: { groupId: number };
  }

  let { data }: Props = $props();

  const groupQuery = getGroup(data.groupId);
  const membersQuery = getGroupMembers(data.groupId);

  let editDialogOpen = $state(false);
</script>

<div class="space-y-6">
  <!-- Group Header -->
  {#if groupQuery.current}
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">
          {groupQuery.current.name}
        </h1>
        <p class="text-muted-foreground">
          {m.group_details_subtitle({ groupId: data.groupId.toString() })}
        </p>
      </div>
      <Button onclick={() => (editDialogOpen = true)}>
        <Edit class="mr-2 h-4 w-4" />
        {m.groups_edit_button()}
      </Button>
    </div>
  {/if}

  <!-- Quick Actions -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AddUsersToGroupButton groupId={data.groupId} />
      <a
        href={localizeHref(`${AppRoutes.TeacherGroups}/${data.groupId}/collaborators`)}
        class="group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-primary to-secondary p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div
          class="absolute inset-0 bg-linear-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        ></div>
        <div class="relative flex flex-col items-center gap-4 text-center">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
          >
            <Users class="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-primary-foreground">
              {m.group_manage_collaborators_title()}
            </h3>
            <p class="mt-1 text-sm text-primary-foreground/80">
              {m.group_manage_collaborators_description()}
            </p>
          </div>
        </div>
      </a>
    </div>
  </div>

  <!-- Members List -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.group_members_title()}</h2>

    {#if membersQuery.error}
      <ErrorCard
        title={m.group_members_load_error()}
        error={membersQuery.error}
        onRetry={() => membersQuery.refresh()}
      />
    {:else if membersQuery.loading}
      <LoadingSpinner message={m.group_members_loading()} />
    {:else if membersQuery.current && membersQuery.current.length === 0}
      <EmptyState
        title={m.group_members_no_members_title()}
        description={m.group_members_no_members_description()}
        icon={Users}
      />
    {:else if membersQuery.current}
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {#each membersQuery.current as member (member.id)}
          <Card.Root>
            <Card.Header>
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-1">
                  <Card.Title class="truncate">{member.username}</Card.Title>
                  <p class="truncate text-sm text-muted-foreground">
                    {member.name}
                    {member.surname}
                  </p>
                </div>
                <RemoveUserFromGroupButton
                  groupId={data.groupId}
                  userId={member.id}
                  userName={member.username}
                />
              </div>
              <Card.Description class="flex items-center gap-1.5">
                <Mail class="h-3.5 w-3.5" />
                {member.email}
              </Card.Description>
            </Card.Header>
          </Card.Root>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#if groupQuery.current}
  <EditGroupDialog group={groupQuery.current} bind:dialogOpen={editDialogOpen} {updateGroup} />
{/if}
