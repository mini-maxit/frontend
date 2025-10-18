<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import Code from '@lucide/svelte/icons/code';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import * as m from '$lib/paraglide/messages';
  import LanguageSelector from './LanguageSelector.svelte';
  import FileUploader from './FileUploader.svelte';
  import SubmitButton from './SubmitButton.svelte';
  import { toast } from 'svelte-sonner';
  import { isHttpError, type HttpError } from '@sveltejs/kit';
  import type { SubmitSolutionRemoteForm } from '../../../../../../routes/dashboard/tasks/[taskId]/submit.remote';
  import type { SvelteComponent } from 'svelte';

  interface Language {
    id: number;
    language: string;
    version: string;
    fileExtension: string;
  }

  interface Props {
    languages: Language[];
    loading?: boolean;
    error?: HttpError | any;
    submitAction: SubmitSolutionRemoteForm;
    taskId: number;
    fileContent: string;
  }

  let {
    languages,
    loading = false,
    error = null,
    submitAction,
    taskId,
    fileContent = $bindable()
  }: Props = $props();

  let selectedLanguageId = $state<number | null>(null);
  let selectedFiles = $state<FileList | null>(null);
  let fileUploader = $state<SvelteComponent | null>(null);
  let formElement = $state<HTMLFormElement | null>(null);

  function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  function validateFileExtension(file: File, languageId: number): boolean {
    const language = languages.find((l) => l.id === languageId);
    if (!language) return false;

    const fileExt = getFileExtension(file.name);
    return fileExt === language.fileExtension.toLowerCase();
  }

  async function handleSubmit() {
    if (!selectedFiles || !selectedLanguageId) {
      toast.error(m.task_submit_validation_both());
      return;
    }

    if (!validateFileExtension(selectedFiles[0], selectedLanguageId)) {
      const language = languages.find((l) => l.id === selectedLanguageId);
      toast.error(
        m.task_submit_validation_extension({
          extension: language?.fileExtension || '',
          language: language?.language || ''
        })
      );
      return;
    }

    formElement?.requestSubmit();
  }

  $effect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileContent = e.target?.result as string;
      };
      reader.readAsText(selectedFiles[0]);
    } else {
      fileContent = '';
    }
  });
</script>

<Card.Root class="shrink-0">
  <Card.Header>
    <Card.Title class="flex items-center gap-2">
      <Code class="h-5 w-5" />
      {m.task_submit_title()}
    </Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    {#if loading}
      <div class="flex items-center justify-center py-4">
        <Loader class="h-6 w-6 animate-spin text-primary" />
      </div>
    {:else if error}
      <p class="text-sm text-destructive">{m.task_languages_error()}</p>
    {:else}
      <form
        enctype="multipart/form-data"
        bind:this={formElement}
        id="submission-form"
        class="hidden"
        {...submitAction.enhance(async ({ submit }) => {
          try {
            await submit();
            toast.success(m.task_submit_success());
            selectedFiles = new DataTransfer().files;
            selectedLanguageId = null;
            fileUploader?.clear();
          } catch (error: HttpError | unknown) {
            if (isHttpError(error)) {
              toast.error(error.body.message);
            } else {
              toast.error(m.task_submit_error());
            }
          }
        })}
      >
        <input {...submitAction.fields.taskId.as('number')} bind:value={taskId} hidden />
        <input
          {...submitAction.fields.languageId.as('number')}
          bind:value={selectedLanguageId}
          hidden
        />
        <input
          {...submitAction.fields.solution.as('file')}
          bind:files={selectedFiles}
          type="file"
          hidden
        />
      </form>

      <LanguageSelector {languages} bind:selectedLanguageId />

      <FileUploader
        bind:this={fileUploader}
        bind:selectedFiles
        disabled={selectedLanguageId === null}
      />

      <SubmitButton
        disabled={!selectedFiles || selectedLanguageId === null || !!submitAction.pending}
        loading={!!submitAction.pending}
        onclick={handleSubmit}
      />
    {/if}
  </Card.Content>
</Card.Root>
