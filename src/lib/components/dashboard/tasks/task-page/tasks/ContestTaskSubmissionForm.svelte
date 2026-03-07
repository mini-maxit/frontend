<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import Code from '@lucide/svelte/icons/code';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import * as m from '$lib/paraglide/messages';
  import LanguageSelector from './LanguageSelector.svelte';
  import FileUploader from './FileUploader.svelte';
  import SubmitButton from './SubmitButton.svelte';
  import { toast } from 'svelte-sonner';
  import { getSubmissionInstance } from '$lib/services';
  import { superForm, defaults } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { SubmitContestSolutionSchema } from '$lib/schemas';
  import type { Language } from '$lib/dto/submission';

  interface Props {
    languages: Language[];
    loading?: boolean;
    error?: any;
    contestId: number;
    taskId: number;
    fileContent: string;
    onSuccess?: () => void;
  }

  let {
    languages,
    loading = false,
    error = null,
    contestId,
    taskId,
    fileContent = $bindable(),
    onSuccess
  }: Props = $props();

  const submissionService = getSubmissionInstance();

  const { form, errors, enhance, submitting } = superForm(
    defaults(
      { contestId, taskId, languageId: 0, solution: new File([], '') },
      valibot(SubmitContestSolutionSchema)
    ),
    {
      id: `submit-contest-task-${contestId}-${taskId}`,
      validators: valibot(SubmitContestSolutionSchema),
      SPA: true,
      dataType: 'json',
      resetForm: false,
      async onUpdate({ form }) {
        if (!submissionService || !form.valid) return;

        const result = await submissionService.submitSolution({
          taskID: form.data.taskId,
          contestID: form.data.contestId,
          solution: form.data.solution,
          languageID: form.data.languageId
        });

        if (result.success) {
          toast.success(m.task_submit_success());
          selectedFiles = null;
          selectedLanguageId = null;
          fileUploader?.clear();
          onSuccess?.();
        } else {
          toast.error(result.error || m.task_submit_error());
        }
      }
    }
  );

  let selectedFiles = $state<FileList | null>(null);
  let fileUploader = $state<FileUploader | null>(null);
  let selectedLanguageId = $state<number | null>(null);

  function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  function validateFileExtension(file: File, languageId: number): boolean {
    const language = languages.find((l) => l.id === languageId);
    if (!language) return false;

    const fileExt = getFileExtension(file.name);
    return fileExt === language.fileExtension.toLowerCase();
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!selectedFiles || !selectedLanguageId) {
      toast.error(m.task_submit_validation_both());
      return;
    }

    if (selectedFiles.length === 0) {
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
  }

  // Read file content for preview
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
        method="POST"
        class="space-y-4"
        use:enhance
        onsubmit={handleSubmit}
      >
        <LanguageSelector
          {languages}
          bind:selectedLanguageId
          onChange={(id) => {
            if (id !== null) {
              $form.languageId = id;
            }
          }}
        />

        <FileUploader
          bind:this={fileUploader}
          bind:selectedFiles
          disabled={selectedLanguageId === null}
          onChange={(files) => {
            if (files && files.length > 0) {
              $form.solution = files[0];
            }
          }}
        />

        <SubmitButton
          disabled={!selectedFiles || selectedLanguageId === null || $submitting}
          loading={$submitting}
        />
      </form>
    {/if}
  </Card.Content>
</Card.Root>
