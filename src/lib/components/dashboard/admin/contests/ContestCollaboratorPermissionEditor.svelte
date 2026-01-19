<script lang="ts">
  import * as Popover from '$lib/components/ui/popover';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import Shield from '@lucide/svelte/icons/shield';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronUp from '@lucide/svelte/icons/chevron-up';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { Permission, ResourceType } from '$lib/dto/accessControl';
  import { getAccessControlInstance } from '$lib/services';
  import { UpdateCollaboratorSchema } from '$lib/schemas';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';

  interface Props {
    contestId: number;
    userId: number;
    userName: string;
    currentPermission: Permission;
    canEdit?: boolean;
    onSuccess?: () => void;
  }

  let {
    contestId,
    userId,
    userName,
    currentPermission,
    canEdit = false,
    onSuccess
  }: Props = $props();

  const accessControlService = getAccessControlInstance();

  let popoverOpen = $state(false);
  let dialogOpen = $state(false);
  let selectedPermission = $state<Permission | null>(null);

  // Owner permission cannot be changed, and user needs canEdit permission
  const isEditable = $derived(canEdit && currentPermission !== Permission.Owner);

  const { form, errors, enhance, submitting } = superForm(
    defaults({ resourceId: contestId, userId, permission: currentPermission }, valibot(UpdateCollaboratorSchema)),
    {
      id: `contest-collab-perm-${contestId}-${userId}`,
      validators: valibot(UpdateCollaboratorSchema),
      SPA: true,
      dataType: 'json',
      resetForm: false,
      async onUpdate({ form }) {
        if (!accessControlService || !form.valid) return;

        try {
          await accessControlService.updateCollaborator(
            ResourceType.Contests,
            form.data.resourceId,
            form.data.userId,
            { permission: form.data.permission as Permission.Edit | Permission.Manage }
          );
          toast.success(m.contest_collaborators_update_success());
          dialogOpen = false;
          selectedPermission = null;
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error('Update contest collaborator error:', error);
          toast.error(m.contest_collaborators_update_error());
        }
      }
    }
  );

  function getPermissionLabel(permission: Permission): string {
    switch (permission) {
      case Permission.Edit:
        return m.contest_collaborators_permission_edit();
      case Permission.Manage:
        return m.contest_collaborators_permission_manage();
      case Permission.Owner:
        return m.contest_collaborators_permission_owner();
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
    $form.permission = permission;
    popoverOpen = false;
    dialogOpen = true;
  }

  function handleCancel() {
    dialogOpen = false;
    selectedPermission = null;
  }
</script>

{#if isEditable}
  <!-- Editable permission badge with popover -->
  <Popover.Root bind:open={popoverOpen}>
    <Popover.Trigger
      class="{getPermissionBadgeClass(
        currentPermission
      )} inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all hover:ring-2 hover:ring-ring/50"
      title={m.contest_collaborators_update_title()}
    >
      <Shield class="h-3 w-3" />
      {getPermissionLabel(currentPermission)}
      {#if popoverOpen}
        <ChevronUp class="h-3 w-3" />
      {:else}
        <ChevronDown class="h-3 w-3" />
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-40 p-1">
      <div class="flex flex-col gap-1">
        <button
          type="button"
          onclick={() => handlePermissionSelect(Permission.Edit)}
          class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent {currentPermission ===
          Permission.Edit
            ? 'bg-accent'
            : ''}"
        >
          <Shield class="h-3.5 w-3.5" />
          {m.contest_collaborators_permission_edit()}
        </button>
        <button
          type="button"
          onclick={() => handlePermissionSelect(Permission.Manage)}
          class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent {currentPermission ===
          Permission.Manage
            ? 'bg-accent'
            : ''}"
        >
          <Shield class="h-3.5 w-3.5" />
          {m.contest_collaborators_permission_manage()}
        </button>
      </div>
    </Popover.Content>
  </Popover.Root>
{:else}
  <!-- Non-editable permission badge -->
  <span
    class="{getPermissionBadgeClass(
      currentPermission
    )} inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
  >
    <Shield class="h-3 w-3" />
    {getPermissionLabel(currentPermission)}
  </span>
{/if}

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.contest_collaborators_update_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {m.contest_collaborators_update_confirm_description({
          userName,
          currentPermission: getPermissionLabel(currentPermission),
          newPermission: selectedPermission ? getPermissionLabel(selectedPermission) : ''
        })}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance>
      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleCancel} disabled={$submitting}>
          {m.contest_collaborators_update_cancel()}
        </Button>
        <Button type="submit" disabled={$submitting || !selectedPermission}>
          {$submitting ? 'Updating...' : m.contest_collaborators_update_confirm()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
