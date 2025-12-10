<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';
  import type { DeleteTaskForm } from '$routes/dashboard/teacher/tasks/tasks.remote';

  interface Props {
    taskId: number;
    taskTitle: string;
    deleteTask: DeleteTaskForm;
  }

  let { taskId, taskTitle, deleteTask }: Props = $props();

  let firstDialogOpen = $state(false);
  let secondDialogOpen = $state(false);
  let isDeleting = $state(false);

  function handleFirstConfirm() {
    firstDialogOpen = false;
    secondDialogOpen = true;
  }

  function handleFirstCancel() {
    firstDialogOpen = false;
  }

  function handleSecondCancel() {
    secondDialogOpen = false;
  }
</script>

<Button
  variant="destructive"
  class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
  onclick={() => (firstDialogOpen = true)}
>
  <Trash2 class="mr-2 h-4 w-4" />
  {m.admin_tasks_card_remove_task()}
</Button>

<!-- First Confirmation Dialog -->
<Dialog.Root bind:open={firstDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_tasks_remove_first_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_tasks_remove_first_confirm_description({ taskTitle })}
      </Dialog.Description>
    </Dialog.Header>

    <Dialog.Footer>
      <Button type="button" variant="outline" onclick={handleFirstCancel} disabled={isDeleting}>
        {m.admin_tasks_remove_first_cancel_button()}
      </Button>
      <Button
        type="button"
        variant="destructive"
        onclick={handleFirstConfirm}
        disabled={isDeleting}
      >
        {m.admin_tasks_remove_first_confirm_button()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Second Confirmation Dialog -->
<Dialog.Root bind:open={secondDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_tasks_remove_second_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_tasks_remove_second_confirm_description({ taskTitle })}
      </Dialog.Description>
    </Dialog.Header>

    <form
      {...deleteTask.enhance(async ({ submit }) => {
        isDeleting = true;
        try {
          await submit();
          toast.success(m.admin_tasks_remove_success());
          secondDialogOpen = false;
        } catch (error: unknown) {
          if (isHttpError(error)) {
            toast.error(error.body.message);
          } else {
            toast.error(m.admin_tasks_remove_error());
          }
        } finally {
          isDeleting = false;
        }
      })}
    >
      <input type="hidden" name="taskId" value={taskId} />

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleSecondCancel} disabled={isDeleting}>
          {m.admin_tasks_remove_second_cancel_button()}
        </Button>
        <Button type="submit" variant="default" disabled={isDeleting}>
          {m.admin_tasks_remove_second_confirm_button()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
