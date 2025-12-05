<script lang="ts">
  import * as Popover from '$lib/components/ui/popover';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import Shield from '@lucide/svelte/icons/shield';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';
  import { Permission } from '$lib/dto/accessControl';
  import type { UpdateCollaboratorForm } from '$routes/dashboard/teacher/tasks/[taskId]/collaborators/collaborators.remote';

  interface Props {
    taskId: number;
    userId: number;
    userName: string;
    currentPermission: Permission;
    updateCollaborator: UpdateCollaboratorForm;
  }

  let { taskId, userId, userName, currentPermission, updateCollaborator }: Props = $props();

  let popoverOpen = $state(false);
  let dialogOpen = $state(false);
  let selectedPermission = $state<Permission | null>(null);
  let isUpdating = $state(false);

  // Owner permission cannot be changed
  const isOwner = $derived(currentPermission === Permission.Owner);

  function getPermissionLabel(permission: Permission): string {
    switch (permission) {
      case Permission.Edit:
        return m.task_collaborators_permission_edit();
      case Permission.Manage:
        return m.task_collaborators_permission_manage();
      case Permission.Owner:
        return m.task_collaborators_permission_owner();
      default:
        return permission;
    }
  }

  function getPermissionBadgeClass(permission: Permission): string {
    switch (permission) {
      case Permission.Owner:
        return 'bg-primary/10 text-primary border border-primary/20';
      case Permission.Manage:
        return 'bg-secondary/10 text-secondary border border-secondary/20';
      case Permission.Edit:
        return 'bg-muted text-muted-foreground border border-border';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  }

  function handlePermissionSelect(permission: Permission) {
    if (permission === currentPermission) {
      // Same permission selected, just close popover
      popoverOpen = false;
      return;
    }

    // Different permission selected, show confirmation dialog
    selectedPermission = permission;
    popoverOpen = false;
    dialogOpen = true;
  }

  function handleCancel() {
    dialogOpen = false;
    selectedPermission = null;
  }
</script>

{#if isOwner}
  <!-- Owner permission badge - not clickable -->
  <span
    class="{getPermissionBadgeClass(
      currentPermission
    )} inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
  >
    <Shield class="h-3 w-3" />
    {getPermissionLabel(currentPermission)}
  </span>
{:else}
  <!-- Editable permission badge with popover -->
  <Popover.Root bind:open={popoverOpen}>
    <Popover.Trigger
      class="{getPermissionBadgeClass(
        currentPermission
      )} inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all hover:ring-2 hover:ring-ring/50"
      title={m.task_collaborators_update_title()}
    >
      <Shield class="h-3 w-3" />
      {getPermissionLabel(currentPermission)}
    </Popover.Trigger>
    <Popover.Content class="w-40 p-1">
      <div class="flex flex-col gap-1">
        <button
          type="button"
          onclick={() => handlePermissionSelect(Permission.Edit)}
          class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-muted {currentPermission ===
          Permission.Edit
            ? 'bg-muted'
            : ''}"
        >
          <Shield class="h-3.5 w-3.5" />
          {m.task_collaborators_permission_edit()}
        </button>
        <button
          type="button"
          onclick={() => handlePermissionSelect(Permission.Manage)}
          class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-muted {currentPermission ===
          Permission.Manage
            ? 'bg-muted'
            : ''}"
        >
          <Shield class="h-3.5 w-3.5" />
          {m.task_collaborators_permission_manage()}
        </button>
      </div>
    </Popover.Content>
  </Popover.Root>
{/if}

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.task_collaborators_update_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.task_collaborators_update_confirm_description({
          userName,
          currentPermission: getPermissionLabel(currentPermission),
          newPermission: selectedPermission ? getPermissionLabel(selectedPermission) : ''
        })}
      </Dialog.Description>
    </Dialog.Header>

    <form
      {...updateCollaborator.enhance(async ({ submit }) => {
        isUpdating = true;
        try {
          await submit();
          toast.success(m.task_collaborators_update_success());
          dialogOpen = false;
          selectedPermission = null;
        } catch (error: unknown) {
          if (isHttpError(error)) {
            toast.error(error.body.message);
          } else {
            toast.error(m.task_collaborators_update_error());
          }
        } finally {
          isUpdating = false;
        }
      })}
    >
      <input type="hidden" name="taskId" value={taskId} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="permission" value={selectedPermission ?? ''} />

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleCancel} disabled={isUpdating}>
          {m.task_collaborators_update_cancel()}
        </Button>
        <Button type="submit" disabled={isUpdating || !selectedPermission}>
          {m.task_collaborators_update_confirm()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
