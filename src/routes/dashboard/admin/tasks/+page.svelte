<script lang="ts">
  import { uploadTask } from './upload.remote';
  import { getTasks } from './tasks.remote';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import Upload from '@lucide/svelte/icons/upload';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import AdminTaskCard from '$lib/components/dashboard/tasks/AdminTaskCard.svelte';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import * as m from '$lib/paraglide/messages';

  let dialogOpen = $state(false);
  let fileInput = $state<HTMLInputElement | null>(null);
  let selectedFile = $state<File | null>(null);

  const tasksQuery = getTasks();

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFile = input.files[0];
    }
  }

  async function handleTaskUploadSuccess() {
    toast.success(m.admin_tasks_upload_success());
    dialogOpen = false;
    selectedFile = null;
    if (fileInput) {
      fileInput.value = '';
    }
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.admin_tasks_title()}</h1>
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_tasks_quick_actions()}</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Upload Task Button -->
      <Dialog.Root bind:open={dialogOpen}>
        <button
          onclick={() => (dialogOpen = true)}
          class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-secondary p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>

          <div class="relative flex flex-col items-center gap-4 text-center">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
            >
              <Upload class="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-primary-foreground">
                {m.admin_tasks_upload_title()}
              </h3>
              <p class="mt-1 text-sm text-primary-foreground/80">
                {m.admin_tasks_upload_description()}
              </p>
            </div>
          </div>
        </button>

        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{m.admin_tasks_dialog_title()}</Dialog.Title>
            <Dialog.Description>
              {m.admin_tasks_dialog_description()}
            </Dialog.Description>
          </Dialog.Header>

          <form
            enctype="multipart/form-data"
            {...uploadTask.enhance(async ({ submit }) => {
              try {
                await submit();
                await handleTaskUploadSuccess();
              } catch (error: { message?: string } | unknown) {
                if (isHttpError(error)) {
                  toast.error(error.body.message);
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
              <Button
                type="button"
                variant="outline"
                onclick={() => {
                  dialogOpen = false;
                  selectedFile = null;
                  if (fileInput) {
                    fileInput.value = '';
                  }
                }}
              >
                {m.admin_tasks_form_cancel()}
              </Button>
              <Button
                type="submit"
                class="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {m.admin_tasks_form_upload()}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>

  <!-- Tasks List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_tasks_all_tasks()}</h2>

    {#if tasksQuery.error}
      <div
        class="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-12 text-center"
      >
        <p class="text-lg font-medium text-destructive">{m.admin_tasks_load_error_title()}</p>
        <p class="mt-1 text-sm text-muted-foreground">
          {tasksQuery.error?.message || m.error_unknown_error()}
        </p>
        <Button variant="outline" class="mt-4" onclick={() => tasksQuery.refresh()}>
          {m.error_try_again()}
        </Button>
      </div>
    {:else if tasksQuery.loading}
      <div class="flex items-center justify-center py-12">
        <Loader class="h-8 w-8 animate-spin text-primary" />
      </div>
    {:else if tasksQuery.current && tasksQuery.current.length === 0}
      <div
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-12 text-center"
      >
        <Upload class="h-12 w-12 text-muted-foreground" />
        <p class="mt-4 text-lg font-medium text-foreground">{m.admin_tasks_no_tasks_title()}</p>
        <p class="mt-1 text-sm text-muted-foreground">{m.admin_tasks_no_tasks_description()}</p>
      </div>
    {:else}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each tasksQuery.current as task (task.id)}
          <AdminTaskCard {task} />
        {/each}
      </div>
    {/if}
  </div>
</div>
