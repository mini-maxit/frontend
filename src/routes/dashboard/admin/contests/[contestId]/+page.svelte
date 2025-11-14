<script lang="ts">
  import { getContestTasks } from './contest.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import ClipboardList from '@lucide/svelte/icons/clipboard-list';
  import User from '@lucide/svelte/icons/user';
  import Calendar from '@lucide/svelte/icons/calendar';
  import Clock from '@lucide/svelte/icons/clock';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import { formatDate } from '$lib/utils';

  interface Props {
    params: { contestId: string };
  }

  let { params }: Props = $props();

  const contestId = Number(params.contestId);

  const tasksQuery = getContestTasks(contestId);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">
      Contest #{contestId} Tasks
    </h1>
  </div>

  <!-- Contest Tasks Section -->
  <div class="space-y-4">
    {#if tasksQuery.error}
      <ErrorCard
        title={m.user_contest_tasks_load_error()}
        error={tasksQuery.error}
        onRetry={() => tasksQuery.refresh()}
      />
    {:else if tasksQuery.loading}
      <LoadingSpinner />
    {:else if tasksQuery.current && tasksQuery.current.length === 0}
      <EmptyState
        title={m.admin_contest_tasks_no_tasks_title()}
        description={m.admin_contest_tasks_no_tasks_description()}
        icon={ClipboardList}
      />
    {:else if tasksQuery.current}
      <div class="space-y-3">
        {#each tasksQuery.current as task (task.id)}
          <div
            class="rounded-2xl border bg-card p-6 text-card-foreground shadow-md transition-all hover:shadow-lg"
          >
            <div class="space-y-4">
              <!-- Task Header -->
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-xl font-bold text-foreground">{task.title}</div>
                  <div class="mt-1 text-sm text-muted-foreground">
                    {m.admin_contest_tasks_task_id()}: {task.id}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  {#if task.isSubmissionOpen}
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400"
                    >
                      <CheckCircle class="h-3.5 w-3.5" />
                      {m.admin_contest_tasks_submission_open_yes()}
                    </span>
                  {:else}
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400"
                    >
                      <XCircle class="h-3.5 w-3.5" />
                      {m.admin_contest_tasks_submission_open_no()}
                    </span>
                  {/if}
                </div>
              </div>

              <!-- Task Details Grid -->
              <div class="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3">
                <div class="flex items-start gap-3">
                  <User class="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      {m.admin_contest_tasks_creator_name()}
                    </div>
                    <div class="text-sm font-semibold text-foreground">
                      {task.creatorName}
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <Clock class="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">Created At</div>
                    <div class="text-sm text-foreground">
                      {formatDate(task.createdAt)}
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <Clock class="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">Updated At</div>
                    <div class="text-sm text-foreground">
                      {formatDate(task.updatedAt)}
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <Calendar class="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      {m.admin_contest_tasks_start_at()}
                    </div>
                    <div class="text-sm font-semibold text-foreground">
                      {formatDate(task.startAt)}
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <Calendar class="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      {m.admin_contest_tasks_end_at()}
                    </div>
                    <div class="text-sm font-semibold text-foreground">
                      {#if task.endAt}
                        {formatDate(task.endAt)}
                      {:else}
                        <span class="text-muted-foreground"
                          >{m.admin_contest_tasks_no_end_date()}</span
                        >
                      {/if}
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <User class="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      Created By (User ID)
                    </div>
                    <div class="text-sm text-foreground">
                      {task.createdBy}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
