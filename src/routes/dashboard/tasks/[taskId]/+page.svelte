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
    return new Intl.DateTimeFormat('en-US', {
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
      toast.error('Please select both a file and a language');
      return;
    }

    if (!validateFileExtension(selectedFile, selectedLanguageId)) {
      const language = languagesQuery.current?.find((l) => l.id === selectedLanguageId);
      toast.error(`File extension must be .${language?.fileExtension} for ${language?.language}`);
      return;
    }

    try {
      submitSolution.fields.set({
        taskId: data.taskId,
        solution: selectedFile,
        languageId: selectedLanguageId
      });

      const formElement = document.getElementById('submission-form') as HTMLFormElement;
      if (formElement) {
        formElement.requestSubmit();
      }
    } catch (error) {
      if (isHttpError(error)) {
        toast.error(error.body.message);
      } else {
        toast.error('Failed to submit solution');
      }
    }
  }
</script>

<div class="space-y-6">
  {#if taskQuery.error}
    <Card.Root class="border-destructive/20 bg-destructive/5">
      <Card.Header>
        <Card.Title class="text-destructive">Error Loading Task</Card.Title>
      </Card.Header>
      <Card.Content>
        <p class="text-sm text-muted-foreground">
          {taskQuery.error?.message || 'Unknown error occurred'}
        </p>
        <Button variant="outline" class="mt-4" onclick={() => taskQuery.refresh()}>
          Try Again
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
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary"
            >
              Task #{taskQuery.current.id}
            </span>
          </div>
          <h1 class="flex items-center gap-3 text-3xl font-bold text-foreground">
            <FileText class="h-8 w-8" />
            {taskQuery.current.title}
          </h1>
        </div>
      </div>

      <!-- Task Metadata -->
      <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-2">
          <User class="h-4 w-4" />
          <span>Created by <strong>{taskQuery.current.createdByName}</strong></span>
        </div>
        <div class="flex items-center gap-2">
          <Calendar class="h-4 w-4" />
          <span>{formatDate(taskQuery.current.createdAt)}</span>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left: PDF Description -->
      <Card.Root class="flex flex-col">
        <Card.Header>
          <Card.Title>Task Description</Card.Title>
        </Card.Header>
        <Card.Content class="flex-1">
          <div class="h-[600px] w-full overflow-hidden rounded-lg border">
            {#if taskQuery.current.pdfDataUrl}
              <iframe
                src={taskQuery.current.pdfDataUrl}
                title="Task Description"
                class="h-full w-full"
                frameborder="0"
              ></iframe>
            {:else}
              <div class="flex h-full items-center justify-center">
                <p class="text-sm text-muted-foreground">No description available</p>
              </div>
            {/if}
          </div>
        </Card.Content>
      </Card.Root>

      <!-- Right: Solution Submission -->
      <div class="space-y-6">
        <!-- Language Selection & File Upload -->
        <Card.Root>
          <Card.Header>
            <Card.Title class="flex items-center gap-2">
              <Code class="h-5 w-5" />
              Submit Your Solution
            </Card.Title>
          </Card.Header>
          <Card.Content class="space-y-4">
            {#if languagesQuery.loading}
              <div class="flex items-center justify-center py-4">
                <Loader class="h-6 w-6 animate-spin text-primary" />
              </div>
            {:else if languagesQuery.error}
              <p class="text-sm text-destructive">Failed to load languages</p>
            {:else}
              <form
                id="submission-form"
                class="hidden"
                {...submitSolution.enhance(async ({ submit }) => {
                  try {
                    await submit();
                    toast.success('Solution submitted successfully!');
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
                      toast.error('Failed to submit solution');
                    }
                  }
                })}
              >
                <!-- Hidden fields managed by form state -->
              </form>

              <!-- Language Selection -->
              <div class="space-y-2">
                <Label for="language">Programming Language</Label>
                <select
                  id="language"
                  bind:value={selectedLanguageId}
                  class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={null}>Select a language</option>
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
                    File must have extension: <code class="rounded bg-muted px-1 py-0.5"
                      >.{language?.fileExtension}</code
                    >
                  </p>
                {/if}
              </div>

              <!-- File Upload -->
              <div class="space-y-2">
                <Label for="solution">Solution File</Label>
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
                    Selected: <strong>{selectedFile.name}</strong> ({(
                      selectedFile.size / 1024
                    ).toFixed(2)} KB)
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
                  Submitting...
                {:else}
                  <Send class="mr-2 h-4 w-4" />
                  Submit Solution
                {/if}
              </Button>
            {/if}
          </Card.Content>
        </Card.Root>

        <!-- File Content Preview -->
        {#if fileContent}
          <Card.Root>
            <Card.Header>
              <Card.Title>File Preview</Card.Title>
            </Card.Header>
            <Card.Content>
              <pre class="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs"><code
                  >{fileContent}</code
                ></pre>
            </Card.Content>
          </Card.Root>
        {/if}
      </div>
    </div>
  {/if}
</div>
