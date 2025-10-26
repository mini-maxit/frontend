<script lang="ts">
  import Lock from '@lucide/svelte/icons/lock';
  import UserCog from '@lucide/svelte/icons/user-cog';
  import * as m from '$lib/paraglide/messages';

  import ChangePasswordDialog from './ChangePasswordDialog.svelte';

  let showChangePasswordDialog = $state(false);

  function openChangePasswordDialog() {
    showChangePasswordDialog = true;
  }

  function handlePasswordDialogChange(open: boolean) {
    showChangePasswordDialog = open;
  }
</script>

<div class="space-y-4">
  <h2 class="text-2xl font-bold text-foreground">{m.admin_contests_quick_actions()}</h2>

  <div class="grid gap-4 sm:grid-cols-2">
    <!-- Change Password Button -->
    <button
      onclick={openChangePasswordDialog}
      class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-secondary p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      ></div>

      <div class="relative flex flex-col items-center gap-4 text-center">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
        >
          <Lock class="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-primary-foreground">{m.profile_change_password()}</h3>
          <p class="mt-1 text-sm text-primary-foreground/80">Update your account security</p>
        </div>
      </div>
    </button>

    <!-- Edit Profile Button -->
    <button
      class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-primary p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      ></div>

      <div class="relative flex flex-col items-center gap-4 text-center">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
        >
          <UserCog class="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-primary-foreground">Edit Profile</h3>
          <p class="mt-1 text-sm text-primary-foreground/80">Update your personal information</p>
        </div>
      </div>
    </button>
  </div>

  <!-- Change Password Dialog -->
  <ChangePasswordDialog
    bind:open={showChangePasswordDialog}
    onOpenChange={handlePasswordDialogChange}
  />
</div>
