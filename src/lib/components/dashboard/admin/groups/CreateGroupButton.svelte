<script lang="ts">
  import { Button } from '#lib/components/ui/button/index.js';
  import { showApiError } from '#lib/errors/backend-error.js';
  import { Input } from '#lib/components/ui/input/index.js';
  import { Label } from '#lib/components/ui/label/index.js';
  import * as Dialog from '#lib/components/ui/dialog/index.js';
  import Plus from '@lucide/svelte/icons/plus';
  import { toast } from 'svelte-sonner';
  import * as m from '#lib/paraglide/messages.js';
  import { superForm, defaults } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { CreateGroupSchema } from '#lib/schemas/index.js';
  import { getGroupsManagementInstance } from '#lib/services/index.js';

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
        showApiError(error, m.groups_create_error());
      }
    }
  });
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Button variant="gradient" size="lg" onclick={() => (dialogOpen = true)}>
    <Plus />
    {m.groups_create_title()}
  </Button>

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
