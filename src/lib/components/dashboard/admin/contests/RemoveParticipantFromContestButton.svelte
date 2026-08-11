<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import UserX from '@lucide/svelte/icons/user-x';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { getContestsManagementInstance } from '$lib/services';

  interface Props {
    contestId: number;
    userId: number;
    userName: string;
    onSuccess?: () => void;
  }

  let { contestId, userId, userName, onSuccess }: Props = $props();

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
      toast.error(m.contest_participants_remove_error());
    } finally {
      submitting = false;
    }
  }
</script>

<Button variant="ghost" size="icon" onclick={() => (dialogOpen = true)}>
  <UserX class="h-4 w-4" />
</Button>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.contest_participants_remove_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.contest_participants_remove_confirm_description({ userName })}
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
