<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';
  import type { Group } from '$lib/dto/group';
  import type { UpdateGroupForm } from '$routes/dashboard/teacher/groups/[groupId]/group.remote';

  interface Props {
    group: Group;
    dialogOpen: boolean;
    updateGroup: UpdateGroupForm;
  }

  let { group, dialogOpen = $bindable(), updateGroup }: Props = $props();
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>{m.groups_edit_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.groups_edit_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <form
      {...updateGroup.enhance(async ({ submit }) => {
        try {
          await submit();
          toast.success(m.groups_edit_success());
          dialogOpen = false;
        } catch (error) {
          if (isHttpError(error)) {
            toast.error(error.body.message);
          } else {
            toast.error(m.groups_edit_error());
          }
        }
      })}
      class="space-y-6"
    >
      <input {...updateGroup.fields.id.as('number')} type="hidden" value={group.id} />

      <div class="space-y-2">
        <Label for="name">{m.groups_form_name_label()}</Label>
        <Input
          {...updateGroup.fields.name.as('text')}
          id="name"
          name="name"
          autocomplete="off"
          value={group.name}
          placeholder={m.groups_form_name_placeholder()}
          required
          class="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
        {#each updateGroup.fields.name.issues() as issue (issue.message)}
          <p class="text-sm text-destructive">{issue.message}</p>
        {/each}
      </div>

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={() => (dialogOpen = false)}>
          {m.groups_form_cancel()}
        </Button>
        <Button type="submit">
          {m.groups_form_update()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
