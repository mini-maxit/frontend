<script lang="ts">
  import * as m from '$lib/paraglide/messages';
  import TaskCard from '$lib/components/dashboard/tasks/TaskCard.svelte';
  import { LoadingSpinner } from '$lib/components/common';
  import ErrorCard from '$lib/components/common/ErrorCard.svelte';
  import EmptyState from '$lib/components/common/EmptyState.svelte';
  import FileSearch from '@lucide/svelte/icons/file-search';
  import { createQuery } from '$lib/utils/query.svelte';
  import { getTaskInstance } from '$lib/services';

  const taskService = getTaskInstance();

  const tasksQuery = createQuery(async () => {
    if (!taskService) throw new Error('Task service not available');
    const result = await taskService.getAllTasks();
    if (!result.success) throw new Error(result.error || 'Failed to fetch tasks');
    return result.data!;
  });
</script>

<svelte:head>
  <title>{m.tasks_page_title()}</title>
</svelte:head>

<div class="container mx-auto p-6">
  <div class="mb-8">
    <h1 class="mb-2 text-4xl font-bold text-foreground">{m.tasks_title()}</h1>
    <p class="text-lg text-muted-foreground">{m.tasks_subtitle()}</p>
  </div>

  {#if tasksQuery.error}
    <ErrorCard error={tasksQuery.error} onRetry={() => tasksQuery.refresh()} />
  {:else if tasksQuery.loading}
    <LoadingSpinner message={m.tasks_loading()} />
  {:else if tasksQuery.current && tasksQuery.current.length === 0}
    <EmptyState
      title={m.tasks_empty_title()}
      description={m.tasks_empty_description()}
      icon={FileSearch}
    />
  {:else if tasksQuery.current}
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each tasksQuery.current as task (task.id)}
        <TaskCard {task} />
      {/each}
    </div>
  {/if}
</div>
