<script lang="ts">
  import { getTasks, deleteTask } from './tasks.remote';
  import {
    TasksList,
    TasksUploadDialog,
    TasksUploadButton
  } from '$lib/components/dashboard/admin/tasks';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import Upload from '@lucide/svelte/icons/upload';
  import * as m from '$lib/paraglide/messages';

  let dialogOpen = $state(false);
  const tasksQuery = getTasks();
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
      <TasksList tasks={tasksQuery.current} {deleteTask} />
    {/if}
  </div>
</div>
