<script lang="ts">
  import type { User } from '$lib/dto/user';
  import { UserRole } from '$lib/dto/jwt';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { toast } from 'svelte-sonner';
  import { updateUser } from '$lib/../routes/dashboard/admin/users/users.remote';
  import { isHttpError, type HttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';

  interface UserEditDialogProps {
    open: boolean;
    user: User | null;
    onSuccess: () => void;
  }

  let { open = $bindable(), user, onSuccess }: UserEditDialogProps = $props();

  let selectedRoleValue = $state<string>(UserRole.Student);

  $effect(() => {
    if (user) {
      selectedRoleValue = user.role;
    }
  });

  const roleOptions = [
    { value: UserRole.Student, label: 'Student' },
    { value: UserRole.Teacher, label: 'Teacher' },
    { value: UserRole.Admin, label: 'Admin' }
  ];

  const selectedRoleLabel = $derived.by(() => {
    const option = roleOptions.find((opt) => opt.value === selectedRoleValue);
    return option?.label || 'Select a role';
  });

  function handleCancel() {
    open = false;
  }

  async function handleSuccess() {
    toast.success('User updated successfully');
    open = false;
    onSuccess();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit User</Dialog.Title>
      <Dialog.Description>
        Update user information and role. Changes will be saved immediately.
      </Dialog.Description>
    </Dialog.Header>

    {#if user}
      <form
        {...updateUser.enhance(async ({ submit }) => {
          try {
            await submit();
            await handleSuccess();
          } catch (error: HttpError | unknown) {
            if (isHttpError(error)) {
              toast.error(error.body.message || 'Failed to update user');
            } else {
              toast.error('Failed to update user');
            }
          }
        })}
        class="space-y-4"
      >
        <input type="hidden" name="userId" value={user.id} />

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">First Name</Label>
            <Input
              {...updateUser.fields.name.as('text')}
              id="name"
              name="name"
              type="text"
              value={user.name}
              required
              placeholder="First name"
            />
          </div>

          <div class="space-y-2">
            <Label for="surname">Last Name</Label>
            <Input
              {...updateUser.fields.surname.as('text')}
              id="surname"
              name="surname"
              type="text"
              value={user.surname}
              required
              placeholder="Last name"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="username">Username</Label>
          <Input
            {...updateUser.fields.username.as('text')}
            id="username"
            name="username"
            type="text"
            value={user.username}
            required
            placeholder="Username"
          />
        </div>

        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            {...updateUser.fields.email.as('text')}
            id="email"
            name="email"
            type="email"
            value={user.email}
            required
            placeholder="email@example.com"
          />
        </div>

        <div class="space-y-2">
          <Label for="role">Role</Label>
          <Select.Root
            type="single"
            name="role"
            value={selectedRoleValue}
            onValueChange={(value) => {
              if (value) {
                selectedRoleValue = value;
              }
            }}
          >
            <Select.Trigger id="role" class="w-full">
              {selectedRoleLabel}
            </Select.Trigger>
            <Select.Content>
              {#each roleOptions as role}
                <Select.Item value={role.value}>
                  {role.label}
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>

        <Dialog.Footer>
          <Button type="button" variant="outline" onclick={handleCancel}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </Dialog.Footer>
      </form>
    {/if}
  </Dialog.Content>
</Dialog.Root>
