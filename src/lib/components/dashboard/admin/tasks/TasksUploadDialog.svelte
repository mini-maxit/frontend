<script lang="ts">
  import { uploadTask, getUploadLimit } from '$routes/dashboard/teacher/tasks/upload.remote';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import { isHttpError, type HttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';

  interface TasksUploadDialogProps {
    open: boolean;
    onSuccess: () => void;
  }

  let { open = $bindable(), onSuccess }: TasksUploadDialogProps = $props();

  let fileInput = $state<HTMLInputElement | null>(null);
  let selectedFile = $state<File | null>(null);

  // Read upload limit from server via remote query (single source of truth)
  const uploadLimit = getUploadLimit();

  function toMB(bytes: number): number {
    return Math.round((bytes / (1024 * 1024)) * 100) / 100;
  }

  let MAX_UPLOAD_BYTES = $derived(uploadLimit.current?.bytes ?? 20 * 1024 * 1024);
  let MAX_UPLOAD_MB = $derived(toMB(MAX_UPLOAD_BYTES));

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFile = input.files[0];
    }
  }

  async function handleTaskUploadSuccess() {
    toast.success(m.admin_tasks_upload_success());
    open = false;
    selectedFile = null;
    if (fileInput) {
      fileInput.value = '';
    }
    onSuccess();
  }

  function handleCancel() {
    open = false;
    selectedFile = null;
    if (fileInput) {
      fileInput.value = '';
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_tasks_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_tasks_dialog_description()}
        {#if uploadLimit.loading}
          <span class="ml-1 text-sm text-muted-foreground">(…)</span>
        {:else if uploadLimit.error}
          <span class="ml-1 text-sm text-muted-foreground">(limit unavailable)</span>
        {:else if uploadLimit.current}
          <span class="ml-1 text-sm text-muted-foreground">({MAX_UPLOAD_MB} MB max)</span>
        {/if}
      </Dialog.Description>
    </Dialog.Header>

    <form
      enctype="multipart/form-data"
      {...uploadTask.enhance(async ({ submit }) => {
        try {
          // Client-side guard to prevent submitting too-large files
          if (uploadLimit.current && selectedFile && selectedFile.size > MAX_UPLOAD_BYTES) {
            throw new Error('UPLOAD_TOO_LARGE');
          }

          await submit();
          await handleTaskUploadSuccess();
        } catch (error: HttpError | unknown) {
          if (error instanceof Error && error.message === 'UPLOAD_TOO_LARGE') {
            toast.error(
              `${m.admin_tasks_upload_too_large_title()} — ${m.admin_tasks_upload_too_large_description(
                {
                  limit: MAX_UPLOAD_MB
                }
              )} ${m.admin_tasks_upload_too_large_try_smaller()}`
            );
          } else if (isHttpError(error)) {
            const rawMessage = error?.body?.message || '';
            const message = rawMessage.toLowerCase();
            if (
              error.status === 413 ||
              message.includes('exceeds limit') ||
              (error.status === 500 &&
                (message.includes('exceeds limit') || message.includes('body_size_limit')))
            ) {
              toast.error(
                `${m.admin_tasks_upload_too_large_title()} — ${m.admin_tasks_upload_too_large_description(
                  {
                    limit: MAX_UPLOAD_MB
                  }
                )} ${m.admin_tasks_upload_too_large_try_smaller()}`
              );
            } else {
              toast.error(rawMessage || m.admin_tasks_upload_error());
            }
          } else {
            toast.error(m.admin_tasks_upload_error());
          }
        }
      })}
      class="space-y-6"
    >
      <div class="space-y-2">
        <Label for="title">{m.admin_tasks_form_title_label()}</Label>
        <Input
          {...uploadTask.fields.title.as('text')}
          id="title"
          name="title"
          type="text"
          placeholder={m.admin_tasks_form_title_placeholder()}
          required
          class="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
      </div>

      <div class="space-y-2">
        <Label for="archive">{m.admin_tasks_form_archive_label()}</Label>
        <Input
          bind:ref={fileInput}
          id="archive"
          name="archive"
          type="file"
          required
          accept=".zip,.tar,.tar.gz,.tgz"
          onchange={handleFileChange}
          class="cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
        {#if selectedFile}
          <p class="text-sm text-muted-foreground">
            {m.admin_tasks_form_selected_file({
              filename: selectedFile.name,
              size: (selectedFile.size / 1024 / 1024).toFixed(2)
            })}
          </p>
        {/if}
      </div>

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleCancel}>
          {m.admin_tasks_form_cancel()}
        </Button>
        <Button
          type="submit"
          disabled={uploadLimit.loading}
          class="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {m.admin_tasks_form_upload()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
