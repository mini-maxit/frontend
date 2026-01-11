<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import X from '@lucide/svelte/icons/x';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { removeUsersFromGroup } from '$routes/dashboard/teacher/groups/[groupId]/group.remote';

  interface Props {
    groupId: number;
    userId: number;
    userName: string;
  }

  let { groupId, userId, userName }: Props = $props();

  let dialogOpen = $state(false);

  async function handleRemove() {
    try {
      await removeUsersFromGroup({ groupId, userIDs: [userId] });
      toast.success(m.group_members_remove_success());
      dialogOpen = false;
    } catch {
      toast.error(m.group_members_remove_error());
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
      <Button type="button" variant="outline" onclick={() => (dialogOpen = false)}>
        {m.group_members_remove_cancel()}
      </Button>
      <Button type="button" class="bg-primary" onclick={handleRemove}>
        {m.group_members_remove_confirm()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
