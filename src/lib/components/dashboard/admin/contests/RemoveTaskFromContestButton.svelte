<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { getContestsManagementInstance } from '$lib/services';

  interface Props {
    contestId: number;
    taskId: number;
    taskTitle: string;
    onSuccess?: () => void;
  }

  let { contestId, taskId, taskTitle, onSuccess }: Props = $props();

  const contestsService = getContestsManagementInstance();

  let dialogOpen = $state(false);
  let isRemoving = $state(false);

  function handleCancel() {
    dialogOpen = false;
  }

  async function handleRemove(event: Event) {
    event.preventDefault();

    if (!contestsService) {
      toast.error(m.admin_contest_tasks_remove_error());
      return;
    }

    isRemoving = true;
    try {
      await contestsService.removeTaskFromContest(contestId, taskId);
      toast.success(m.admin_contest_tasks_remove_success());
      dialogOpen = false;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Remove task from contest error:', error);
      toast.error(m.admin_contest_tasks_remove_error());
    } finally {
      isRemoving = false;
    }
  }
</script>

<Button
  variant="ghost"
  size="icon"
  class="h-8 w-8 text-muted-foreground hover:text-destructive"
  onclick={() => (dialogOpen = true)}
  title={m.admin_contest_tasks_remove_title()}
>
  <Trash2 class="h-4 w-4" />
</Button>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_contest_tasks_remove_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_contest_tasks_remove_confirm_description({ taskTitle })}
      </Dialog.Description>
    </Dialog.Header>

    <form onsubmit={handleRemove}>
      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleCancel} disabled={isRemoving}>
          {m.admin_contest_tasks_remove_cancel()}
        </Button>
        <Button type="submit" variant="destructive" disabled={isRemoving}>
          {isRemoving ? 'Removing...' : m.admin_contest_tasks_remove_confirm()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
