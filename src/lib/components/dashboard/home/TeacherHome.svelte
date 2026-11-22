<script lang="ts">
  import { onMount } from 'svelte';
  import Plus from '@lucide/svelte/icons/plus';
  import Upload from '@lucide/svelte/icons/upload';
  import HomeSection from './HomeSection.svelte';
  import { outcomeLabel, outcomeTone, submissionOutcome, until } from './home.js';
  import { createQuery } from '#lib/utils/query.svelte.js';
  import {
    getContestsManagementInstance,
    getDashboardInstance,
    getSubmissionInstance,
    getTasksManagementInstance
  } from '#lib/services/index.js';
  import { ContestStatus, type ManagedContest } from '#lib/dto/contest.js';
  import { formatUserName } from '#lib/utils/user.js';
  import { formatRelativeDate } from '#lib/utils/contest.js';
  import { localizeHref } from '#lib/paraglide/runtime.js';
  import { AppRoutes } from '#lib/routes.js';
  import * as m from '#lib/paraglide/messages.js';

  const WEEK = 7 * 24 * 3600_000;
  const DAY = 24 * 3600_000;

  const contestsService = getContestsManagementInstance();
  const dashboard = getDashboardInstance();
  const submissionService = getSubmissionInstance();
  const tasksService = getTasksManagementInstance();

  let now = $state(Date.now());
  onMount(() => {
    const id = setInterval(() => (now = Date.now()), 60_000);
    return () => clearInterval(id);
  });

  const isNew = (iso: string) => now - new Date(iso).getTime() < DAY;

  type Row = ManagedContest & { fresh: number };

  const contests = createQuery(async () => {
    if (!contestsService || !dashboard) throw new Error('Service unavailable');
    const [managed, activity] = await Promise.all([
      contestsService.getManagedContests({ limit: 100, offset: 0 }),
      dashboard.getContestActivity()
    ]);
    const fresh = new Map(activity.map((a) => [a.contestId, a.newSubmissions]));
    const t = Date.now();
    const rows: Row[] = managed.items.map((c) => ({ ...c, fresh: fresh.get(c.id) ?? 0 }));
    return {
      running: rows.filter((c) => c.status === ContestStatus.Ongoing),
      ended: rows
        .filter((c) => c.status === ContestStatus.Past && c.endAt && t - +new Date(c.endAt) < WEEK)
        .sort((a, b) => b.endAt!.localeCompare(a.endAt!)),
      upcoming: rows.filter((c) => c.status === ContestStatus.Upcoming).length,
      fresh: activity.reduce((n, a) => n + a.newSubmissions, 0)
    };
  });

  const solutions = createQuery(async () => {
    if (!submissionService) throw new Error('Service unavailable');
    return (await submissionService.getRecentSubmissions(10)).items;
  });

  const tasks = createQuery(async () => {
    if (!tasksService) throw new Error('Service unavailable');
    const r = await tasksService.getManagedTasks({
      limit: 5,
      offset: 0,
      sort: 'tasks.updated_at:desc'
    });
    if (!r.success || !r.data) throw new Error(r.error);
    return { recent: r.data.items, total: r.data.pagination.totalItems };
  });
</script>

{#snippet contestRow(c: Row, ended: boolean)}
  {@const base = `${AppRoutes.TeacherContests}/${c.id}`}
  <li class="flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
    <div class="min-w-0 flex-1 basis-56">
      <a
        href={localizeHref(`${base}/tasks`)}
        class="block truncate font-semibold underline-offset-4 hover:text-primary hover:underline"
        >{c.name}</a
      >
      <p class="mt-1 text-sm text-muted-foreground">
        {#if ended}
          {m.home_ended({ when: formatRelativeDate(c.endAt!) })}
        {:else}
          {until(c.endAt, now) ? m.home_ends_in({ time: until(c.endAt, now)! }) : m.home_no_end()}
        {/if}
        · {m.home_teacher_participants({ count: c.participantCount })}
        · {m.home_tasks_count({ count: c.taskCount })}
      </p>
    </div>
    <div class="flex shrink-0 items-center gap-2 text-sm">
      <a
        href={localizeHref(`${base}/submissions`)}
        class="inline-flex items-center gap-2 rounded-md border border-foreground/15 px-3 py-1.5 hover:border-primary hover:text-primary"
      >
        {m.home_teacher_submissions()}
        {#if c.fresh}
          <span
            class="rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums"
            >{m.home_teacher_new_count({ count: c.fresh })}</span
          >
        {/if}
      </a>
      <a
        href={localizeHref(`${base}/user-stats`)}
        class="rounded-md px-3 py-1.5 text-muted-foreground hover:text-primary"
        >{m.home_teacher_results()}</a
      >
    </div>
  </li>
{/snippet}

<div class="flex flex-wrap items-center justify-between gap-4">
  <p class="text-muted-foreground">
    {#if contests.current}
      {m.home_teacher_summary({
        live: contests.current.running.length,
        ended: contests.current.ended.length,
        fresh: contests.current.fresh
      })}
    {:else}
      &nbsp;
    {/if}
  </p>
  <div class="flex gap-2 text-sm">
    <a
      href={localizeHref(AppRoutes.TeacherContests)}
      class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:bg-primary/90"
    >
      <Plus class="size-4" />{m.home_teacher_new_contest()}
    </a>
    <a
      href={localizeHref(AppRoutes.TeacherTasks)}
      class="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 px-3 py-1.5 hover:border-primary hover:text-primary"
    >
      <Upload class="size-4" />{m.home_teacher_upload_task()}
    </a>
  </div>
</div>

<div class="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
  <div class="space-y-10">
    <HomeSection
      title={m.home_teacher_running_title()}
      count={contests.current?.running.length}
      href={AppRoutes.TeacherContests}
      query={contests}
    >
      {#if contests.current?.running.length}
        <ul class="divide-y divide-foreground/10">
          {#each contests.current.running as c (c.id)}{@render contestRow(c, false)}{/each}
        </ul>
      {:else}
        <p class="p-4 text-sm text-muted-foreground">
          {m.home_teacher_no_running()}
          {#if contests.current?.upcoming}
            {m.home_teacher_upcoming_note({ count: contests.current.upcoming })}
          {/if}
        </p>
      {/if}
    </HomeSection>

    <HomeSection
      title={m.home_teacher_ended_title()}
      count={contests.current?.ended.length}
      query={contests}
    >
      {#if contests.current?.ended.length}
        <ul class="divide-y divide-foreground/10">
          {#each contests.current.ended as c (c.id)}{@render contestRow(c, true)}{/each}
        </ul>
      {:else}
        <p class="p-4 text-sm text-muted-foreground">{m.home_teacher_no_ended()}</p>
      {/if}
    </HomeSection>

    <HomeSection
      title={m.home_teacher_tasks_title()}
      count={tasks.current?.total}
      href={AppRoutes.TeacherTasks}
      query={tasks}
    >
      {#if tasks.current?.recent.length}
        <ul class="divide-y divide-foreground/10">
          {#each tasks.current.recent as task (task.id)}
            <li>
              <a
                href={localizeHref(`${AppRoutes.TaskDetails}${task.id}`)}
                class="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-foreground/5"
              >
                <span class="truncate font-medium">{task.title}</span>
                <span class="shrink-0 text-xs text-muted-foreground">
                  {m.home_teacher_updated({ when: formatRelativeDate(task.updatedAt) })}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="p-4 text-sm text-muted-foreground">{m.home_teacher_no_tasks()}</p>
      {/if}
    </HomeSection>
  </div>

  <HomeSection title={m.home_teacher_solutions_title()} query={solutions}>
    {#if solutions.current?.length}
      <ul class="divide-y divide-foreground/10">
        {#each solutions.current as sub (sub.id)}
          {@const o = submissionOutcome(sub)}
          <li>
            <a
              href={localizeHref(`${AppRoutes.UserSubmissions}/${sub.id}`)}
              class="flex gap-3 px-4 py-3 text-sm hover:bg-foreground/5"
            >
              <span class="mt-1.5 size-2 shrink-0 rounded-full {outcomeTone[o]}" aria-hidden="true"
              ></span>
              <span class="min-w-0 flex-1">
                <span class="flex items-baseline justify-between gap-3">
                  <span class="truncate font-medium">{formatUserName(sub.user)}</span>
                  <span class="shrink-0 text-xs text-muted-foreground">
                    {#if isNew(sub.submittedAt)}
                      <span class="mr-1 font-semibold text-primary">{m.home_teacher_new()}</span>
                    {/if}
                    {formatRelativeDate(sub.submittedAt)}
                  </span>
                </span>
                <span class="block truncate text-muted-foreground">
                  {sub.task.title}{sub.contest ? ` · ${sub.contest.name}` : ''}
                </span>
                <span class="block text-xs text-muted-foreground">{outcomeLabel[o]()}</span>
              </span>
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="p-4 text-sm text-muted-foreground">{m.home_teacher_no_solutions()}</p>
    {/if}
  </HomeSection>
</div>
