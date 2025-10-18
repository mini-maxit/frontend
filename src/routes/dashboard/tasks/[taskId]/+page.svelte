<script lang="ts">
  import { getTask, getLanguages } from './task.remote';
  import { submitSolution } from './submit.remote';
  import TaskHeader from '$lib/components/dashboard/tasks/task-page/tasks/TaskHeader.svelte';
  import TaskPdfViewer from '$lib/components/dashboard/tasks/task-page/tasks/TaskPdfViewer.svelte';
  import TaskSubmissionForm from '$lib/components/dashboard/tasks/task-page/tasks/TaskSubmissionForm.svelte';
  import FilePreview from '$lib/components/dashboard/tasks/task-page/tasks/FilePreview.svelte';
  import TaskErrorCard from '$lib/components/dashboard/tasks/task-page/tasks/TaskErrorCard.svelte';
  import TaskLoadingSpinner from '$lib/components/dashboard/tasks/task-page/tasks/TaskLoadingSpinner.svelte';

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
    <TaskErrorCard error={taskQuery.error} onRetry={() => taskQuery.refresh()} />
  {:else if taskQuery.loading}
    <TaskLoadingSpinner />
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
