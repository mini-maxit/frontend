<script lang="ts">
  import UserTaskCard from '$lib/components/dashboard/tasks/UserTaskCard.svelte';
  import { createQuery } from '$lib/utils/query.svelte';
  import { getTaskInstance } from '$lib/services';
  import * as m from '$lib/paraglide/messages';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import { formatDate } from '$lib/utils';

  const taskService = getTaskInstance();
  const tasksQuery = createQuery(async () => {
    if (!taskService) throw new Error('Service unavailable');
    const result = await taskService.getMyTasks();
    if (!result.success) throw new Error(result.error || 'Failed to fetch tasks');
    return result.data!;
  });
</script>

<svelte:boundary onerror={(error) => console.error('User tasks page error:', error)}>
  <div class="space-y-8 p-4 sm:p-6 lg:p-8">
    <!-- Page Header -->
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight text-foreground">
        {m.user_tasks_page_title()}
      </h1>
      <p class="text-lg text-muted-foreground">
        {m.user_tasks_page_description()}
      </p>
    </div>

    <!-- Error State -->
    {#if tasksQuery.error}
      <ErrorCard
        title={m.user_tasks_load_error()}
        error={tasksQuery.error}
        onRetry={() => tasksQuery.refresh()}
      />
    {:else if tasksQuery.loading}
      <!-- Loading State -->
      <LoadingSpinner message={m.user_tasks_loading()} />
    {:else if tasksQuery.current}
      {@const { contests } = tasksQuery.current}

      {#if contests.length === 0}
        <!-- Empty State -->
        <EmptyState
          title={m.user_tasks_no_tasks_title()}
          description={m.user_tasks_no_tasks_description()}
          icon={ListTodo}
        />
      {:else}
        <!-- Tasks by Contest -->
        {#each contests as contest (contest.contestId)}
          <div class="space-y-4">
            <!-- Contest Header -->
            <div class="space-y-2">
              <h2 class="text-2xl font-bold text-foreground">
                {m.user_tasks_contest_section({ contestName: contest.contestName })}
              </h2>
              <p class="text-sm text-muted-foreground">
                {m.user_tasks_contest_period({
                  startDate: formatDate(contest.startAt),
                  endDate: formatDate(contest.endAt)
                })}
              </p>
            </div>

            <!-- Tasks Grid -->
            {#if contest.tasks.length === 0}
              <div
                class="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8"
              >
                <p class="text-muted-foreground">{m.user_contest_tasks_no_tasks_description()}</p>
              </div>
            {:else}
              <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {#each contest.tasks as task (task.id)}
                  <UserTaskCard
                    contestId={contest.contestId}
                    id={task.id}
                    title={task.title}
                    createdAt={task.createdAt}
                    attemptCount={task.attemptsSummary.attemptCount}
                    bestScore={task.attemptsSummary.bestScore}
                  />
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    {/if}
  </div>
</svelte:boundary>
