<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import X from '@lucide/svelte/icons/x';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { getContestsManagementInstance } from '$lib/services';

  interface Props {
    contestId: number;
    groupId: number;
    groupName: string;
    onSuccess?: () => void;
  }

  let { contestId, groupId, groupName, onSuccess }: Props = $props();

  let dialogOpen = $state(false);
  let submitting = $state(false);

  const contestsService = getContestsManagementInstance();

  async function handleRemove() {
    if (!contestsService) {
      toast.error(m.contest_groups_remove_error());
      return;
    }

    submitting = true;
    try {
      await contestsService.removeGroupsFromContest(contestId, [groupId]);
      toast.success(m.contest_groups_remove_success());
      dialogOpen = false;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Remove group from contest error:', error);
      toast.error(m.contest_groups_remove_error());
    } finally {
      submitting = false;
    }
  }
</script>

<Button variant="ghost" size="icon" onclick={() => (dialogOpen = true)}>
  <X class="h-4 w-4" />
</Button>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.contest_groups_remove_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.contest_groups_remove_confirm_description({ groupName })}
      </Dialog.Description>
    </Dialog.Header>

    <Dialog.Footer>
      <Button type="button" variant="outline" onclick={() => (dialogOpen = false)} disabled={submitting}>
        {m.contest_groups_remove_cancel()}
      </Button>
      <Button type="button" class="bg-primary" onclick={handleRemove} disabled={submitting}>
        {submitting ? 'Removing...' : m.contest_groups_remove_confirm()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
