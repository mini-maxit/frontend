<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { getTasksManagementInstance } from '$lib/services';
  import { UploadTaskSchema } from '$lib/schemas';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import Loader from '@lucide/svelte/icons/loader-circle';

  interface TasksUploadDialogProps {
    open: boolean;
    onSuccess: () => void;
  }

  let { open = $bindable(), onSuccess }: TasksUploadDialogProps = $props();

  const tasksManagementService = getTasksManagementInstance();

  const MAX_UPLOAD_MB = 50; // Default limit

  // Initialize superform for SPA mode with file upload support
  const { form, errors, enhance, submitting } = superForm(defaults(valibot(UploadTaskSchema)), {
    id: 'upload-task',
    validators: valibot(UploadTaskSchema),
    SPA: true,
    dataType: 'form', // Use 'form' for file uploads, not 'json'
    resetForm: true,
    async onUpdate({ form }) {
      if (!tasksManagementService || !form.valid) {
        return;
      }

      try {
        const result = await tasksManagementService.uploadTask({
          title: form.data.title.trim(),
          archive: form.data.archive,
          isVisible: form.data.isVisible ?? false
        });

        if (result.success) {
          toast.success(m.admin_tasks_upload_success());
          open = false;
          onSuccess();
        } else {
          toast.error(result.error || m.admin_tasks_upload_error());
        }
      } catch (error) {
        console.error('Upload task error:', error);
        toast.error(m.admin_tasks_upload_error());
      }
    }
  });

  function handleCancel() {
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_tasks_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_tasks_dialog_description()}
        <span class="ml-1 text-sm text-muted-foreground"
          >({m.admin_tasks_upload_limit({ limit: MAX_UPLOAD_MB })})</span
        >
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" enctype="multipart/form-data" use:enhance class="space-y-6">
      <div class="space-y-2">
        <Label for="title">{m.admin_tasks_form_title_label()}</Label>
        <Input
          id="title"
          name="title"
          type="text"
          bind:value={$form.title}
          placeholder={m.admin_tasks_form_title_placeholder()}
          disabled={$submitting}
          aria-invalid={$errors.title ? 'true' : undefined}
        />
        {#if $errors.title}
          <p class="text-sm text-destructive">{$errors.title}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <Label for="archive">{m.admin_tasks_form_file_label()}</Label>
        <Input
          id="archive"
          name="archive"
          type="file"
          accept=".zip"
          disabled={$submitting}
          aria-invalid={$errors.archive ? 'true' : undefined}
          onchange={(e) => {
            const input = e.currentTarget;
            if (input.files && input.files.length > 0) {
              $form.archive = input.files[0];
            }
          }}
        />
        {#if $errors.archive}
          <p class="text-sm text-destructive">{$errors.archive}</p>
        {/if}
        {#if $form.archive}
          <p class="text-sm text-muted-foreground">
            {m.task_file_selected({
              filename: $form.archive.name,
              size: ($form.archive.size / 1024).toFixed(2)
            })}
          </p>
        {/if}
      </div>

      <div class="flex items-center space-x-2">
        <Checkbox
          id="isVisible"
          checked={$form.isVisible}
          onCheckedChange={(checked) => ($form.isVisible = checked === true)}
          disabled={$submitting}
        />
        <Label
          for="isVisible"
          class="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {m.admin_tasks_card_visible_to_users()}
        </Label>
      </div>

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleCancel} disabled={$submitting}>
          {m.admin_tasks_form_cancel()}
        </Button>
        <Button type="submit" disabled={$submitting}>
          {#if $submitting}
            <Loader class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          {$submitting ? m.admin_tasks_upload_uploading() : m.admin_tasks_upload_button()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
