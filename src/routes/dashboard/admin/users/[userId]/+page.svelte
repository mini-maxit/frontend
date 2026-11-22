<script lang="ts">
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import type { Submission } from '#lib/dto/submission.js';
  import { getSubmissionInstance } from '#lib/services/index.js';
  import {
    SubmissionsList,
    SubmissionGroupPanel
  } from '#lib/components/dashboard/submissions/index.js';
  import { LoadingSpinner, ErrorCard, EmptyState } from '#lib/components/common/index.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import * as Select from '#lib/components/ui/select/index.js';
  import { formatUserName } from '#lib/utils/user.js';
  import { localizeHref } from '#lib/paraglide/runtime.js';
  import { page } from '$app/state';
  import FileQuestion from '@lucide/svelte/icons/file-question';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import * as m from '#lib/paraglide/messages.js';

  const LIMIT = 20;
  const submissionService = getSubmissionInstance();
  const userId = $derived(Number(page.params.userId));
  let offset = $state(0);
  let taskFilter = $state('all');
  // Grouping happens on the backend (GET /submissions?groupBy=...). Adding a mode: a label here,
  // the value in SubmissionGroupBy, and its key→filter mapping in SubmissionGroupPanel.
  const groupOptions = {
    none: () => m.admin_user_activity_group_none(),
    task: () => m.admin_user_activity_group_task()
  };
  type GroupBy = keyof typeof groupOptions;
  let groupBy = $state<GroupBy>('none');

  // Filter options: only tasks this user has submitted to.
  // shortcut: first 500 tasks only; switch the filter to a searchable combobox if users exceed that.
  const tasksQuery = createParameterizedQuery(
    () => userId,
    async (id) => {
      if (!submissionService) throw new Error('Service unavailable');
      const result = await submissionService.getUserSubmissionGroups(id, {
        groupBy: 'task',
        limit: 500,
        offset: 0
      });
      if (!result.success) throw new Error(result.error || 'Failed to fetch tasks');
      return result.data!.items;
    }
  );

  // One query for both modes: a page of submissions, or a page of groups.
  const activityQuery = createParameterizedQuery(
    () => ({
      userId,
      offset,
      groupBy,
      taskId: taskFilter === 'all' ? undefined : Number(taskFilter)
    }),
    async ({ userId, offset, groupBy, taskId }) => {
      if (!submissionService) throw new Error('Service unavailable');
      const page = { limit: LIMIT, offset, taskId };
      // Tag each result with the mode it was fetched for: the dropdown changes before the new
      // page arrives, and rendering old rows in the new mode crashes the page.
      if (groupBy === 'none') {
        const result = await submissionService.getUserSubmissions(userId, page);
        if (!result.success) throw new Error(result.error || 'Failed to fetch submissions');
        return { mode: 'none' as const, page: result.data! };
      }
      const result = await submissionService.getUserSubmissionGroups(userId, { ...page, groupBy });
      if (!result.success) throw new Error(result.error || 'Failed to fetch submissions');
      return { mode: groupBy, page: result.data! };
    }
  );

  const loaded = $derived(activityQuery.current);
  const rows = $derived(loaded?.page.items ?? []);
  const submissions = $derived(loaded?.mode === 'none' ? loaded.page.items : []);
  const groups = $derived(loaded && loaded.mode !== 'none' ? loaded.page.items : []);
  const total = $derived(loaded?.page.pagination.totalItems ?? 0);
  // Grouped rows carry no user, so keep the last one seen from a submissions page.
  let user = $state<Submission['user'] | undefined>();
  $effect(() => {
    if (submissions[0]) user = submissions[0].user;
  });
  const taskOptions = $derived(tasksQuery.current ?? []);
  const taskFilterLabel = $derived(
    taskFilter === 'all'
      ? m.admin_user_activity_all_tasks()
      : (taskOptions.find((t) => t.key === taskFilter)?.label ?? `#${taskFilter}`)
  );
</script>

<div class="space-y-6">
  <div class="space-y-2">
    <Button variant="ghost" size="sm" href={localizeHref('/dashboard/admin/users')}>
      <ArrowLeft class="h-4 w-4" />
      {m.admin_users_title()}
    </Button>
    <h1 class="text-3xl font-bold text-foreground">
      {m.admin_user_activity_title()}: {user ? formatUserName(user) : `#${userId}`}
    </h1>
  </div>

  <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
    <Select.Root
      type="single"
      value={taskFilter}
      onValueChange={(value) => {
        if (value && value !== taskFilter) {
          taskFilter = value;
          offset = 0;
        }
      }}
    >
      <Select.Trigger class="w-full sm:w-72" aria-label={m.admin_user_activity_filter_task()}>
        <span class="truncate">{taskFilterLabel}</span>
      </Select.Trigger>
      <Select.Content class="max-h-80">
        <Select.Item value="all">{m.admin_user_activity_all_tasks()}</Select.Item>
        {#each taskOptions as task (task.key)}
          <Select.Item value={task.key}>{task.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>

    <Select.Root
      type="single"
      value={groupBy}
      onValueChange={(value) => {
        if (value && value !== groupBy) {
          groupBy = value as GroupBy;
          offset = 0;
        }
      }}
    >
      <Select.Trigger class="w-full sm:w-56" aria-label={m.admin_user_activity_group_by()}>
        {m.admin_user_activity_group_by()}: {groupOptions[groupBy]()}
      </Select.Trigger>
      <Select.Content>
        {#each Object.entries(groupOptions) as [value, label] (value)}
          <Select.Item {value}>{label()}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  {#if activityQuery.error}
    <ErrorCard
      title={m.submissions_load_error()}
      error={activityQuery.error}
      onRetry={() => activityQuery.refresh()}
    />
  {:else if activityQuery.loading}
    <LoadingSpinner />
  {:else if rows.length === 0}
    <EmptyState
      title={m.admin_user_activity_empty()}
      description={m.submissions_empty_description()}
      icon={FileQuestion}
    />
  {:else}
    {#if loaded && loaded.mode !== 'none'}
      <div class="space-y-3">
        {#each groups as group (group.key)}
          <SubmissionGroupPanel {userId} groupBy={loaded.mode} {group} />
        {/each}
      </div>
    {:else}
      <SubmissionsList {submissions} />
    {/if}
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        {m.admin_users_pagination_showing_range({
          from: offset + 1,
          to: offset + rows.length,
          total
        })}
      </span>
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={offset === 0}
          onclick={() => (offset = Math.max(0, offset - LIMIT))}
        >
          {m.admin_users_pagination_prev()}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={offset + LIMIT >= total}
          onclick={() => (offset += LIMIT)}
        >
          {m.admin_users_pagination_next()}
        </Button>
      </div>
    </div>
  {/if}
</div>
