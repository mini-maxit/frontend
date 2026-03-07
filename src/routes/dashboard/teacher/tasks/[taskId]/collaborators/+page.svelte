<script lang="ts">
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import { createParameterizedQuery } from '$lib/utils/query.svelte';
  import { getAccessControlInstance } from '$lib/services';
  import {
    AddCollaboratorButton,
    CollaboratorPermissionEditor,
    RemoveCollaboratorButton
  } from '$lib/components/dashboard/admin/tasks';
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
  import { Permission, ResourceType, type Collaborator } from '$lib/dto/accessControl';
  import type { PaginatedData } from '$lib/dto/response';
  import type { User } from '$lib/dto/user';

  interface Props {
    data: {
      taskId: number;
      currentUserId: number;
    };
  }

  let { data }: Props = $props();
  const taskId = $derived(data.taskId);
  const accessControlService = getAccessControlInstance();

  const collaboratorsQuery = createParameterizedQuery(
    () => taskId,
    async (id) => {
      if (!accessControlService) throw new Error('Service unavailable');
      const result = await accessControlService.getCollaborators(ResourceType.Tasks, id);
      if (!result.success) throw new Error(result.error || 'Failed to fetch collaborators');
      return result.data ?? [];
    }
  );

  const assignableUsersQuery = createParameterizedQuery(
    () => taskId,
    async (id): Promise<PaginatedData<User>> => {
      if (!accessControlService) throw new Error('Service unavailable');
      const result = await accessControlService.getAssignableUsers(ResourceType.Tasks, id);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch assignable users');
      }
      return result.data;
    }
  );

  // Get current user's permission level
  const currentUserPermission = $derived.by(() => {
    if (!collaboratorsQuery.current) return Permission.Edit;
    const currentUserCollaborator = collaboratorsQuery.current.find(
      (c: Collaborator) => c.userId === data.currentUserId
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
      {m.task_collaborators_page_title({ taskId: data.taskId.toString() })}
    </h1>
  </div>

  <!-- Quick Actions Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AddCollaboratorButton
        {taskId}
        users={assignableUsersQuery.current ?? undefined}
        usersLoading={assignableUsersQuery.loading}
        usersError={assignableUsersQuery.error}
        onSuccess={() => {
          collaboratorsQuery.refresh();
          assignableUsersQuery.refresh();
        }}
      />
    </div>
  </div>

  <!-- Collaborators List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.task_collaborators_title()}</h2>

    {#if collaboratorsQuery.error}
      <ErrorCard
        title={m.task_collaborators_load_error()}
        error={collaboratorsQuery.error}
        onRetry={() => collaboratorsQuery.refresh()}
      />
    {:else if collaboratorsQuery.loading}
      <LoadingSpinner message={m.task_collaborators_loading()} />
    {:else if collaboratorsQuery.current && collaboratorsQuery.current.length === 0}
      <EmptyState
        title={m.task_collaborators_no_collaborators_title()}
        description={m.task_collaborators_no_collaborators_description()}
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
                  <CollaboratorPermissionEditor
                    {taskId}
                    userId={collaborator.userId}
                    userName={collaborator.userName}
                    currentPermission={collaborator.permission}
                    canEdit={canEditCollaborators}
                    onSuccess={() => collaboratorsQuery.refresh()}
                  />
                  <RemoveCollaboratorButton
                    {taskId}
                    userId={collaborator.userId}
                    userName={collaborator.userName}
                    targetPermission={collaborator.permission}
                    {currentUserPermission}
                    onSuccess={() => {
                      collaboratorsQuery.refresh();
                      assignableUsersQuery.refresh();
                    }}
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
                <span>{m.task_collaborators_added()}:</span>
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
