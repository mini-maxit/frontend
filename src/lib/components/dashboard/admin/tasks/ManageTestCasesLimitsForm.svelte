<script lang="ts">
  import { updateTaskLimits } from '$lib/../routes/dashboard/admin/tasks/test-cases.remote';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import Loader from '@lucide/svelte/icons/loader-circle';

  interface ManageTestCasesFormProps {
    taskId: number;
    limits: Array<{ order: number; memoryLimit: number; timeLimit: number }>;
    onSuccess?: () => void;
    onCancel?: () => void;
  }

  let { taskId, limits, onSuccess, onCancel }: ManageTestCasesFormProps = $props();

  // Create a local editable copy of the limits
  let editedLimits = $state(limits.map((l) => ({ ...l })));

  // Update edited limits when props change
  $effect(() => {
    editedLimits = limits.map((l) => ({ ...l }));
  });

  // Set the form values programmatically based on props and state
  $effect(() => {
    updateTaskLimits.fields.taskId.set(taskId);
    updateTaskLimits.fields.limits.set(editedLimits);
  });
</script>

<form
  class="space-y-4"
  {...updateTaskLimits.enhance(async ({ submit }) => {
    try {
      await submit();
      toast.success(m.admin_tasks_test_cases_updated());
      onSuccess?.();
    } catch (error) {
      toast.error(m.admin_tasks_test_cases_update_error());
    }
  })}
>
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
      onclick={() => onCancel?.()}
      disabled={!!updateTaskLimits.pending}
    >
      {m.admin_tasks_form_cancel()}
    </Button>
    <Button type="submit" disabled={!!updateTaskLimits.pending}>
      {#if updateTaskLimits.pending}
        <Loader class="mr-2 h-4 w-4 animate-spin" />
      {/if}
      {m.admin_tasks_save_changes()}
    </Button>
  </Dialog.Footer>
</form>
