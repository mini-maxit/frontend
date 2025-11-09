<script lang="ts">
  import { getTask, getLanguages } from './task.remote';
  import { submitSolution } from './submit.remote';
  import TaskHeader from '$lib/components/dashboard/tasks/task-page/tasks/TaskHeader.svelte';
  import TaskPdfViewer from '$lib/components/dashboard/tasks/task-page/tasks/TaskPdfViewer.svelte';
  import TaskSubmissionForm from '$lib/components/dashboard/tasks/task-page/tasks/TaskSubmissionForm.svelte';
  import FilePreview from '$lib/components/dashboard/tasks/task-page/tasks/FilePreview.svelte';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    data: {
      taskId: number;
    };
  }

  let { data }: Props = $props();

  const taskQuery = getTask(data.taskId);
  const languagesQuery = getLanguages();

  let fileContent = $state<string>('');
</script>

<div class="space-y-6">
  {#if taskQuery.error}
    <ErrorCard
      title={m.task_error_title()}
      error={taskQuery.error}
      onRetry={() => taskQuery.refresh()}
      inCard
    />
  {:else if taskQuery.loading}
    <LoadingSpinner />
  {:else if taskQuery.current}
    <TaskHeader
      id={taskQuery.current.id}
      title={taskQuery.current.title}
      createdByName={taskQuery.current.createdByName}
      createdAt={taskQuery.current.createdAt}
    />

    <div class="grid h-screen gap-6 lg:grid-cols-2">
      <TaskPdfViewer pdfDataUrl={taskQuery.current.pdfDataUrl} />

      <div class="flex flex-col gap-6 overflow-hidden lg:space-y-6">
        <TaskSubmissionForm
          bind:fileContent
          languages={languagesQuery.current || []}
          loading={languagesQuery.loading}
          error={languagesQuery.error}
          submitAction={submitSolution}
          taskId={data.taskId}
        />

        <FilePreview content={fileContent} />
      </div>
    </div>
  {/if}
</div>
