<script lang="ts">
  import { getContestTask, getLanguages } from './task.remote';
  import { submitContestSolution } from './submit.remote';
  import ContestTaskHeader from '$lib/components/dashboard/tasks/task-page/tasks/ContestTaskHeader.svelte';
  import TaskPdfViewer from '$lib/components/dashboard/tasks/task-page/tasks/TaskPdfViewer.svelte';
  import ContestTaskSubmissionForm from '$lib/components/dashboard/tasks/task-page/tasks/ContestTaskSubmissionForm.svelte';
  import FilePreview from '$lib/components/dashboard/tasks/task-page/tasks/FilePreview.svelte';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    data: {
      contestId: number;
      taskId: number;
    };
  }

  let { data }: Props = $props();

  const taskQuery = getContestTask({ contestId: data.contestId, taskId: data.taskId });
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
    <ContestTaskHeader
      id={taskQuery.current.id}
      title={taskQuery.current.title}
      createdByName={taskQuery.current.createdByName}
      createdAt={taskQuery.current.createdAt}
      attemptCount={taskQuery.current.attemptCount}
      bestScore={taskQuery.current.bestScore}
      maxScore={taskQuery.current.maxScore}
    />

    <div class="grid h-screen gap-6 lg:grid-cols-2">
      <TaskPdfViewer pdfDataUrl={taskQuery.current.pdfDataUrl} />

      <div class="flex flex-col gap-6 overflow-hidden lg:space-y-6">
        <ContestTaskSubmissionForm
          bind:fileContent
          languages={languagesQuery.current || []}
          loading={languagesQuery.loading}
          error={languagesQuery.error}
          submitAction={submitContestSolution}
          contestId={data.contestId}
          taskId={data.taskId}
        />

        <FilePreview content={fileContent} />
      </div>
    </div>
  {/if}
</div>
