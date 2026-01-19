<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import UserPlus from '@lucide/svelte/icons/user-plus';
  import Search from '@lucide/svelte/icons/search';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { Permission, ResourceType } from '$lib/dto/accessControl';
  import type { User } from '$lib/dto/user';
  import { getAccessControlInstance } from '$lib/services';
  import { LoadingSpinner } from '$lib/components/common';
  import type { PaginatedData } from '$lib/dto/response';
  import { AddCollaboratorSchema } from '$lib/schemas';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';

  interface Props {
    taskId: number;
    users: PaginatedData<User> | undefined;
    usersLoading: boolean;
    usersError: Error | null;
    onSuccess?: () => void;
  }

  let { taskId, users, usersLoading, usersError, onSuccess }: Props = $props();

  const accessControlService = getAccessControlInstance();

  let dialogOpen = $state(false);
  let searchQuery = $state('');
  let selectedUserId = $state<number | null>(null);
  let selectedPermission = $state<Permission | null>(null);

  // Backend returns only assignable users (teachers who aren't already collaborators)
  let availableUsers = $derived(users?.items ?? []);

  // Filter users by search query
  let filteredUsers = $derived.by(() => {
    if (!searchQuery.trim()) return availableUsers;
    const query = searchQuery.toLowerCase();
    return availableUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.surname.toLowerCase().includes(query)
    );
  });

  let selectedUser = $derived(users?.items.find((u) => u.id === selectedUserId));

  const { form, errors, enhance, submitting } = superForm(
    defaults({ resourceId: taskId, userId: 0, permission: Permission.Edit }, valibot(AddCollaboratorSchema)),
    {
      id: `add-task-collab-${taskId}`,
      validators: valibot(AddCollaboratorSchema),
      SPA: true,
      dataType: 'json',
      resetForm: false,
      async onUpdate({ form }) {
        if (!accessControlService || !form.valid) return;

        try {
          await accessControlService.addCollaborator(
            ResourceType.Tasks,
            form.data.resourceId,
            { userId: form.data.userId, permission: form.data.permission as Permission.Edit | Permission.Manage }
          );
          toast.success(m.task_collaborators_add_success());
          dialogOpen = false;
          resetForm();
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error('Add task collaborator error:', error);
          toast.error(m.task_collaborators_add_error());
        }
      }
    }
  );

  function resetForm() {
    searchQuery = '';
    selectedUserId = null;
    selectedPermission = null;
  }

  function getPermissionLabel(permission: Permission): string {
    switch (permission) {
      case Permission.Edit:
        return m.task_collaborators_permission_edit();
      case Permission.Manage:
        return m.task_collaborators_permission_manage();
      default:
        return permission;
    }
  }
</script>

<Dialog.Root bind:open={dialogOpen} onOpenChange={(open) => !open && resetForm()}>
  <button
    onclick={() => (dialogOpen = true)}
    class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-secondary p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    ></div>

    <div class="relative flex flex-col items-center gap-4 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
      >
        <UserPlus class="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-primary-foreground">
          {m.task_collaborators_add_title()}
        </h3>
        <p class="mt-1 text-sm text-primary-foreground/80">
          {m.task_collaborators_add_description()}
        </p>
      </div>
    </div>
  </button>

  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{m.task_collaborators_add_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.task_collaborators_add_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    {#if usersError}
      <div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {m.task_collaborators_users_load_error()}
      </div>
    {:else if usersLoading}
      <LoadingSpinner />
    {:else}
      <form method="POST" use:enhance class="space-y-6">

        <!-- User Search and Selection -->
        <div class="space-y-3">
          <Label for="userSearch">{m.task_collaborators_add_user_label()}</Label>

          <div class="relative">
            <Search
              class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="userSearch"
              type="text"
              autocomplete="off"
              placeholder={m.task_collaborators_add_user_placeholder()}
              bind:value={searchQuery}
              class="pl-10"
            />
          </div>

          <!-- User list -->
          <div class="max-h-48 overflow-y-auto rounded-lg border border-border">
            {#if filteredUsers.length === 0}
              <div class="p-4 text-center text-muted-foreground">
                {m.task_collaborators_no_users_found()}
              </div>
            {:else}
              {#each filteredUsers as user (user.id)}
                <button
                  type="button"
                  onclick={() => {
                    selectedUserId = user.id;
                    $form.userId = user.id;
                  }}
                  class="flex w-full items-center gap-3 border-b border-border p-3 text-left transition-colors last:border-b-0 hover:bg-muted/50 {selectedUserId ===
                  user.id
                    ? 'bg-primary/10'
                    : ''}"
                >
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary"
                  >
                    {user.name.charAt(0)}{user.surname.charAt(0)}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-medium">
                      {user.name}
                      {user.surname}
                    </p>
                    <p class="truncate text-sm text-muted-foreground">
                      @{user.username} · {user.email}
                    </p>
                  </div>
                  {#if selectedUserId === user.id}
                    <div class="h-2 w-2 rounded-full bg-primary"></div>
                  {/if}
                </button>
              {/each}
            {/if}
          </div>

          {#if selectedUser}
            <div class="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p class="text-sm font-medium text-primary">
                Selected: {selectedUser.name}
                {selectedUser.surname} (@{selectedUser.username})
              </p>
            </div>
          {/if}
        </div>

        <!-- Permission Selection -->
        <div class="space-y-2">
          <Label for="permission">{m.task_collaborators_add_permission_label()}</Label>
          <Select.Root
            type="single"
            onValueChange={(value) => {
              selectedPermission = value as Permission;
              $form.permission = value as Permission;
            }}
          >
            <Select.Trigger class="w-full" id="permission">
              {selectedPermission
                ? getPermissionLabel(selectedPermission)
                : m.task_collaborators_add_permission_placeholder()}
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={Permission.Edit}>
                {m.task_collaborators_permission_edit()}
              </Select.Item>
              <Select.Item value={Permission.Manage}>
                {m.task_collaborators_permission_manage()}
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onclick={() => {
              dialogOpen = false;
              resetForm();
            }}
            disabled={$submitting}
          >
            {m.task_collaborators_add_cancel()}
          </Button>
          <Button
            type="submit"
            disabled={!selectedUserId || !selectedPermission || $submitting}
            class="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {$submitting ? 'Adding...' : m.task_collaborators_add_submit()}
          </Button>
        </Dialog.Footer>
      </form>
    {/if}
  </Dialog.Content>
</Dialog.Root>
