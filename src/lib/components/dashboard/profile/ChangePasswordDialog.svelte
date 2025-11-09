<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { changePassword } from '../../../../routes/dashboard/user/profile/password.remote';
  import { toast } from 'svelte-sonner';
  import Lock from '@lucide/svelte/icons/lock';
  import Eye from '@lucide/svelte/icons/eye';
  import EyeOff from '@lucide/svelte/icons/eye-off';
  import * as m from '$lib/paraglide/messages';

  interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

  let { open = $bindable(), onOpenChange }: ChangePasswordDialogProps = $props();

  let showCurrentPassword = $state(false);
  let showNewPassword = $state(false);
  let showConfirmPassword = $state(false);

  function handleClose() {
    open = false;
    onOpenChange(false);
    // Reset form when closing
    changePassword.fields.set({
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    });
  }

  // Helper function to get the first error for a field
  function getFirstError(issues: unknown) {
    if (!issues || !Array.isArray(issues) || issues.length === 0) return null;
    return issues[0] || null;
  }

  // Helper function to get first general form error (excluding password mismatch)
  function getFirstGeneralError() {
    const allIssues = changePassword.fields.allIssues();
    if (!allIssues || !Array.isArray(allIssues) || allIssues.length === 0) return null;

    // Filter out password mismatch error to avoid duplication (it's already shown on confirm field)
    const generalErrors = allIssues.filter(
      (issue) =>
        issue &&
        typeof issue === 'object' &&
        'message' in issue &&
        issue.message !== m.validation_passwords_match()
    );

    return generalErrors.length > 0 ? generalErrors[0] : null;
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

    <form
      {...changePassword.enhance(async ({ submit }) => {
        try {
          await submit();
          // Check if form was actually successful by looking at the result
          if (changePassword.result?.success) {
            toast.success(m.profile_password_change_success());
            handleClose();
          }
          // If there are validation errors or no success, keep dialog open
        } catch {
          toast.error(m.profile_password_change_error());
        }
      })}
      class="space-y-4"
      oninput={() => changePassword.validate()}
    >
      <!-- Current Password -->
      <div class="space-y-2">
        <Label for="current-password">{m.profile_current_password_label()}</Label>
        <div class="relative">
          <Input
            {...changePassword.fields.oldPassword.as('password')}
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
        {#if getFirstError(changePassword.fields.oldPassword.issues())}
          <p class="text-sm text-destructive">
            {getFirstError(changePassword.fields.oldPassword.issues())?.message}
          </p>
        {/if}
      </div>

      <!-- New Password -->
      <div class="space-y-2">
        <Label for="new-password">{m.profile_new_password_label()}</Label>
        <div class="relative">
          <Input
            {...changePassword.fields.newPassword.as('password')}
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
        {#if getFirstError(changePassword.fields.newPassword.issues())}
          <p class="text-sm text-destructive">
            {getFirstError(changePassword.fields.newPassword.issues())?.message}
          </p>
        {/if}
      </div>

      <!-- Confirm New Password -->
      <div class="space-y-2">
        <Label for="confirm-password">{m.profile_confirm_password_label()}</Label>
        <div class="relative">
          <Input
            {...changePassword.fields.newPasswordConfirm.as('password')}
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
        {#if getFirstError(changePassword.fields.newPasswordConfirm.issues())}
          <p class="text-sm text-destructive">
            {getFirstError(changePassword.fields.newPasswordConfirm.issues())?.message}
          </p>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onclick={handleClose}
          >{m.profile_password_change_cancel()}</Button
        >
        <Button type="submit" disabled={!!changePassword.pending}>
          {#if changePassword.pending}
            {m.profile_password_changing()}
          {:else}
            {m.profile_password_change_submit()}
          {/if}
        </Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
