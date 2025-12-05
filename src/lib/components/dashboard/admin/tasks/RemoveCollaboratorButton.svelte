<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import X from '@lucide/svelte/icons/x';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';
  import { Permission } from '$lib/dto/accessControl';
  import type { RemoveCollaboratorForm } from '$routes/dashboard/teacher/tasks/[taskId]/collaborators/collaborators.remote';

  interface Props {
    taskId: number;
    userId: number;
    userName: string;
    targetPermission: Permission;
    currentUserPermission: Permission;
    removeCollaborator: RemoveCollaboratorForm;
  }

  let {
    taskId,
    userId,
    userName,
    targetPermission,
    currentUserPermission,
    removeCollaborator
  }: Props = $props();

  let dialogOpen = $state(false);
  let isRemoving = $state(false);

  /**
   * Determines if the current user can remove the target collaborator.
   * - Editors cannot see or use this button at all
   * - Managers can remove editors and other managers (not owners)
   * - Owners can remove editors and managers (not other owners)
   */
  const canRemove = $derived.by(() => {
    // Editors cannot remove anyone
    if (currentUserPermission === Permission.Edit) {
      return false;
    }

    // Cannot remove owners
    if (targetPermission === Permission.Owner) {
      return false;
    }

    // Managers and owners can remove editors and managers
    return (
      currentUserPermission === Permission.Manage || currentUserPermission === Permission.Owner
    );
  });

  function handleCancel() {
    dialogOpen = false;
  }
</script>

{#if canRemove}
  <Button
    variant="ghost"
    size="icon"
    class="h-6 w-6 text-muted-foreground hover:text-foreground"
    onclick={() => (dialogOpen = true)}
    title={m.task_collaborators_remove_title()}
  >
    <X class="h-4 w-4" />
  </Button>

  <Dialog.Root bind:open={dialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>{m.task_collaborators_remove_confirm_title()}</Dialog.Title>
        <Dialog.Description>
          {m.task_collaborators_remove_confirm_description({ userName })}
        </Dialog.Description>
      </Dialog.Header>

      <form
        {...removeCollaborator.enhance(async ({ submit }) => {
          isRemoving = true;
          try {
            await submit();
            toast.success(m.task_collaborators_remove_success());
            dialogOpen = false;
          } catch (error: unknown) {
            if (isHttpError(error)) {
              toast.error(error.body.message);
            } else {
              toast.error(m.task_collaborators_remove_error());
            }
          } finally {
            isRemoving = false;
          }
        })}
      >
        <input type="hidden" name="taskId" value={taskId} />
        <input type="hidden" name="userId" value={userId} />

        <Dialog.Footer>
          <Button type="button" variant="outline" onclick={handleCancel} disabled={isRemoving}>
            {m.task_collaborators_remove_cancel()}
          </Button>
          <Button type="submit" variant="destructive" disabled={isRemoving}>
            {m.task_collaborators_remove_confirm()}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{/if}
