<script lang="ts">
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Target from '@lucide/svelte/icons/target';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import { getContestTasks } from './contest.remote';
  import { AppRoutes } from '$lib/routes';

  interface Props {
    data: {
      contestId: number;
    };
  }

  let { data }: Props = $props();

  const tasksQuery = getContestTasks(data.contestId);
</script>

<div class="space-y-6 p-4 sm:p-6 lg:p-8">
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      {m.user_contest_tasks_title()}
    </h1>
    <p class="text-lg text-muted-foreground">
      {m.user_contest_tasks_description()}
    </p>
  </div>

  {#if tasksQuery.error}
    <ErrorCard
      title={m.user_contest_tasks_load_error()}
      error={tasksQuery.error}
      onRetry={() => tasksQuery.refresh()}
    />
  {:else if tasksQuery.loading}
    <LoadingSpinner message={m.user_contest_tasks_loading()} />
  {:else if tasksQuery.current}
    {#if tasksQuery.current.length === 0}
      <EmptyState
        title={m.user_contest_tasks_no_tasks_title()}
        description={m.user_contest_tasks_no_tasks_description()}
        icon={ListTodo}
      />
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each tasksQuery.current as task (task.id)}
          <Card.Root class="group transition-colors hover:border-primary/50">
            <Card.Header>
              <Card.Title class="text-xl">
                {task.title}
              </Card.Title>
            </Card.Header>
            <Card.Content class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <!-- Max Score -->
                <div class="rounded-lg border border-border bg-card p-3">
                  <div class="flex items-center gap-2">
                    <Trophy class="h-4 w-4 text-primary" />
                    <span class="text-xs font-medium text-muted-foreground"> Max Score </span>
                  </div>
                  <p class="mt-1 text-lg font-bold text-foreground">
                    {task.maxScore}
                  </p>
                </div>

                <!-- Attempts -->
                <div class="rounded-lg border border-border bg-card p-3">
                  <div class="flex items-center gap-2">
                    <Target class="h-4 w-4 text-primary" />
                    <span class="text-xs font-medium text-muted-foreground"> Total Attempts </span>
                  </div>
                  <p class="mt-1 text-lg font-bold text-foreground">
                    {task.attemptCount}
                  </p>
                </div>
              </div>

              <div class="pt-2">
                <Button
                  href={`${AppRoutes.AdminTasks}/${task.id}`}
                  class="w-full"
                  variant="default"
                >
                  {m.user_contest_tasks_view_task()}
                  <ChevronRight class="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    {/if}
  {/if}
</div>
