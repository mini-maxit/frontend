<script lang="ts">
  import {
    getGroupCollaborators,
    getAssignableUsers,
    addCollaborator,
    updateCollaborator,
    removeCollaborator
  } from './collaborators.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import {
    AddGroupCollaboratorButton,
    GroupCollaboratorPermissionEditor,
    RemoveGroupCollaboratorButton
  } from '$lib/components/dashboard/admin/groups';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
  } from '$lib/components/ui/card';
  import Users from '@lucide/svelte/icons/users';
  import Mail from '@lucide/svelte/icons/mail';
  import Calendar from '@lucide/svelte/icons/calendar';
  import * as m from '$lib/paraglide/messages';
  import { formatDistanceToNow } from 'date-fns';
  import { Permission } from '$lib/dto/accessControl';

  interface Props {
    data: {
      groupId: number;
      currentUserId: number;
    };
  }

  let { data }: Props = $props();

  const collaboratorsQuery = getGroupCollaborators(data.groupId);
  const assignableUsersQuery = getAssignableUsers(data.groupId);

  // Get current user's permission level
  const currentUserPermission = $derived.by(() => {
    if (!collaboratorsQuery.current) return Permission.Edit;
    const currentUserCollaborator = collaboratorsQuery.current.find(
      (c) => c.userId === data.currentUserId
    );
    return currentUserCollaborator?.permission ?? Permission.Edit;
  });

  // Check if current user has manage or owner permission (can edit other collaborators)
  const canEditCollaborators = $derived(
    currentUserPermission === Permission.Manage || currentUserPermission === Permission.Owner
  );
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">
      {m.group_collaborators_page_title({ groupId: data.groupId.toString() })}
    </h1>
  </div>

  <!-- Quick Actions Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AddGroupCollaboratorButton
        groupId={data.groupId}
        {addCollaborator}
        users={assignableUsersQuery.current}
        usersLoading={assignableUsersQuery.loading}
        usersError={assignableUsersQuery.error}
      />
    </div>
  </div>

  <!-- Collaborators List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.group_collaborators_title()}</h2>

    {#if collaboratorsQuery.error}
      <ErrorCard
        title={m.group_collaborators_load_error()}
        error={collaboratorsQuery.error}
        onRetry={() => collaboratorsQuery.refresh()}
      />
    {:else if collaboratorsQuery.loading}
      <LoadingSpinner message={m.group_collaborators_loading()} />
    {:else if collaboratorsQuery.current && collaboratorsQuery.current.length === 0}
      <EmptyState
        title={m.group_collaborators_no_collaborators_title()}
        description={m.group_collaborators_no_collaborators_description()}
        icon={Users}
      />
    {:else if collaboratorsQuery.current}
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {#each collaboratorsQuery.current as collaborator (collaborator.userId)}
          <Card class="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader>
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-1">
                  <CardTitle class="truncate">{collaborator.userName}</CardTitle>
                  <p class="truncate text-sm text-muted-foreground">
                    {collaborator.firstName}
                    {collaborator.lastName}
                  </p>
                </div>
                <div class="flex items-center gap-1">
                  <GroupCollaboratorPermissionEditor
                    groupId={data.groupId}
                    userId={collaborator.userId}
                    userName={collaborator.userName}
                    currentPermission={collaborator.permission}
                    {updateCollaborator}
                    canEdit={canEditCollaborators}
                  />
                  <RemoveGroupCollaboratorButton
                    groupId={data.groupId}
                    userId={collaborator.userId}
                    userName={collaborator.userName}
                    targetPermission={collaborator.permission}
                    {currentUserPermission}
                    {removeCollaborator}
                  />
                </div>
              </div>
              <CardDescription class="flex items-center gap-1.5">
                <Mail class="h-3.5 w-3.5" />
                {collaborator.userEmail}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar class="h-3.5 w-3.5" />
                <span>{m.group_collaborators_added()}:</span>
                <span
                  >{formatDistanceToNow(new Date(collaborator.addedAt), { addSuffix: true })}</span
                >
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>
