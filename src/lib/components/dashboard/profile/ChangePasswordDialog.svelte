<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { toast } from 'svelte-sonner';
  import { getUserInstance } from '$lib/services';
  import { superForm, defaults } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { ChangePasswordSchema } from '$lib/schemas';
  import Lock from '@lucide/svelte/icons/lock';
  import Eye from '@lucide/svelte/icons/eye';
  import EyeOff from '@lucide/svelte/icons/eye-off';
  import * as m from '$lib/paraglide/messages';

  interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

  let { open = $bindable(), onOpenChange }: ChangePasswordDialogProps = $props();

  const userService = getUserInstance();

  const { form, errors, enhance, submitting, reset } = superForm(
    defaults(valibot(ChangePasswordSchema)),
    {
      id: 'change-password',
      validators: valibot(ChangePasswordSchema),
      SPA: true,
      resetForm: true,
      async onUpdate({ form }) {
        if (!userService || !form.valid) return;

        // Get current user first to get their ID
        const userResult = await userService.getCurrentUser();
        if (!userResult.success || !userResult.data) {
          toast.error(userResult.error || 'Failed to get current user');
          return;
        }

        const result = await userService.changePassword(userResult.data.id, form.data);
        if (result.success) {
          toast.success(m.profile_password_change_success());
          handleClose();
        } else {
          toast.error(result.error || m.profile_password_change_error());
        }
      }
    }
  );

  let showCurrentPassword = $state(false);
  let showNewPassword = $state(false);
  let showConfirmPassword = $state(false);

  function handleClose() {
    open = false;
    onOpenChange(false);
    reset();
  }

  // Helper function to get the first error for a field
  function getFirstError(fieldErrors: string[] | undefined) {
    if (!fieldErrors || fieldErrors.length === 0) return null;
    return fieldErrors[0];
  }
</script>

<Dialog.Root bind:open onOpenChange={handleClose}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Lock class="h-4 w-4 text-primary" />
        </div>
        {m.profile_change_password_dialog_title()}
      </Dialog.Title>
      <Dialog.Description>
        {m.profile_change_password_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance class="space-y-4">
      <!-- Current Password -->
      <div class="space-y-2">
        <Label for="current-password">{m.profile_current_password_label()}</Label>
        <div class="relative">
          <Input
            name="oldPassword"
            bind:value={$form.oldPassword}
            id="current-password"
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder={m.profile_current_password_placeholder()}
            class="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onclick={() => (showCurrentPassword = !showCurrentPassword)}
          >
            {#if showCurrentPassword}
              <EyeOff class="h-4 w-4" />
            {:else}
              <Eye class="h-4 w-4" />
            {/if}
          </Button>
        </div>
        {#if getFirstError($errors.oldPassword)}
          <p class="text-sm text-destructive">
            {getFirstError($errors.oldPassword)}
          </p>
        {/if}
      </div>

      <!-- New Password -->
      <div class="space-y-2">
        <Label for="new-password">{m.profile_new_password_label()}</Label>
        <div class="relative">
          <Input
            name="newPassword"
            bind:value={$form.newPassword}
            id="new-password"
            type={showNewPassword ? 'text' : 'password'}
            placeholder={m.profile_new_password_placeholder()}
            class="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onclick={() => (showNewPassword = !showNewPassword)}
          >
            {#if showNewPassword}
              <EyeOff class="h-4 w-4" />
            {:else}
              <Eye class="h-4 w-4" />
            {/if}
          </Button>
        </div>
        {#if getFirstError($errors.newPassword)}
          <p class="text-sm text-destructive">
            {getFirstError($errors.newPassword)}
          </p>
        {/if}
      </div>

      <!-- Confirm New Password -->
      <div class="space-y-2">
        <Label for="confirm-password">{m.profile_confirm_password_label()}</Label>
        <div class="relative">
          <Input
            name="newPasswordConfirm"
            bind:value={$form.newPasswordConfirm}
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={m.profile_confirm_password_placeholder()}
            class="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onclick={() => (showConfirmPassword = !showConfirmPassword)}
          >
            {#if showConfirmPassword}
              <EyeOff class="h-4 w-4" />
            {:else}
              <Eye class="h-4 w-4" />
            {/if}
          </Button>
        </div>
        {#if getFirstError($errors.newPasswordConfirm)}
          <p class="text-sm text-destructive">
            {getFirstError($errors.newPasswordConfirm)}
          </p>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onclick={handleClose}
          >{m.profile_password_change_cancel()}</Button
        >
        <Button type="submit" disabled={$submitting}>
          {#if $submitting}
            {m.profile_password_changing()}
          {:else}
            {m.profile_password_change_submit()}
          {/if}
        </Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
