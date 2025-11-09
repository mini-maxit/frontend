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

  let formData = $state({
    email: '',
    name: '',
    surname: '',
    username: '',
    role: UserRole.Student
  });

  let selectedRole = $state<{ value: string; label: string }>({
    value: UserRole.Student,
    label: 'Student'
  });

  $effect(() => {
    if (user) {
      formData = {
        email: user.email,
        name: user.name,
        surname: user.surname,
        username: user.username,
        role: user.role
      };
      selectedRole = {
        value: user.role,
        label: user.role.charAt(0).toUpperCase() + user.role.slice(1)
      };
    }
  });

  const roleOptions = [
    { value: UserRole.Student, label: 'Student' },
    { value: UserRole.Teacher, label: 'Teacher' },
    { value: UserRole.Admin, label: 'Admin' }
  ];

  function handleCancel() {
    open = false;
  }

  async function handleSubmit() {
    if (!user) return;

    try {
      await updateUser(user.id, {
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        role: selectedRole.value as UserRole
      });

      toast.success('User updated successfully');
      open = false;
      onSuccess();
    } catch (error: HttpError | unknown) {
      if (isHttpError(error)) {
        toast.error(error.body.message || 'Failed to update user');
      } else {
        toast.error('Failed to update user');
      }
    }
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
        onsubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        class="space-y-4"
      >
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">First Name</Label>
            <Input
              id="name"
              type="text"
              bind:value={formData.name}
              required
              placeholder="First name"
            />
          </div>

          <div class="space-y-2">
            <Label for="surname">Last Name</Label>
            <Input
              id="surname"
              type="text"
              bind:value={formData.surname}
              required
              placeholder="Last name"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="username">Username</Label>
          <Input
            id="username"
            type="text"
            bind:value={formData.username}
            required
            placeholder="Username"
          />
        </div>

        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            bind:value={formData.email}
            required
            placeholder="email@example.com"
          />
        </div>

        <div class="space-y-2">
          <Label for="role">Role</Label>
          <Select.Root
            selected={selectedRole}
            onSelectedChange={(v) => {
              if (v) {
                selectedRole = v;
              }
            }}
          >
            <Select.Trigger id="role" class="w-full">
              <Select.Value placeholder="Select a role" />
            </Select.Trigger>
            <Select.Content>
              {#each roleOptions as role}
                <Select.Item value={role.value} label={role.label}>
                  {role.label}
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>

        <Dialog.Footer>
          <Button type="button" variant="outline" onclick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </Dialog.Footer>
      </form>
    {/if}
  </Dialog.Content>
</Dialog.Root>
