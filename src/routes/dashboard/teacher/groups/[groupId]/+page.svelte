<script lang="ts">
  import { page } from '$app/state';
  import {
    LoadingSpinner,
    ErrorCard,
    EmptyState,
    BackButton
  } from '#lib/components/common/index.js';
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import { getGroupsManagementInstance } from '#lib/services/index.js';
  import {
    EditGroupDialog,
    AddUsersToGroupButton,
    RemoveUserFromGroupButton
  } from '#lib/components/dashboard/admin/groups/index.js';
  import * as Card from '#lib/components/ui/card/index.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import Users from '@lucide/svelte/icons/users';
  import Mail from '@lucide/svelte/icons/mail';
  import Edit from '@lucide/svelte/icons/pencil';
  import * as m from '#lib/paraglide/messages.js';
  import { localizeHref } from '#lib/paraglide/runtime.js';
  import { AppRoutes } from '#lib/routes.js';

  const groupId = $derived(Number(page.params.groupId));
  const groupsService = getGroupsManagementInstance();

  const groupQuery = createParameterizedQuery(
    () => groupId,
    async (id) => {
      if (!groupsService) throw new Error('Service unavailable');
      return await groupsService.getGroupById(id);
    }
  );

  const membersQuery = createParameterizedQuery(
    () => groupId,
    async (id) => {
      if (!groupsService) throw new Error('Service unavailable');
      return await groupsService.getGroupMembers(id);
    }
  );

  let editDialogOpen = $state(false);
</script>

<div class="space-y-6">
  <BackButton href="/dashboard/teacher/groups" />
  <!-- Group Header -->
  {#if groupQuery.current}
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">
          {groupQuery.current.name}
        </h1>
        <p class="text-muted-foreground">
          {m.group_details_subtitle({ groupId: groupId.toString() })}
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
    <div class="flex flex-wrap gap-2">
      <AddUsersToGroupButton {groupId} onSuccess={() => membersQuery.refresh()} />
      <Button
        variant="gradient"
        size="lg"
        href={localizeHref(`${AppRoutes.TeacherGroups}/${groupId}/collaborators`)}
      >
        <Users />
        {m.group_manage_collaborators_title()}
      </Button>
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
                  <Card.Title class="truncate">{member.name} {member.surname}</Card.Title>
                </div>
                <RemoveUserFromGroupButton
                  {groupId}
                  userId={member.id}
                  userName={`${member.name} ${member.surname}`}
                  onSuccess={() => membersQuery.refresh()}
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
  <EditGroupDialog
    group={groupQuery.current}
    bind:dialogOpen={editDialogOpen}
    onSuccess={() => groupQuery.refresh()}
  />
{/if}
