<script lang="ts">
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as Table from '$lib/components/ui/table';
  import * as Card from '$lib/components/ui/card';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Target from '@lucide/svelte/icons/target';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import { getContestResults } from './results.remote';
  import { format } from 'date-fns';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    data: {
      contestId: number;
      contest: import('$lib/dto/contest').ContestDetailed;
    };
  }

  let { data }: Props = $props();

  const resultsQuery = getContestResults({
    contestId: data.contestId,
    contest: data.contest
  });

  function formatContestDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  }
</script>

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
  {:else if resultsQuery.current?.myResults}
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
          <p class="text-2xl font-bold text-foreground">
            {resultsQuery.current.myResults.taskResults
              .reduce((sum, task) => sum + task.bestScore, 0)
              .toFixed(1)}
          </p>
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
            {resultsQuery.current.myResults.taskResults.filter((t) => t.bestScore === 100).length}
            / {resultsQuery.current.myResults.taskResults.length}
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
          <p class="text-2xl font-bold text-foreground">
            {resultsQuery.current.myResults.taskResults.reduce(
              (sum, task) => sum + task.submissionCount,
              0
            )}
          </p>
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
                <Table.Head class="hidden sm:table-cell"
                  >{m.contest_results_best_score()}</Table.Head
                >
                <Table.Head class="hidden md:table-cell"
                  >{m.contest_results_submissions()}</Table.Head
                >
                <Table.Head class="sm:hidden">{m.contest_results_score_submissions()}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each resultsQuery.current.myResults.taskResults as taskResult (taskResult.task.id)}
                <Table.Row>
                  <Table.Cell class="font-medium">{taskResult.task.title}</Table.Cell>
                  <Table.Cell class="hidden sm:table-cell">
                    <span class="font-semibold" class:text-primary={taskResult.bestScore === 100}>
                      {taskResult.bestScore.toFixed(1)}%
                    </span>
                  </Table.Cell>
                  <Table.Cell class="hidden md:table-cell">{taskResult.submissionCount}</Table.Cell>
                  <Table.Cell class="sm:hidden">
                    <span class="font-semibold" class:text-primary={taskResult.bestScore === 100}>
                      {taskResult.bestScore.toFixed(1)}%
                    </span>
                    <span class="text-muted-foreground"> / {taskResult.submissionCount}</span>
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </div>
      </Card.Content>
    </Card.Root>
  {:else}
    <EmptyState
      title={m.contest_results_no_results_title()}
      description={m.user_contest_results_no_results_description()}
      icon={Trophy}
    />
  {/if}
</div>
