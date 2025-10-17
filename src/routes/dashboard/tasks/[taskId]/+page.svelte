<script lang="ts">
  import { getTask, getLanguages } from './task.remote';
  import { submitSolution } from './submit.remote';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import FileText from '@lucide/svelte/icons/file-text';
  import User from '@lucide/svelte/icons/user';
  import Calendar from '@lucide/svelte/icons/calendar';
  import Send from '@lucide/svelte/icons/send';
  import Code from '@lucide/svelte/icons/code';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import * as m from '$lib/paraglide/messages';
  import { getLocale } from '$lib/paraglide/runtime';
  interface Props {
    data: {
      taskId: number;
    };
  }

  let { data }: Props = $props();

  const taskQuery = getTask(data.taskId);
  const languagesQuery = getLanguages();

  let selectedLanguageId = $state<number | null>(null);
  let selectedFile = $state<File | null>(null);
  let fileInput = $state<HTMLInputElement | null>(null);
  let fileContent = $state<string>('');
  let formElement = $state<HTMLFormElement | null>(null);

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      selectedFile = file;

      // Read file content for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        fileContent = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(getLocale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  function validateFileExtension(file: File, languageId: number): boolean {
    const languages = languagesQuery.current;
    if (!languages) return false;

    const language = languages.find((l) => l.id === languageId);
    if (!language) return false;

    const fileExt = getFileExtension(file.name);
    return fileExt === language.fileExtension.toLowerCase();
  }

  async function handleSubmit() {
    if (!selectedFile || !selectedLanguageId) {
      toast.error(m.task_submit_validation_both());
      return;
    }

    if (!validateFileExtension(selectedFile, selectedLanguageId)) {
      const language = languagesQuery.current?.find((l) => l.id === selectedLanguageId);
      toast.error(
        m.task_submit_validation_extension({
          extension: language?.fileExtension || '',
          language: language?.language || ''
        })
      );
      return;
    }

    try {
      submitSolution.fields.set({
        taskId: data.taskId,
        solution: selectedFile,
        languageId: selectedLanguageId
      });

      formElement?.requestSubmit();
    } catch (error) {
      if (isHttpError(error)) {
        toast.error(error.body.message);
      } else {
        toast.error(m.task_submit_error());
      }
    }
  }
</script>

<div class="space-y-6">
  {#if taskQuery.error}
    <Card.Root class="border-destructive/20 bg-destructive/5">
      <Card.Header>
        <Card.Title class="text-destructive">{m.task_error_title()}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p class="text-sm text-muted-foreground">
          {taskQuery.error?.message || m.task_error_unknown()}
        </p>
        <Button variant="outline" class="mt-4" onclick={() => taskQuery.refresh()}>
          {m.task_error_try_again()}
        </Button>
      </Card.Content>
    </Card.Root>
  {:else if taskQuery.loading}
    <div class="flex items-center justify-center py-12">
      <Loader class="h-8 w-8 animate-spin text-primary" />
    </div>
  {:else if taskQuery.current}
    <!-- Task Header -->
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div class="space-y-2">
          <h1 class="flex items-center gap-3 text-3xl font-bold text-foreground">
            <span
              class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary"
            >
              {m.task_badge_prefix()}{taskQuery.current.id}
            </span>
            <FileText class="h-8 w-8" />
            {taskQuery.current.title}
          </h1>
        </div>
      </div>

      <!-- Task Metadata -->
      <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-2">
          <User class="h-4 w-4" />
          <span>{m.task_created_by()} <strong>{taskQuery.current.createdByName}</strong></span>
        </div>
        <div class="flex items-center gap-2">
          <Calendar class="h-4 w-4" />
          <span>{formatDate(taskQuery.current.createdAt)}</span>
        </div>
      </div>
    </div>

    <div class="grid h-screen gap-6 lg:grid-cols-2">
      <!-- Left: PDF Description -->
      <Card.Root class="flex flex-col">
        <Card.Header>
          <Card.Title>{m.task_description_title()}</Card.Title>
        </Card.Header>
        <Card.Content class="flex-1">
          <div class="h-full w-full overflow-hidden rounded-lg border">
            {#if taskQuery.current.pdfDataUrl}
              <iframe
                src={taskQuery.current.pdfDataUrl}
                title={m.task_description_title()}
                class="h-full w-full"
                frameborder="0"
              ></iframe>
            {:else}
              <div class="flex h-full items-center justify-center">
                <p class="text-sm text-muted-foreground">{m.task_description_none()}</p>
              </div>
            {/if}
          </div>
        </Card.Content>
      </Card.Root>

      <!-- Right: Solution Submission -->
      <div class="flex flex-col gap-6 overflow-hidden lg:space-y-6">
        <!-- Language Selection & File Upload -->
        <Card.Root class="shrink-0">
          <Card.Header>
            <Card.Title class="flex items-center gap-2">
              <Code class="h-5 w-5" />
              {m.task_submit_title()}
            </Card.Title>
          </Card.Header>
          <Card.Content class="space-y-4">
            {#if languagesQuery.loading}
              <div class="flex items-center justify-center py-4">
                <Loader class="h-6 w-6 animate-spin text-primary" />
              </div>
            {:else if languagesQuery.error}
              <p class="text-sm text-destructive">{m.task_languages_error()}</p>
            {:else}
              <form
                bind:this={formElement}
                id="submission-form"
                class="hidden"
                {...submitSolution.enhance(async ({ submit }) => {
                  try {
                    await submit();
                    toast.success(m.task_submit_success());
                    selectedFile = null;
                    selectedLanguageId = null;
                    fileContent = '';
                    if (fileInput) {
                      fileInput.value = '';
                    }
                  } catch (error: { message?: string } | unknown) {
                    if (isHttpError(error)) {
                      toast.error(error.body.message);
                    } else {
                      toast.error(m.task_submit_error());
                    }
                  }
                })}
              >
                <!-- Hidden fields managed by form state -->
              </form>

              <!-- Language Selection -->
              <div class="space-y-2">
                <Label for="language">{m.task_language_label()}</Label>
                <select
                  id="language"
                  bind:value={selectedLanguageId}
                  class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={null}>{m.task_language_placeholder()}</option>
                  {#each languagesQuery.current as language}
                    <option value={language.id}>
                      {language.language} ({language.version}) - .{language.fileExtension}
                    </option>
                  {/each}
                </select>
                {#if languagesQuery.current && selectedLanguageId}
                  {@const language = languagesQuery.current.find(
                    (l) => l.id === selectedLanguageId
                  )}
                  <p class="text-xs text-muted-foreground">
                    {m.task_file_extension_required({ extension: language?.fileExtension || '' })}
                  </p>
                {/if}
              </div>

              <!-- File Upload -->
              <div class="space-y-2">
                <Label for="solution">{m.task_file_label()}</Label>
                <input
                  bind:this={fileInput}
                  id="solution"
                  name="solution"
                  type="file"
                  onchange={handleFileChange}
                  disabled={selectedLanguageId === null}
                  class="flex h-9 w-full min-w-0 cursor-pointer rounded-md border border-input bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs ring-offset-background transition-[color,box-shadow] outline-none file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {#if selectedFile}
                  <p class="text-sm text-muted-foreground">
                    {m.task_file_selected({
                      filename: selectedFile.name,
                      size: (selectedFile.size / 1024).toFixed(2)
                    })}
                  </p>
                {/if}
              </div>

              <!-- Submit Button -->
              <Button
                class="w-full"
                disabled={Boolean(
                  !selectedFile || selectedLanguageId === null || submitSolution.pending
                )}
                onclick={handleSubmit}
              >
                {#if submitSolution.pending}
                  <Loader class="mr-2 h-4 w-4 animate-spin" />
                  {m.task_submit_loading()}
                {:else}
                  <Send class="mr-2 h-4 w-4" />
                  {m.task_submit_button()}
                {/if}
              </Button>
            {/if}
          </Card.Content>
        </Card.Root>

        <!-- File Content Preview -->
        <Card.Root class="flex-1 overflow-hidden">
          <Card.Header>
            <Card.Title>{m.task_preview_title()}</Card.Title>
          </Card.Header>
          <Card.Content class="mx-6 overflow-auto px-0">
            <pre class="rounded-lg p-4 text-xs"><code>{fileContent}</code></pre>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  {/if}
</div>
