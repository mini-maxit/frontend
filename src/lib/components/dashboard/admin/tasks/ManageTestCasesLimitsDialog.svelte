<script lang="ts">
  import { getTaskLimits } from '$lib/../routes/dashboard/admin/tasks/test-cases.remote';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as m from '$lib/paraglide/messages';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import ManageTestCasesLimitsForm from './ManageTestCasesLimitsForm.svelte';

  interface ManageTestCasesDialogProps {
    open: boolean;
    taskId: number;
    taskTitle: string;
  }

  let { open = $bindable(), taskId, taskTitle }: ManageTestCasesDialogProps = $props();

  let taskLimitsQuery = getTaskLimits(taskId);
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
    {:else if !taskLimitsQuery?.current || taskLimitsQuery.current.length === 0}
      <div class="rounded-lg border-2 border-dashed border-border bg-muted/30 py-8 text-center">
        <p class="text-sm text-muted-foreground">{m.admin_tasks_no_test_cases()}</p>
      </div>
    {:else}
      <ManageTestCasesLimitsForm
        {taskId}
        limits={taskLimitsQuery.current}
        onSuccess={() => {
          open = false;
        }}
        onCancel={() => {
          open = false;
        }}
      />
    {/if}
  </Dialog.Content>
</Dialog.Root>
