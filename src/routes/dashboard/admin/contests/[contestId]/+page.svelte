<script lang="ts">
  import { getContestTasks } from './contest.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import ClipboardList from '@lucide/svelte/icons/clipboard-list';

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
          <div class="rounded-2xl border bg-card p-6 text-card-foreground shadow-md">
            <div class="space-y-3">
              <div>
                <div class="text-xl font-bold text-foreground">{task.title}</div>
                <div class="mt-1 text-sm text-muted-foreground">
                  Task ID: {task.id}
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                <div>
                  <div class="text-sm font-medium text-muted-foreground">Created At</div>
                  <div class="text-sm text-foreground">
                    {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div class="text-sm font-medium text-muted-foreground">Updated At</div>
                  <div class="text-sm text-foreground">
                    {new Date(task.updatedAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div class="text-sm font-medium text-muted-foreground">Created By (User ID)</div>
                  <div class="text-sm text-foreground">
                    {task.createdBy}
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
