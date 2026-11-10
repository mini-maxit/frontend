<script lang="ts">
  import * as Dialog from '#lib/components/ui/dialog/index.js';
  import { showApiError } from '#lib/errors/backend-error.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';
  import * as m from '#lib/paraglide/messages.js';
  import { getContestsManagementInstance } from '#lib/services/index.js';

  interface Props {
    contestId: number;
    contestName: string;
    onSuccess?: () => void;
  }

  let { contestId, contestName, onSuccess }: Props = $props();

  let dialogOpen = $state(false);
  let isDeleting = $state(false);

  const contestsService = getContestsManagementInstance();

  async function handleDelete(event: Event) {
    event.preventDefault();
    if (!contestsService) {
      toast.error(m.admin_contests_remove_error());
      return;
    }

    isDeleting = true;
    try {
      await contestsService.deleteContest(contestId);
      toast.success(m.admin_contests_remove_success());
      dialogOpen = false;
      onSuccess?.();
    } catch (error) {
      showApiError(error, m.admin_contests_remove_error());
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
  title={m.admin_contests_remove_button()}
>
  <Trash2 class="h-4 w-4" />
</Button>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_contests_remove_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_contests_remove_confirm_description({ contestName })}
      </Dialog.Description>
    </Dialog.Header>

    <form onsubmit={handleDelete}>
      <Dialog.Footer>
        <Button
          type="button"
          variant="outline"
          onclick={() => (dialogOpen = false)}
          disabled={isDeleting}
        >
          {m.admin_contests_remove_cancel_button()}
        </Button>
        <Button type="submit" variant="destructive" disabled={isDeleting}>
          {m.admin_contests_remove_confirm_button()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
