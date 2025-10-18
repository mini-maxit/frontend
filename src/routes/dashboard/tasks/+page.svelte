<script lang="ts">
  import { getTasks } from './tasks.remote';
  import {
    TasksList,
    TasksErrorCard,
    TasksLoadingSpinner,
    TasksEmptyState
  } from '$lib/components/dashboard/available-tasks';
  import * as m from '$lib/paraglide/messages';

  const tasksQuery = getTasks();
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      {m.tasks_page_title()}
    </h1>
    <p class="text-lg text-muted-foreground">
      {m.tasks_page_description()}
    </p>
  </div>

  <!-- Tasks List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.tasks_all_tasks()}</h2>

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
