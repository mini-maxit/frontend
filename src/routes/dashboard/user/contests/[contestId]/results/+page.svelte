<script lang="ts">
  import { page } from '$app/state';
  import { createParameterizedQuery } from '$lib/utils/query.svelte';
  import { getContestInstance } from '$lib/services';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as Table from '$lib/components/ui/table';
  import * as Card from '$lib/components/ui/card';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Target from '@lucide/svelte/icons/target';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import { format } from 'date-fns';
  import * as m from '$lib/paraglide/messages';
  import type { TaskResult } from '$lib/dto/contest';
  import { buildDocumentTitle } from '$lib/title';

  const contestService = getContestInstance();
  const contestId = $derived(Number(page.params.contestId));

  const resultsQuery = createParameterizedQuery(
    () => contestId,
    async (id) => {
      if (!contestService) throw new Error('Service unavailable');
      if (!Number.isFinite(id)) throw new Error('Invalid contest ID');
      const result = await contestService.getContestResults(id);
      if (!result.success) throw new Error(result.error || 'Failed to fetch results');
      return result.data!;
    }
  );

  const taskResults = $derived(resultsQuery.current?.taskResults ?? []);

  const totalScore = $derived(
    taskResults.reduce((sum: number, task: TaskResult) => sum + task.bestScore, 0)
  );

  const tasksCompleted = $derived(
    taskResults.filter((task: TaskResult) => task.bestScore === 100).length
  );

  const totalSubmissions = $derived(
    taskResults.reduce((sum: number, task: TaskResult) => sum + task.submissionCount, 0)
  );

  function formatContestDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  }

  const documentTitle = $derived(
    buildDocumentTitle(resultsQuery.current?.contest?.name, m.title_type_results())
  );
</script>

<svelte:head>
  {#if resultsQuery.current?.contest?.name}
    <title>{documentTitle}</title>
  {/if}
</svelte:head>

<div class="space-y-6 p-4 sm:p-6 lg:p-8">
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">{m.contest_results_title()}</h1>
    {#if resultsQuery.current?.contest}
      <div class="flex flex-col gap-2 text-lg text-muted-foreground">
        <p class="font-medium">{resultsQuery.current.contest.name}</p>
        <p class="text-sm">
          {formatContestDate(resultsQuery.current.contest.startAt)} - {formatContestDate(
            resultsQuery.current.contest.endAt
          )}
        </p>
      </div>
    {/if}
  </div>

  {#if resultsQuery.error}
    <ErrorCard
      title={m.contest_results_load_error()}
      error={resultsQuery.error}
      onRetry={() => resultsQuery.refresh()}
    />
  {:else if resultsQuery.loading}
    <LoadingSpinner message={m.contest_results_loading()} />
  {:else if taskResults.length === 0}
    <EmptyState
      title={m.contest_results_no_results_title()}
      description={m.contest_results_no_results_description()}
      icon={Trophy}
    />
  {:else}
    <!-- My Results Summary Cards -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Trophy class="h-4 w-4" />
            {m.contest_results_my_total_score()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">{totalScore.toFixed(1)}</p>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle class="h-4 w-4" />
            {m.contest_results_tasks_completed()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">
            {tasksCompleted} / {taskResults.length}
          </p>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Target class="h-4 w-4" />
            {m.contest_results_total_submissions()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">{totalSubmissions}</p>
        </Card.Content>
      </Card.Root>
    </div>

    <!-- My Task Results -->
    <Card.Root>
      <Card.Header>
        <Card.Title>{m.contest_results_my_task_results()}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="overflow-x-auto">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>{m.contest_results_task()}</Table.Head>
                <Table.Head class="hidden sm:table-cell">{m.contest_results_best_score()}</Table.Head>
                <Table.Head class="hidden md:table-cell"
                  >{m.contest_results_submissions()}</Table.Head
                >
                <Table.Head class="sm:hidden">{m.contest_results_score_submissions()}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each taskResults as taskResult (taskResult.task.id)}
                <Table.Row>
                  <Table.Cell class="font-medium">{taskResult.task.title}</Table.Cell>
                  <Table.Cell class="hidden sm:table-cell">
                    <span
                      class="font-semibold"
                      class:text-primary={taskResult.bestScore === 100}
                    >
                      {taskResult.bestScore.toFixed(1)}%
                    </span>
                  </Table.Cell>
                  <Table.Cell class="hidden md:table-cell">{taskResult.submissionCount}</Table.Cell>
                  <Table.Cell class="sm:hidden">
                    <span
                      class="font-semibold"
                      class:text-primary={taskResult.bestScore === 100}
                    >
                      {taskResult.bestScore.toFixed(1)}%
                    </span>
                    <span class="text-muted-foreground">
                      / {taskResult.submissionCount}
                    </span>
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </div>
      </Card.Content>
    </Card.Root>
  {/if}
</div>
