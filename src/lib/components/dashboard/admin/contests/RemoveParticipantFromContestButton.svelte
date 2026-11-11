<script lang="ts">
  import { Button } from '#lib/components/ui/button/index.js';
  import { showApiError } from '#lib/errors/backend-error.js';
  import * as Dialog from '#lib/components/ui/dialog/index.js';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';
  import * as m from '#lib/paraglide/messages.js';
  import { getContestsManagementInstance } from '#lib/services/index.js';

  interface Props {
    contestId: number;
    userId: number;
    userName: string;
    remainingGroupNames?: string[];
    onSuccess?: () => void;
  }

  let { contestId, userId, userName, remainingGroupNames = [], onSuccess }: Props = $props();

  let dialogOpen = $state(false);
  let submitting = $state(false);

  const contestsService = getContestsManagementInstance();

  async function handleRemove() {
    if (!contestsService) {
      toast.error(m.contest_participants_remove_error());
      return;
    }

    submitting = true;
    try {
      await contestsService.removeParticipantsFromContest(contestId, [userId]);
      toast.success(m.contest_participants_remove_success());
      dialogOpen = false;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Remove participant from contest error:', error);
      showApiError(error, m.contest_participants_remove_error());
    } finally {
      submitting = false;
    }
  }
</script>

<Button variant="ghost" size="icon" onclick={() => (dialogOpen = true)}>
  <Trash2 class="h-4 w-4" />
</Button>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.contest_participants_remove_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        <span class="block">{m.contest_participants_remove_confirm_description({ userName })}</span>
        {#if remainingGroupNames.length > 0}
          <span class="mt-2 block text-amber-600 dark:text-amber-400">
            {m.contest_participants_remove_keeps_access({
              userName,
              groupNames: remainingGroupNames.join(', ')
            })}
          </span>
        {/if}
      </Dialog.Description>
    </Dialog.Header>

    <Dialog.Footer>
      <Button
        type="button"
        variant="outline"
        onclick={() => (dialogOpen = false)}
        disabled={submitting}
      >
        {m.contest_participants_remove_cancel()}
      </Button>
      <Button type="button" class="bg-primary" onclick={handleRemove} disabled={submitting}>
        {submitting ? 'Removing...' : m.contest_participants_remove_confirm()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
