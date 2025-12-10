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

  let dialogOpen = $state(false);
  let isDeleting = $state(false);

  function handleCancel() {
    dialogOpen = false;
  }
</script>

<Button
  variant="ghost"
  size="icon"
  class="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
  onclick={() => (dialogOpen = true)}
  title={m.admin_tasks_card_remove_task()}
>
  <Trash2 class="h-4 w-4" />
</Button>

<!-- Confirmation Dialog -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_tasks_remove_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_tasks_remove_confirm_description({ taskTitle })}
      </Dialog.Description>
    </Dialog.Header>

    <form
      {...deleteTask.enhance(async ({ submit }) => {
        isDeleting = true;
        try {
          await submit();
          toast.success(m.admin_tasks_remove_success());
          dialogOpen = false;
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
        <Button type="button" variant="outline" onclick={handleCancel} disabled={isDeleting}>
          {m.admin_tasks_remove_cancel_button()}
        </Button>
        <Button type="submit" variant="destructive" disabled={isDeleting}>
          {m.admin_tasks_remove_confirm_button()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
