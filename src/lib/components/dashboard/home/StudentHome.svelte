<script lang="ts">
  import { onMount } from 'svelte';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Check from '@lucide/svelte/icons/check';
  import HomeSection from './HomeSection.svelte';
  import { outcomeLabel, outcomeTone, submissionOutcome, until } from './home.js';
  import { createQuery } from '#lib/utils/query.svelte.js';
  import { getContestInstance, getSubmissionInstance } from '#lib/services/index.js';
  import { ContestRegistrationStatus, ContestStatus } from '#lib/dto/contest.js';
  import { formatRelativeDate } from '#lib/utils/contest.js';
  import { localizeHref } from '#lib/paraglide/runtime.js';
  import { AppRoutes } from '#lib/routes.js';
  import * as m from '#lib/paraglide/messages.js';

  const contestService = getContestInstance();
  const submissionService = getSubmissionInstance();

  let now = $state(Date.now());
  onMount(() => {
    const id = setInterval(() => (now = Date.now()), 60_000);
    return () => clearInterval(id);
  });

  const live = createQuery(async () => {
    if (!contestService) throw new Error('Service unavailable');
    const contests = await contestService.getMyActiveContests();
    const tasks = await Promise.all(
      contests.map(async (c) => {
        const r = await contestService.getContestTasksWithStatistics(c.id);
        return r.success ? (r.data ?? []) : [];
      })
    );
    return contests
      .map((c, i) => ({ ...c, tasks: tasks[i] }))
      .sort((a, b) => (a.endAt ?? '9').localeCompare(b.endAt ?? '9'));
  });

  const upcoming = createQuery(async () => {
    if (!contestService) throw new Error('Service unavailable');
    const page = await contestService.getPublicContests({
      status: ContestStatus.Upcoming,
      limit: 50
    });
    const mine = page.items.filter(
      (c) =>
        c.registrationStatus === ContestRegistrationStatus.Registered ||
        c.registrationStatus === ContestRegistrationStatus.AwaitingApproval
    );
    const open = page.items.filter(
      (c) => c.registrationStatus === ContestRegistrationStatus.CanRegister
    ).length;
    mine.sort((a, b) => a.startAt.localeCompare(b.startAt));
    return { mine, open };
  });

  const recent = createQuery(async () => {
    if (!submissionService) throw new Error('Service unavailable');
    const r = await submissionService.getMySubmissions({ limit: 6 });
    if (!r.success) throw new Error(r.error);
    return r.data ?? [];
  });

  const unsolved = $derived(
    (live.current ?? []).reduce((n, c) => n + Math.max(0, c.taskCount - c.solvedTaskCount), 0)
  );
</script>

<p class="text-muted-foreground">
  {#if live.current && upcoming.current}
    {m.home_student_summary({
      live: live.current.length,
      upcoming: upcoming.current.mine.length,
      unsolved
    })}
  {:else}
    &nbsp;
  {/if}
</p>

<div class="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
  <div class="space-y-10">
    <HomeSection
      title={m.home_student_live_title()}
      count={live.current?.length}
      href={AppRoutes.UserContests}
      query={live}
    >
      {#if live.current?.length}
        <ul class="divide-y divide-foreground/10">
          {#each live.current as contest (contest.id)}
            {@const left = until(contest.endAt, now)}
            {@const pct = contest.taskCount ? contest.solvedTaskCount / contest.taskCount : 0}
            <li class="p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <a
                    href={localizeHref(`${AppRoutes.UserContests}/${contest.id}`)}
                    class="flex items-center gap-2 font-semibold underline-offset-4 hover:text-primary hover:underline"
                  >
                    <span class="relative flex size-2 shrink-0" aria-hidden="true">
                      <span
                        class="absolute inline-flex size-full animate-ping rounded-full bg-chart-2 opacity-60 motion-reduce:hidden"
                      ></span>
                      <span class="relative inline-flex size-2 rounded-full bg-chart-2"></span>
                    </span>
                    <span class="truncate">{contest.name}</span>
                  </a>
                  <p class="mt-1 text-sm text-muted-foreground">
                    {left ? m.home_ends_in({ time: left }) : m.home_no_end()}
                  </p>
                </div>
                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold tabular-nums">
                    {m.home_student_solved({
                      solved: contest.solvedTaskCount,
                      total: contest.taskCount
                    })}
                  </p>
                  <div class="mt-2 h-1 w-24 overflow-hidden rounded-full bg-foreground/10">
                    <div class="h-full rounded-full bg-primary" style="width: {pct * 100}%"></div>
                  </div>
                </div>
              </div>

              {#if contest.tasks?.length}
                <ul
                  class="mt-3 grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] gap-x-6"
                >
                  {#each [...contest.tasks].sort((a, b) => a.attemptsSummary.bestScore - b.attemptsSummary.bestScore) as task (task.id)}
                    {@const s = task.attemptsSummary}
                    <li>
                      <a
                        href={localizeHref(
                          `${AppRoutes.UserContests}/${contest.id}/tasks/${task.id}`
                        )}
                        class="group -mx-2 flex items-center justify-between gap-3 rounded px-2 py-1.5 text-sm hover:bg-foreground/5"
                      >
                        <span class="flex min-w-0 items-center gap-2">
                          {#if s.bestScore >= 100}
                            <Check class="size-3.5 shrink-0 text-chart-2" aria-hidden="true" />
                          {:else}
                            <span
                              class="size-3.5 shrink-0 rounded-full border border-foreground/25"
                              aria-hidden="true"
                            ></span>
                          {/if}
                          <span class="truncate" class:text-muted-foreground={s.bestScore >= 100}
                            >{task.title}</span
                          >
                        </span>
                        <span class="shrink-0 text-xs text-muted-foreground tabular-nums">
                          {s.attemptCount === 0
                            ? m.home_student_not_attempted()
                            : `${s.bestScore}%`}
                        </span>
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      {:else}
        <div class="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
          <span class="text-muted-foreground">{m.home_student_no_live()}</span>
          <a
            href={localizeHref(AppRoutes.BrowseContests)}
            class="font-medium text-primary underline-offset-4 hover:underline"
            >{m.home_student_browse()}</a
          >
        </div>
      {/if}
    </HomeSection>

    <HomeSection
      title={m.home_student_upcoming_title()}
      count={upcoming.current?.mine.length}
      href={AppRoutes.BrowseContests}
      query={upcoming}
    >
      {#if upcoming.current?.mine.length}
        <ul class="divide-y divide-foreground/10">
          {#each upcoming.current.mine as contest (contest.id)}
            {@const awaiting =
              contest.registrationStatus === ContestRegistrationStatus.AwaitingApproval}
            <li class="flex items-center justify-between gap-4 p-4">
              <div class="min-w-0">
                <p class="truncate font-semibold">{contest.name}</p>
                <p class="mt-1 text-sm text-muted-foreground">
                  {m.home_starts_in({ time: until(contest.startAt, now) ?? '—' })}
                  · {m.home_tasks_count({ count: contest.taskCount })}
                </p>
              </div>
              <span
                class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium {awaiting
                  ? 'bg-chart-4/20 text-foreground'
                  : 'bg-primary/10 text-primary'}"
              >
                {awaiting ? m.home_student_awaiting() : m.home_student_registered()}
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="p-4 text-sm text-muted-foreground">{m.home_student_no_upcoming()}</p>
      {/if}
      {#if upcoming.current?.open}
        <a
          href={localizeHref(AppRoutes.BrowseContests)}
          class="flex items-center justify-between border-t border-foreground/10 px-4 py-3 text-sm text-primary hover:bg-foreground/5"
        >
          {m.home_student_open_registration({ count: upcoming.current.open })}
          <ChevronRight class="size-4" />
        </a>
      {/if}
    </HomeSection>
  </div>

  <HomeSection
    title={m.home_student_recent_title()}
    href={AppRoutes.UserSubmissions}
    query={recent}
  >
    {#if recent.current?.length}
      <ul class="divide-y divide-foreground/10">
        {#each recent.current as sub (sub.id)}
          {@const o = submissionOutcome(sub)}
          <li>
            <a
              href={localizeHref(`${AppRoutes.UserSubmissions}/${sub.id}`)}
              class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-foreground/5"
            >
              <span class="size-2 shrink-0 rounded-full {outcomeTone[o]}" aria-hidden="true"></span>
              <span class="min-w-0 flex-1">
                <span class="block truncate font-medium">{sub.task.title}</span>
                <span class="block text-xs text-muted-foreground">
                  {outcomeLabel[o]()} · {sub.language.language}
                </span>
              </span>
              <span class="shrink-0 text-xs text-muted-foreground">
                {formatRelativeDate(sub.submittedAt)}
              </span>
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="p-4 text-sm text-muted-foreground">{m.home_student_no_submissions()}</p>
    {/if}
  </HomeSection>
</div>
