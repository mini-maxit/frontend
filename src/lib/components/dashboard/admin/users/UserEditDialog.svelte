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
    { value: UserRole.Student, label: m.admin_users_role_student() },
    { value: UserRole.Teacher, label: m.admin_users_role_teacher() },
    { value: UserRole.Admin, label: m.admin_users_role_admin() }
  ];

  const selectedRoleLabel = $derived.by(() => {
    const option = roleOptions.find((opt) => opt.value === selectedRoleValue);
    return option?.label || m.admin_users_filter_role_label();
  });

  function handleCancel() {
    open = false;
  }

  async function handleSuccess() {
    toast.success(m.admin_users_edit_success());
    open = false;
    onSuccess();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_users_edit_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_users_edit_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    {#if user}
      <form
        {...updateUser.enhance(async ({ submit, data }) => {
          try {
            console.log('Submitting form to update user..., form:', data);
            await submit();
            await handleSuccess();
          } catch (error: HttpError | unknown) {
            if (isHttpError(error)) {
              toast.error(error.body.message || m.admin_users_edit_error());
            } else {
              toast.error(m.admin_users_edit_error());
            }
          }
        })}
        class="space-y-4"
      >
        <input hidden {...updateUser.fields.userId.as('number')} value={user.id} />

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">{m.register_name_label()}</Label>
            <Input
              {...updateUser.fields.name.as('text')}
              id="name"
              name="name"
              type="text"
              value={user.name}
              required
              placeholder={m.register_name_placeholder()}
            />
          </div>

          <div class="space-y-2">
            <Label for="surname">{m.register_surname_label()}</Label>
            <Input
              {...updateUser.fields.surname.as('text')}
              id="surname"
              name="surname"
              type="text"
              value={user.surname}
              required
              placeholder={m.register_surname_placeholder()}
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="username">{m.register_username_label()}</Label>
          <Input
            {...updateUser.fields.username.as('text')}
            id="username"
            name="username"
            type="text"
            value={user.username}
            required
            placeholder={m.register_username_placeholder()}
          />
        </div>

        <div class="space-y-2">
          <Label for="email">{m.register_email_label()}</Label>
          <Input
            {...updateUser.fields.email.as('text')}
            id="email"
            name="email"
            type="email"
            value={user.email}
            required
            placeholder={m.register_email_placeholder()}
          />
        </div>

        <div class="space-y-2">
          <Label for="role">{m.admin_registration_requests_role()}</Label>
          <Select.Root
            {...updateUser.fields.role.as('select')}
            type="single"
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
          <Button type="button" variant="outline" onclick={handleCancel}
            >{m.admin_contests_form_cancel()}</Button
          >
          <Button type="submit">{m.admin_tasks_save_changes()}</Button>
        </Dialog.Footer>
      </form>
    {/if}
  </Dialog.Content>
</Dialog.Root>
