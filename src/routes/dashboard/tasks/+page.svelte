<script lang="ts">
  import { getTasks } from './tasks.remote';
  import { TasksList } from '$lib/components/dashboard/available-tasks';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import FileQuestion from '@lucide/svelte/icons/file-question';
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
      <ErrorCard
        title={m.tasks_load_error()}
        error={tasksQuery.error}
        onRetry={() => tasksQuery.refresh()}
        inCard
      />
    {:else if tasksQuery.loading}
      <LoadingSpinner message={m.tasks_loading()} />
    {:else if tasksQuery.current && tasksQuery.current.length === 0}
      <EmptyState
        title={m.tasks_no_tasks()}
        description={m.tasks_no_tasks_description()}
        icon={FileQuestion}
        inCard
      />
    {:else if tasksQuery.current}
      <TasksList tasks={tasksQuery.current} />
    {/if}
  </div>
</div>
