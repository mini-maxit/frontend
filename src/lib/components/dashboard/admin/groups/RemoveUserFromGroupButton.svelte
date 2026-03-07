<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import X from '@lucide/svelte/icons/x';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { getGroupsManagementInstance } from '$lib/services';

  interface Props {
    groupId: number;
    userId: number;
    userName: string;
    onSuccess?: () => void;
  }

  let { groupId, userId, userName, onSuccess }: Props = $props();

  let dialogOpen = $state(false);
  let submitting = $state(false);

  const groupsService = getGroupsManagementInstance();

  async function handleRemove() {
    if (!groupsService) {
      toast.error(m.group_members_remove_error());
      return;
    }

    submitting = true;
    try {
      await groupsService.removeUsersFromGroup(groupId, [userId]);
      toast.success(m.group_members_remove_success());
      dialogOpen = false;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Remove user error:', error);
      toast.error(m.group_members_remove_error());
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
      <Dialog.Title>{m.group_members_remove_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.group_members_remove_confirm_description({ userName })}
      </Dialog.Description>
    </Dialog.Header>

    <Dialog.Footer>
      <Button
        type="button"
        variant="outline"
        onclick={() => (dialogOpen = false)}
        disabled={submitting}
      >
        {m.group_members_remove_cancel()}
      </Button>
      <Button type="button" class="bg-primary" onclick={handleRemove} disabled={submitting}>
        {submitting ? 'Removing...' : m.group_members_remove_confirm()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
