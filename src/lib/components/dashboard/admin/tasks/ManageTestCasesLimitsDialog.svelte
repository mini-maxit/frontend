<script lang="ts">
  import { createParameterizedQuery } from '$lib/utils/query.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import { getTasksManagementInstance } from '$lib/services';

  interface ManageTestCasesDialogProps {
    open: boolean;
    taskId: number;
    taskTitle: string;
    onSuccess?: () => void;
  }

  interface TaskLimit {
    order: number;
    memoryLimit: number;
    timeLimit: number;
  }

  let { open = $bindable(), taskId, taskTitle, onSuccess }: ManageTestCasesDialogProps = $props();

  const tasksManagementService = getTasksManagementInstance();

  let taskLimitsQuery = createParameterizedQuery(taskId, async (id) => {
    if (!tasksManagementService) throw new Error('Service unavailable');
    const result = await tasksManagementService.getTaskLimits(id);
    if (!result.success) throw new Error(result.error || 'Failed to fetch task limits');
    return result.data || [];
  });

  let editedLimits = $state<Array<{ order: number; memoryLimit: number; timeLimit: number }>>([]);
  let submitting = $state(false);

  $effect(() => {
    if (taskLimitsQuery?.current) {
      editedLimits = taskLimitsQuery.current.map((limit: TaskLimit) => ({ ...limit }));
    }
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!tasksManagementService) {
      toast.error(m.admin_tasks_test_cases_update_error());
      return;
    }

    submitting = true;
    try {
      const result = await tasksManagementService.updateTaskLimits(taskId, {
        limits: editedLimits
      });
      if (result.success) {
        toast.success(m.admin_tasks_test_cases_updated());
        open = false;
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || m.admin_tasks_test_cases_update_error());
      }
    } catch (error) {
      console.error('Update task limits error:', error);
      toast.error(m.admin_tasks_test_cases_update_error());
    } finally {
      submitting = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[80vh] max-w-2xl overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>{m.admin_tasks_manage_test_cases_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_tasks_manage_test_cases_description({ taskTitle })}
      </Dialog.Description>
    </Dialog.Header>

    {#if taskLimitsQuery?.loading}
      <div class="flex items-center justify-center py-12">
        <Loader class="h-8 w-8 animate-spin text-primary" />
      </div>
    {:else if taskLimitsQuery?.error}
      <div class="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
        <p class="text-sm text-destructive">
          {taskLimitsQuery.error.message || m.error_unknown_error()}
        </p>
        <Button variant="outline" size="sm" class="mt-2" onclick={() => taskLimitsQuery?.refresh()}>
          {m.error_try_again()}
        </Button>
      </div>
    {:else if !editedLimits || editedLimits.length === 0}
      <div class="rounded-lg border-2 border-dashed border-border bg-muted/30 py-8 text-center">
        <p class="text-sm text-muted-foreground">{m.admin_tasks_no_test_cases()}</p>
      </div>
    {:else}
      <form class="space-y-4" onsubmit={handleSubmit}>
        <div class="grid grid-cols-3 gap-4 border-b pb-2 text-sm font-semibold">
          <div>{m.admin_tasks_test_case_id()}</div>
          <div>{m.admin_tasks_memory_limit()}</div>
          <div>{m.admin_tasks_time_limit()}</div>
        </div>

        {#each editedLimits as limit, i (limit.order)}
          <div class="grid grid-cols-3 items-center gap-4">
            <div class="text-sm text-muted-foreground">
              {limit.order}
            </div>
            <div>
              <Label for="memory-{limit.order}" class="sr-only">
                {m.admin_tasks_memory_limit()}
              </Label>
              <Input
                id="memory-{limit.order}"
                type="number"
                min="1"
                max="131072"
                class="w-full"
                bind:value={editedLimits[i].memoryLimit}
              />
            </div>
            <div>
              <Label for="time-{limit.order}" class="sr-only">
                {m.admin_tasks_time_limit()}
              </Label>
              <Input
                id="time-{limit.order}"
                type="number"
                min="1"
                max="30000"
                class="w-full"
                bind:value={editedLimits[i].timeLimit}
              />
            </div>
          </div>
        {/each}

        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onclick={() => (open = false)}
            disabled={submitting}
          >
            {m.admin_tasks_form_cancel()}
          </Button>
          <Button
            type="submit"
            disabled={submitting || taskLimitsQuery?.loading || !!taskLimitsQuery?.error}
          >
            {#if submitting}
              <Loader class="mr-2 h-4 w-4 animate-spin" />
            {/if}
            {m.admin_tasks_save_changes()}
          </Button>
        </Dialog.Footer>
      </form>
    {/if}

    <!-- Dialog.Footer moved inside the form for proper form submission -->
  </Dialog.Content>
</Dialog.Root>
