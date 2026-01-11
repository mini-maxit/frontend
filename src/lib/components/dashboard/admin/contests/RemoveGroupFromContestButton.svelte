<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import X from '@lucide/svelte/icons/x';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { removeGroupsFromContest } from '$routes/dashboard/teacher/contests/[contestId]/groups/groups.remote';

  interface Props {
    contestId: number;
    groupId: number;
    groupName: string;
  }

  let { contestId, groupId, groupName }: Props = $props();

  let dialogOpen = $state(false);

  async function handleRemove() {
    try {
      await removeGroupsFromContest({ contestId, groupIds: [groupId] });
      toast.success(m.contest_groups_remove_success());
      dialogOpen = false;
    } catch {
      toast.error(m.contest_groups_remove_error());
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
      <Button type="button" variant="outline" onclick={() => (dialogOpen = false)}>
        {m.contest_groups_remove_cancel()}
      </Button>
      <Button type="button" class="bg-primary" onclick={handleRemove}>
        {m.contest_groups_remove_confirm()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
