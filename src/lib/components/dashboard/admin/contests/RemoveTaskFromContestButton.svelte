<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';
  import type { RemoveTaskFromContestForm } from '$routes/dashboard/teacher/contests/[contestId]/tasks/tasks.remote';

  interface Props {
    contestId: number;
    taskId: number;
    taskTitle: string;
    removeTaskFromContest: RemoveTaskFromContestForm;
  }

  let { contestId, taskId, taskTitle, removeTaskFromContest }: Props = $props();

  let dialogOpen = $state(false);
  let isRemoving = $state(false);

  function handleCancel() {
    dialogOpen = false;
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

    <form
      {...removeTaskFromContest.enhance(async ({ submit }) => {
        isRemoving = true;
        try {
          await submit();
          toast.success(m.admin_contest_tasks_remove_success());
          dialogOpen = false;
        } catch (error: unknown) {
          if (isHttpError(error)) {
            toast.error(error.body.message);
          } else {
            toast.error(m.admin_contest_tasks_remove_error());
          }
        } finally {
          isRemoving = false;
        }
      })}
    >
      <input type="hidden" name="contestId" value={contestId} />
      <input type="hidden" name="taskId" value={taskId} />

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleCancel} disabled={isRemoving}>
          {m.admin_contest_tasks_remove_cancel()}
        </Button>
        <Button type="submit" variant="destructive" disabled={isRemoving}>
          {m.admin_contest_tasks_remove_confirm()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
