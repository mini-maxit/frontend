<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { getTasksManagementInstance } from '$lib/services';

  interface Props {
    taskId: number;
    taskTitle: string;
    onSuccess?: () => void;
  }

  let { taskId, taskTitle, onSuccess }: Props = $props();

  let dialogOpen = $state(false);
  let isDeleting = $state(false);

  const tasksManagementService = getTasksManagementInstance();

  function handleCancel() {
    dialogOpen = false;
  }

  async function handleDelete(event: Event) {
    event.preventDefault();

    if (!tasksManagementService) {
      toast.error(m.admin_tasks_remove_error());
      return;
    }

    isDeleting = true;
    try {
      await tasksManagementService.deleteTask(taskId);
      toast.success(m.admin_tasks_remove_success());
      dialogOpen = false;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Delete task error:', error);
      toast.error(m.admin_tasks_remove_error());
    } finally {
      isDeleting = false;
    }
  }
</script>

<Button
  variant="ghost"
  size="icon"
  class="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
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

    <form onsubmit={handleDelete}>
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
