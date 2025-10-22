<script lang="ts">
  import {
    getTaskLimits,
    updateTaskLimits
  } from '$lib/../routes/dashboard/admin/tasks/test-cases.remote';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import Loader from '@lucide/svelte/icons/loader-circle';

  interface ManageTestCasesDialogProps {
    open: boolean;
    taskId: number;
    taskTitle: string;
  }

  let { open = $bindable(), taskId, taskTitle }: ManageTestCasesDialogProps = $props();

  let taskLimitsQuery = getTaskLimits(taskId);

  let editedLimits = $state<Array<{ order: number; memoryLimit: number; timeLimit: number }>>([]);

  $effect(() => {
    if (taskLimitsQuery?.current) {
      editedLimits = taskLimitsQuery.current.map((l) => ({ ...l }));
    }
  });
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
      <form
        class="space-y-4"
        {...updateTaskLimits.enhance(async ({ submit }) => {
          try {
            await submit();
            toast.success(m.admin_tasks_test_cases_updated());
            open = false;
          } catch (error) {
            toast.error(m.admin_tasks_test_cases_update_error());
          }
        })}
      >
        <input {...updateTaskLimits.fields.taskId.as('number')} type="hidden" value={taskId} />

        {#each editedLimits as limit, i (limit.order)}
          <input
            {...updateTaskLimits.fields.limits[i].order.as('number')}
            type="hidden"
            value={limit.order}
          />
          <input
            {...updateTaskLimits.fields.limits[i].memoryLimit.as('number')}
            type="hidden"
            value={limit.memoryLimit}
          />
          <input
            {...updateTaskLimits.fields.limits[i].timeLimit.as('number')}
            type="hidden"
            value={limit.timeLimit}
          />
        {/each}

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
            disabled={!!updateTaskLimits.pending}
          >
            {m.admin_tasks_form_cancel()}
          </Button>
          <Button
            type="submit"
            disabled={!!updateTaskLimits.pending ||
              !!taskLimitsQuery?.loading ||
              !!taskLimitsQuery?.error}
          >
            {#if updateTaskLimits.pending}
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
