<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import Plus from '@lucide/svelte/icons/plus';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';
  import type { CreateGroupForm } from '$routes/dashboard/teacher/groups/groups.remote';

  interface Props {
    createGroup: CreateGroupForm;
  }

  let { createGroup }: Props = $props();

  let dialogOpen = $state(false);
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

    <form
      {...createGroup.enhance(async ({ submit }) => {
        try {
          await submit();
          toast.success(m.groups_create_success());
          dialogOpen = false;
        } catch (error) {
          if (isHttpError(error)) {
            toast.error(error.body.message);
          } else {
            toast.error(m.groups_create_error());
          }
        }
      })}
      class="space-y-6"
    >
      <div class="space-y-2">
        <Label for="name">{m.groups_form_name_label()}</Label>
        <Input
          {...createGroup.fields.name.as('text')}
          id="name"
          name="name"
          autocomplete="off"
          placeholder={m.groups_form_name_placeholder()}
          required
          class="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
        {#each createGroup.fields.name.issues() as issue (issue.message)}
          <p class="text-sm text-destructive">{issue.message}</p>
        {/each}
      </div>

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={() => (dialogOpen = false)}>
          {m.groups_form_cancel()}
        </Button>
        <Button type="submit">
          {m.groups_form_create()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
