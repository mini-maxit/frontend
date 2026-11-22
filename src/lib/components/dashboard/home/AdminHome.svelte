<script lang="ts">
  import HomeSection from './HomeSection.svelte';
  import { outcomeLabel, outcomeTone, until, type Outcome } from './home.js';
  import { createQuery } from '#lib/utils/query.svelte.js';
  import {
    getContestsManagementInstance,
    getDashboardInstance,
    getUserInstance,
    getWorkerInstance
  } from '#lib/services/index.js';
  import { ContestStatus } from '#lib/dto/contest.js';
  import { UserRole } from '#lib/dto/jwt.js';
  import { formatRelativeDate } from '#lib/utils/contest.js';
  import { formatUserName } from '#lib/utils/user.js';
  import { getLocale, localizeHref } from '#lib/paraglide/runtime.js';
  import { AppRoutes } from '#lib/routes.js';
  import * as m from '#lib/paraglide/messages.js';
  import * as Tooltip from '#lib/components/ui/tooltip/index.js';
  import Info from '@lucide/svelte/icons/info';

  const dashboard = getDashboardInstance();
  const users = getUserInstance();
  const contestsService = getContestsManagementInstance();
  const workers = getWorkerInstance();

  const activity = createQuery(async () => {
    if (!dashboard) throw new Error('Service unavailable');
    const stats = await dashboard.getAdminStats();
    const { hourly, outcomes: o, last24h } = stats.submissions;
    return {
      ...stats,
      users: {
        ...stats.users,
        total: stats.users.students + stats.users.teachers + stats.users.admins
      },
      hours: hourly.map((h) => ({ start: Date.parse(h.hour), n: h.count })),
      mix: { passed: o.passed, failed: o.failed, compile: o.compilationError, pending: o.pending },
      day: last24h
    };
  });

  const people = createQuery(async () => {
    if (!users) throw new Error('Service unavailable');
    const r = await users.getUsers({ limit: 5, sort: 'createdAt:desc' });
    if (!r.success || !r.data) throw new Error(r.error);
    return { newest: r.data.items };
  });

  const catalog = createQuery(async () => {
    if (!contestsService) throw new Error('Service unavailable');
    // The live list is shown in full; 100 covers any realistic number of simultaneous contests.
    const contests = await contestsService.getManagedContests({ all: true, limit: 100, offset: 0 });
    return { live: contests.items.filter((c) => c.status === ContestStatus.Ongoing) };
  });

  const pipeline = createQuery(async () => {
    if (!workers) throw new Error('Service unavailable');
    // Loaded independently: no worker answering (a timeout) is itself what this section reports.
    const [w, q] = await Promise.allSettled([workers.getWorkerStatus(), workers.getQueueStatus()]);
    const status = w.status === 'fulfilled' && w.value.success ? (w.value.data ?? null) : null;
    const queue = q.status === 'fulfilled' ? q.value : null;
    if (!status && !queue) throw new Error('Pipeline status unavailable');
    return { status, queue };
  });

  const peak = $derived(Math.max(1, ...(activity.current?.hours.map((h) => h.n) ?? [1])));
  const hourFmt = new Intl.DateTimeFormat(getLocale(), { hour: '2-digit', minute: '2-digit' });
  const outcomes: Outcome[] = ['passed', 'failed', 'compile', 'pending'];
  const roleLabel: Record<UserRole, () => string> = {
    [UserRole.Student]: m.profile_user_role_student,
    [UserRole.Teacher]: m.profile_user_role_teacher,
    [UserRole.Admin]: m.profile_user_role_admin
  };
</script>

{#snippet figure(label: string, value: number | undefined, note: string, href?: string)}
  <div
    class="relative min-w-0 bg-card px-4 py-4 transition-colors sm:px-5 {href
      ? 'hover:bg-foreground/[0.03]'
      : ''}"
  >
    <dt class="text-sm text-muted-foreground">
      {#if href}
        <a {href} class="after:absolute after:inset-0 hover:text-primary">{label} →</a>
      {:else}
        {label}
      {/if}
    </dt>
    <dd class="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
      {value ?? '–'}
    </dd>
    <dd class="mt-1 text-xs text-pretty text-muted-foreground">{note}</dd>
  </div>
{/snippet}

<p class="text-muted-foreground">{m.home_admin_summary()}</p>

<dl
  class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-foreground/10 bg-foreground/10 lg:grid-cols-4"
>
  {@render figure(
    m.home_admin_users(),
    activity.current?.users.total,
    activity.current ? m.home_admin_users_note(activity.current.users) : '',
    localizeHref(AppRoutes.AdminUsers)
  )}
  {@render figure(
    m.home_admin_contests(),
    activity.current?.contests.total,
    activity.current ? m.home_admin_live_now({ count: activity.current.contests.ongoing }) : '',
    localizeHref(AppRoutes.TeacherContests)
  )}
  {@render figure(
    m.home_admin_tasks(),
    activity.current?.tasks,
    m.home_admin_tasks_note(),
    localizeHref(AppRoutes.TeacherTasks)
  )}
  {@render figure(
    m.home_admin_submissions(),
    activity.current?.submissions.total,
    activity.current ? m.home_admin_today({ count: activity.current.day }) : ''
  )}
</dl>

<div class="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
  <div class="space-y-10">
    <HomeSection title={m.home_admin_activity_title()} query={activity}>
      {#if activity.current}
        {@const a = activity.current}
        <figure class="p-4 sm:p-5">
          <div
            class="flex h-40 items-end gap-[3px]"
            role="img"
            aria-label={m.home_admin_activity_aria({ count: a.day })}
          >
            {#each a.hours as h (h.start)}
              <div
                class="group relative flex h-full flex-1 items-end"
                title="{hourFmt.format(h.start)} · {h.n}"
              >
                <div
                  class="w-full rounded-t-sm bg-primary/80 transition-colors group-hover:bg-primary {h.n
                    ? ''
                    : 'bg-foreground/10!'}"
                  style="height: {h.n ? Math.max(4, (h.n / peak) * 100) : 2}%"
                ></div>
              </div>
            {/each}
          </div>
          <div class="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
            {#each [0, 6, 12, 18] as i (i)}
              <span>{hourFmt.format(a.hours[i].start)}</span>
            {/each}
            <span>{m.home_admin_now()}</span>
          </div>
          {#if a.day}
            <figcaption class="mt-4 text-xs text-muted-foreground">
              {m.home_admin_activity_hint({ peak })}
            </figcaption>
          {/if}
        </figure>

        <div class="border-t border-foreground/10 p-4 sm:p-5">
          <p class="text-sm font-medium">{m.home_admin_outcomes_title()}</p>
          {#if a.day}
            <div class="mt-3 flex h-2.5 overflow-hidden rounded-full bg-foreground/10">
              {#each outcomes as o (o)}
                {#if a.mix[o]}
                  <div class={outcomeTone[o]} style="width: {(a.mix[o] / a.day) * 100}%"></div>
                {/if}
              {/each}
            </div>
            <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
              {#each outcomes as o (o)}
                <li class="flex items-center gap-1.5">
                  <span class="size-2 rounded-full {outcomeTone[o]}" aria-hidden="true"></span>
                  {outcomeLabel[o]()}
                  <span class="text-muted-foreground tabular-nums">
                    {a.mix[o]} · {Math.round((a.mix[o] / a.day) * 100)}%
                  </span>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="mt-2 text-sm text-muted-foreground">{m.home_admin_no_activity()}</p>
          {/if}
        </div>
      {/if}
    </HomeSection>

    <HomeSection
      title={m.home_admin_live_title()}
      count={catalog.current?.live.length}
      href={AppRoutes.TeacherContests}
      query={catalog}
    >
      {#if catalog.current?.live.length}
        <ul class="divide-y divide-foreground/10">
          {#each catalog.current.live as c (c.id)}
            {@const base = `${AppRoutes.TeacherContests}/${c.id}`}
            <li class="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <span class="min-w-0">
                <a
                  href={localizeHref(`${base}/tasks`)}
                  class="block truncate font-medium underline-offset-4 hover:text-primary hover:underline"
                  >{c.name}</a
                >
                <span class="block truncate text-xs text-muted-foreground">
                  {#if c.creator}
                    <a
                      href={localizeHref(`${AppRoutes.AdminUsers}/${c.creator.id}`)}
                      class="hover:text-primary hover:underline">{formatUserName(c.creator)}</a
                    > ·
                  {/if}
                  <a
                    href={localizeHref(`${base}/participants`)}
                    class="hover:text-primary hover:underline"
                    >{m.home_teacher_participants({ count: c.participantCount })}</a
                  >
                  · {until(c.endAt, Date.now())
                    ? m.home_ends_in({ time: until(c.endAt, Date.now())! })
                    : m.home_no_end()}
                </span>
              </span>
              <a
                href={localizeHref(`${base}/submissions`)}
                class="shrink-0 rounded-md border border-foreground/15 px-3 py-1.5 hover:border-primary hover:text-primary"
                >{m.home_teacher_submissions()}</a
              >
            </li>
          {/each}
        </ul>
      {:else}
        <p class="p-4 text-sm text-muted-foreground">{m.home_admin_no_live()}</p>
      {/if}
    </HomeSection>
  </div>

  <div class="space-y-10">
    <HomeSection
      title={m.home_admin_pipeline_title()}
      href={AppRoutes.AdminWorkerMonitoring}
      linkLabel={m.home_admin_monitoring()}
      query={pipeline}
    >
      {#if pipeline.current}
        {@const p = pipeline.current}
        <div class="space-y-4 p-4">
          <div>
            <p class="flex items-baseline justify-between text-sm">
              <span>{m.home_admin_workers()}</span>
              {#if p.status}
                <span class="text-muted-foreground tabular-nums">
                  {m.home_admin_workers_busy({
                    busy: p.status.busyWorkers,
                    total: p.status.totalWorkers
                  })}
                </span>
              {:else}
                <span class="font-medium text-destructive">{m.home_admin_workers_silent()}</span>
              {/if}
            </p>
            <div class="mt-2 flex gap-1">
              {#each p.status?.workerStatus ?? [] as w (w.id)}
                <span
                  class="h-2 flex-1 rounded-sm {w.status === 'busy'
                    ? 'bg-primary'
                    : 'bg-foreground/15'}"
                  title={m.admin_dashboard_worker_id({ id: w.id })}
                ></span>
              {/each}
            </div>
          </div>
          {#if !p.status}
            <p class="-mt-2 text-xs text-muted-foreground">{m.home_admin_workers_silent_hint()}</p>
          {/if}
          {#if p.queue}
            <p class="flex items-center justify-between border-t border-foreground/10 pt-4 text-sm">
              <span class="flex items-center gap-2">
                <span
                  class="size-2 rounded-full {p.queue.connected ? 'bg-chart-2' : 'bg-destructive'}"
                  aria-hidden="true"
                ></span>
                {p.queue.connected
                  ? m.home_admin_queue_connected()
                  : m.home_admin_queue_disconnected()}
              </span>
              <Tooltip.Provider delayDuration={150}>
                <Tooltip.Root>
                  <Tooltip.Trigger
                    class="inline-flex cursor-help items-center gap-1.5 tabular-nums {p.queue
                      .pendingSubmissions
                      ? 'font-semibold'
                      : 'text-muted-foreground'}"
                  >
                    {m.home_admin_queue_pending({ count: p.queue.pendingSubmissions })}
                    <Info class="size-3.5 text-muted-foreground" aria-hidden="true" />
                  </Tooltip.Trigger>
                  <Tooltip.Content side="top" class="max-w-64 text-pretty">
                    {m.home_admin_queue_pending_hint()}
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </p>
          {:else}
            <p class="border-t border-foreground/10 pt-4 text-sm text-muted-foreground">
              {m.home_admin_queue_unknown()}
            </p>
          {/if}
        </div>
      {/if}
    </HomeSection>

    <HomeSection title={m.home_admin_signups_title()} href={AppRoutes.AdminUsers} query={people}>
      {#if people.current?.newest.length}
        <ul class="divide-y divide-foreground/10">
          {#each people.current.newest as u (u.id)}
            <li>
              <a
                href={localizeHref(`${AppRoutes.AdminUsers}/${u.id}`)}
                class="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-foreground/5"
              >
                <span class="min-w-0">
                  <span class="block truncate font-medium">{u.name} {u.surname}</span>
                  <span class="block truncate text-xs text-muted-foreground"
                    >{roleLabel[u.role]()}</span
                  >
                </span>
                <span class="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeDate(u.createdAt)}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </HomeSection>
  </div>
</div>
