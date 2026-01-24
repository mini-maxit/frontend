<script lang="ts">
  import { createQuery } from '$lib/utils/query.svelte';
  import { getTasksManagementInstance } from '$lib/services';
  import {
    TasksList,
    TasksUploadDialog,
    TasksUploadButton
  } from '$lib/components/dashboard/admin/tasks';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import Upload from '@lucide/svelte/icons/upload';
  import * as m from '$lib/paraglide/messages';
  import { toast } from 'svelte-sonner';

  const tasksManagementService = getTasksManagementInstance();

  let dialogOpen = $state(false);
  const tasksQuery = createQuery(async () => {
    if (!tasksManagementService) throw new Error('Service unavailable');
    const result = await tasksManagementService.getCreatedTasks();
    if (!result.success) throw new Error(result.error || 'Failed to fetch tasks');
    return result.data!;
  });

  async function handleDelete(taskId: number) {
    if (!tasksManagementService) return;
    const result = await tasksManagementService.deleteTask(taskId);
    if (result.success) {
      toast.success('Task deleted successfully');
      tasksQuery.refresh();
    } else {
      toast.error(result.error || 'Failed to delete task');
    }
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.admin_tasks_title()}</h1>
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_tasks_quick_actions()}</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <TasksUploadButton onclick={() => (dialogOpen = true)} />
    </div>

    <TasksUploadDialog bind:open={dialogOpen} onSuccess={() => tasksQuery.refresh()} />
  </div>

  <!-- Tasks List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_tasks_all_tasks()}</h2>

    {#if tasksQuery.error}
      <ErrorCard
        title={m.admin_tasks_load_error_title()}
        error={tasksQuery.error}
        onRetry={() => tasksQuery.refresh()}
      />
    {:else if tasksQuery.loading}
      <LoadingSpinner />
    {:else if tasksQuery.current && tasksQuery.current.length === 0}
      <EmptyState
        title={m.admin_tasks_no_tasks_title()}
        description={m.admin_tasks_no_tasks_description()}
        icon={Upload}
      />
    {:else if tasksQuery.current}
      <TasksList tasks={tasksQuery.current} onTaskDeleted={() => tasksQuery.refresh()} />
    {/if}
  </div>
</div>
