<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import type { Group } from '$lib/dto/group';
  import { superForm, defaults } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { UpdateGroupSchema } from '$lib/schemas';
  import { getGroupsManagementInstance } from '$lib/services';

  interface Props {
    group: Group;
    dialogOpen: boolean;
    onSuccess?: () => void;
  }

  let { group, dialogOpen = $bindable(), onSuccess }: Props = $props();

  const groupsService = getGroupsManagementInstance();

  // Initialize superform for SPA mode with client-side validation
  const { form, errors, enhance, submitting } = superForm(
    defaults(
      {
        groupId: group.id,
        name: group.name
      },
      valibot(UpdateGroupSchema)
    ),
    {
      id: `edit-group-${group.id}`,
      validators: valibot(UpdateGroupSchema),
      SPA: true,
      dataType: 'json',
      resetForm: false,
      async onUpdate({ form }) {
        if (!groupsService || !form.valid) return;

        try {
          await groupsService.updateGroup(form.data.groupId, {
            name: form.data.name
          });
          toast.success(m.groups_edit_success());
          dialogOpen = false;
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error('Update group error:', error);
          toast.error(m.groups_edit_error());
        }
      }
    }
  );
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>{m.groups_edit_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.groups_edit_dialog_description()}
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
        <Button type="button" variant="outline" onclick={() => (dialogOpen = false)} disabled={$submitting}>
          {m.groups_form_cancel()}
        </Button>
        <Button type="submit" disabled={$submitting}>
          {$submitting ? 'Updating...' : m.groups_form_update()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
