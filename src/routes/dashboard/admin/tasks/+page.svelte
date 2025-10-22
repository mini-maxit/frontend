<script lang="ts">
  import { getTasks } from './tasks.remote';
  import {
    TasksList,
    TasksErrorCard,
    TasksLoadingSpinner,
    TasksEmptyState,
    TasksUploadDialog,
    TasksUploadButton
  } from '$lib/components/dashboard/admin/tasks';
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

    <TasksUploadDialog
      bind:open={dialogOpen}
      onOpenChange={(open) => (dialogOpen = open)}
      onSuccess={() => tasksQuery.refresh()}
    />
  </div>

  <!-- Tasks List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_tasks_all_tasks()}</h2>

    {#if tasksQuery.error}
      <TasksErrorCard error={tasksQuery.error} onRetry={() => tasksQuery.refresh()} />
    {:else if tasksQuery.loading}
      <TasksLoadingSpinner />
    {:else if tasksQuery.current && tasksQuery.current.length === 0}
      <TasksEmptyState />
    {:else if tasksQuery.current}
      <TasksList tasks={tasksQuery.current} />
    {/if}
  </div>
</div>
