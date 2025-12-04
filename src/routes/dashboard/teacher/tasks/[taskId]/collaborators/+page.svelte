<script lang="ts">
  import { getTaskCollaborators } from './collaborators.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
  } from '$lib/components/ui/card';
  import Users from '@lucide/svelte/icons/users';
  import Mail from '@lucide/svelte/icons/mail';
  import Shield from '@lucide/svelte/icons/shield';
  import Calendar from '@lucide/svelte/icons/calendar';
  import * as m from '$lib/paraglide/messages';
  import { formatDistanceToNow } from 'date-fns';
  import { Permission } from '$lib/dto/accessControl';

  interface Props {
    data: {
      taskId: number;
    };
  }

  let { data }: Props = $props();

  const collaboratorsQuery = getTaskCollaborators(data.taskId);

  function getPermissionLabel(permission: Permission): string {
    switch (permission) {
      case Permission.Edit:
        return m.task_collaborators_permission_edit();
      case Permission.Manage:
        return m.task_collaborators_permission_manage();
      case Permission.Owner:
        return m.task_collaborators_permission_owner();
      default:
        return permission;
    }
  }

  function getPermissionBadgeClass(permission: Permission): string {
    switch (permission) {
      case Permission.Owner:
        return 'bg-primary/10 text-primary border border-primary/20';
      case Permission.Manage:
        return 'bg-secondary/10 text-secondary border border-secondary/20';
      case Permission.Edit:
        return 'bg-muted text-muted-foreground border border-border';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">
      {m.task_collaborators_page_title({ taskId: data.taskId.toString() })}
    </h1>
  </div>

  <div class="space-y-4">
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
        {#each collaboratorsQuery.current as collaborator (collaborator.user_id)}
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle class="truncate">{collaborator.user_name}</CardTitle>
                <span
                  class="{getPermissionBadgeClass(
                    collaborator.permission
                  )} inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                >
                  <Shield class="h-3 w-3" />
                  {getPermissionLabel(collaborator.permission)}
                </span>
              </div>
              <CardDescription class="flex items-center gap-1.5">
                <Mail class="h-3.5 w-3.5" />
                {collaborator.user_email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar class="h-3.5 w-3.5" />
                <span>{m.task_collaborators_added()}:</span>
                <span
                  >{formatDistanceToNow(new Date(collaborator.added_at), { addSuffix: true })}</span
                >
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>
