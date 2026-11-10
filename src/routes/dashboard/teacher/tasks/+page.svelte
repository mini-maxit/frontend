<script lang="ts">
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import { page } from '$app/state';
  import { getTasksManagementInstance } from '#lib/services/index.js';
  import {
    TasksList,
    TasksUploadDialog,
    TasksUploadButton
  } from '#lib/components/dashboard/admin/tasks/index.js';
  import {
    LoadingSpinner,
    ErrorCard,
    EmptyState,
    ListPagination
  } from '#lib/components/common/index.js';
  import { readIntParam, writeSearchParams } from '#lib/utils/url-state.js';
  import Upload from '@lucide/svelte/icons/upload';
  import * as m from '#lib/paraglide/messages.js';
  import { toast } from 'svelte-sonner';

  const tasksManagementService = getTasksManagementInstance();

  let dialogOpen = $state(false);
  // Admin "All Tasks" sidebar entry opens this page with ?scope=all
  const showAll = $derived(page.url.searchParams.get('scope') === 'all');
  // Read from the URL so reloads keep the page and switching scope (a real navigation) resets it.
  // Page clicks only shallow-update the URL, which doesn't change page.url, so offset is
  // overridden locally (writable $derived) and re-derived on the next real navigation.
  const limit = $derived(readIntParam(page.url, 'limit', 20));
  let offset = $derived(readIntParam(page.url, 'offset', 0));

  const tasksQuery = createParameterizedQuery(
    () => ({ all: showAll, limit, offset }),
    async (params) => {
      if (!tasksManagementService) throw new Error('Service unavailable');
      const result = await tasksManagementService.getManagedTasks(params);
      if (!result.success) throw new Error(result.error || 'Failed to fetch tasks');
      return result.data!;
    }
  );

  function goToOffset(newOffset: number) {
    offset = newOffset;
    writeSearchParams({ offset: newOffset || null });
    window.scrollTo({ top: 0 });
  }

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
    {:else if tasksQuery.current && tasksQuery.current.pagination.totalItems === 0}
      <EmptyState
        title={m.admin_tasks_no_tasks_title()}
        description={m.admin_tasks_no_tasks_description()}
        icon={Upload}
      />
    {:else if tasksQuery.current}
      <TasksList tasks={tasksQuery.current.items} onTaskDeleted={() => tasksQuery.refresh()} />
      <ListPagination
        total={tasksQuery.current.pagination.totalItems}
        {limit}
        {offset}
        totalLabel={m.admin_tasks_pagination_total({
          total: tasksQuery.current.pagination.totalItems
        })}
        onOffsetChange={goToOffset}
      />
    {/if}
  </div>
</div>
