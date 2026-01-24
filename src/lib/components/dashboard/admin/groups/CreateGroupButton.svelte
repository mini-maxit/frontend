<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import Plus from '@lucide/svelte/icons/plus';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { superForm, defaults } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { CreateGroupSchema } from '$lib/schemas';
  import { getGroupsManagementInstance } from '$lib/services';

  interface Props {
    onSuccess?: () => void;
  }

  let { onSuccess }: Props = $props();

  const groupsService = getGroupsManagementInstance();

  let dialogOpen = $state(false);

  // Initialize superform for SPA mode with client-side validation
  const { form, errors, enhance, submitting } = superForm(defaults(valibot(CreateGroupSchema)), {
    id: 'create-group',
    validators: valibot(CreateGroupSchema),
    SPA: true,
    dataType: 'json',
    resetForm: false,
    async onUpdate({ form }) {
      if (!groupsService || !form.valid) return;

      try {
        await groupsService.createGroup({
          name: form.data.name
        });
        toast.success(m.groups_create_success());
        dialogOpen = false;
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Create group error:', error);
        toast.error(m.groups_create_error());
      }
    }
  });
</script>

<Dialog.Root bind:open={dialogOpen}>
  <button
    onclick={() => (dialogOpen = true)}
    class="group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-primary to-secondary p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div
      class="absolute inset-0 bg-linear-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    ></div>

    <div class="relative flex flex-col items-center gap-4 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
      >
        <Plus class="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-primary-foreground">
          {m.groups_create_title()}
        </h3>
        <p class="mt-1 text-sm text-primary-foreground/80">
          {m.groups_create_description()}
        </p>
      </div>
    </div>
  </button>

  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>{m.groups_create_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.groups_create_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance class="space-y-6">
      <div class="space-y-2">
        <Label for="name">{m.groups_form_name_label()}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          bind:value={$form.name}
          disabled={$submitting}
          aria-invalid={$errors.name ? 'true' : undefined}
          placeholder={m.groups_form_name_placeholder()}
          class="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
        {#if $errors.name}
          <p class="text-sm text-destructive">{$errors.name}</p>
        {/if}
      </div>

      <Dialog.Footer>
        <Button
          type="button"
          variant="outline"
          onclick={() => (dialogOpen = false)}
          disabled={$submitting}
        >
          {m.groups_form_cancel()}
        </Button>
        <Button type="submit" disabled={$submitting}>
          {$submitting ? 'Creating...' : m.groups_form_create()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
