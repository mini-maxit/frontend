<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import Plus from '@lucide/svelte/icons/plus';
  import * as m from '$lib/paraglide/messages';
  import type { CreateContestForm } from '$routes/dashboard/admin/contests/contests.remote';
  import CreateContestFormComponent from './CreateContestForm.svelte';

  interface Props {
    createContest: CreateContestForm;
  }

  let { createContest }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog.Root bind:open={dialogOpen}>
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
        <Plus class="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-primary-foreground">
          {m.admin_contests_create_title()}
        </h3>
        <p class="mt-1 text-sm text-primary-foreground/80">
          {m.admin_contests_create_description()}
        </p>
      </div>
    </div>
  </button>

  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{m.admin_contests_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_contests_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <CreateContestFormComponent
      {createContest}
      onSuccess={() => {
        dialogOpen = false;
      }}
      onCancel={() => {
        dialogOpen = false;
      }}
    />
  </Dialog.Content>
</Dialog.Root>
