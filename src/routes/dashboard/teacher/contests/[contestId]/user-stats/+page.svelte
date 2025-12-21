<script lang="ts">
  import { getContestUserStats } from './user-stats.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as Table from '$lib/components/ui/table';
  import * as Card from '$lib/components/ui/card';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Medal from '@lucide/svelte/icons/medal';
  import Target from '@lucide/svelte/icons/target';
  import Users from '@lucide/svelte/icons/users';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronUp from '@lucide/svelte/icons/chevron-up';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    data: {
      contestId: number;
    };
  }

  let { data }: Props = $props();

  const statsQuery = getContestUserStats({
    contestId: data.contestId
  });

  // Sort users by total score (sum of best scores across all tasks)
  let sortedStats = $derived.by(() => {
    if (!statsQuery.current) return [];
    return [...statsQuery.current]
      .map((userStat) => {
        const totalScore = userStat.taskBreakdown.reduce((sum, task) => sum + task.bestScore, 0);
        return { ...userStat, totalScore };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  });

  function getRankBadgeClass(rank: number): string {
    if (rank === 1) return 'bg-primary/10 text-primary border-primary/20';
    if (rank === 2) return 'bg-secondary/10 text-secondary border-secondary/20';
    if (rank === 3) return 'bg-accent/10 text-accent-foreground border-accent/20';
    return 'bg-muted text-muted-foreground border-border';
  }

  function getRankIcon(rank: number) {
    if (rank <= 3) return Medal;
    return null;
  }

  // Pagination state
  let currentPage = $state(1);
  let pageSize = $state(10);

  // Expanded rows state (tracks which user rows are expanded)
  let expandedRows = $state(new Set<number>());

  function toggleRowExpansion(userId: number) {
    if (expandedRows.has(userId)) {
      expandedRows.delete(userId);
    } else {
      expandedRows.add(userId);
    }
    expandedRows = new Set(expandedRows);
  }

  function getTaskStatusBadge(task: {
    isSolved: boolean;
    bestScore: number;
    attemptCount: number;
  }) {
    if (task.isSolved) {
      return {
        text: m.contest_user_stats_task_solved(),
        class: 'bg-primary/10 text-primary border-primary/20'
      };
    } else if (task.bestScore > 0) {
      return {
        text: m.contest_user_stats_task_partial(),
        class: 'bg-secondary/10 text-secondary border-secondary/20'
      };
    } else if (task.attemptCount > 0) {
      return {
        text: m.contest_user_stats_task_failed(),
        class:
          'bg-muted text-muted-foreground border-borderbg-muted text-muted-foreground border-border'
      };
    } else {
      return {
        text: m.contest_user_stats_task_not_attempted(),
        class: 'bg-muted text-muted-foreground border-border'
      };
    }
  }

  let paginatedStats = $derived.by(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedStats.slice(start, end);
  });

  let totalPages = $derived(Math.ceil(sortedStats.length / pageSize));

  // Statistics calculations
  let averageScore = $derived.by(() => {
    if (sortedStats.length === 0) return 0;
    const sum = sortedStats.reduce((acc, stat) => acc + stat.totalScore, 0);
    return sum / sortedStats.length;
  });

  let totalTasksSolved = $derived.by(() => {
    return sortedStats.reduce((acc, stat) => acc + stat.tasksSolved, 0);
  });

  let totalTasksAttempted = $derived.by(() => {
    return sortedStats.reduce((acc, stat) => acc + stat.tasksAttempted, 0);
  });
</script>

<div class="space-y-6 p-4 sm:p-6 lg:p-8">
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      {m.contest_user_stats_title()}
    </h1>
    <p class="text-lg text-muted-foreground">
      {m.contest_user_stats_subtitle({ contestId: data.contestId })}
    </p>
  </div>

  {#if statsQuery.error}
    <ErrorCard
      title={m.contest_user_stats_load_error()}
      error={statsQuery.error}
      onRetry={() => statsQuery.refresh()}
    />
  {:else if statsQuery.loading}
    <LoadingSpinner message={m.contest_user_stats_loading()} />
  {:else if statsQuery.current}
    <!-- Summary Statistics Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users class="h-4 w-4" />
            {m.contest_user_stats_total_users()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">{sortedStats.length}</p>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Trophy class="h-4 w-4" />
            {m.contest_user_stats_average_score()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">{averageScore.toFixed(1)}%</p>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle class="h-4 w-4" />
            {m.contest_user_stats_total_solved()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">{totalTasksSolved}</p>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Target class="h-4 w-4" />
            {m.contest_user_stats_total_attempted()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">{totalTasksAttempted}</p>
        </Card.Content>
      </Card.Root>
    </div>

    <!-- User Statistics Table -->
    {#if sortedStats.length > 0}
      <Card.Root>
        <Card.Header>
          <div class="flex items-center justify-between">
            <Card.Title class="flex items-center gap-2">
              <Users class="h-5 w-5" />
              {m.contest_user_stats_all_users()}
            </Card.Title>
            <p class="text-sm text-muted-foreground">
              {m.contest_user_stats_participants({ count: sortedStats.length })}
            </p>
          </div>
        </Card.Header>
        <Card.Content>
          <div class="overflow-x-auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head class="w-12"></Table.Head>
                  <Table.Head class="w-16">{m.contest_user_stats_rank()}</Table.Head>
                  <Table.Head>{m.contest_user_stats_name()}</Table.Head>
                  <Table.Head class="hidden md:table-cell"
                    >{m.contest_user_stats_username()}</Table.Head
                  >
                  <Table.Head class="text-right">{m.contest_user_stats_total_score()}</Table.Head>
                  <Table.Head class="text-right">{m.contest_user_stats_solved()}</Table.Head>
                  <Table.Head class="hidden text-right lg:table-cell"
                    >{m.contest_user_stats_partial()}</Table.Head
                  >
                  <Table.Head class="hidden text-right xl:table-cell"
                    >{m.contest_user_stats_attempted()}</Table.Head
                  >
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each paginatedStats as userStat, index (userStat.user.id)}
                  {@const rank = (currentPage - 1) * pageSize + index + 1}
                  {@const RankIcon = getRankIcon(rank)}
                  {@const isExpanded = expandedRows.has(userStat.user.id)}
                  <!-- Main row -->
                  <Table.Row
                    class="cursor-pointer transition-colors hover:bg-muted/50"
                    onclick={() => toggleRowExpansion(userStat.user.id)}
                    title={isExpanded
                      ? m.contest_user_stats_collapse_details()
                      : m.contest_user_stats_expand_details()}
                  >
                    <Table.Cell>
                      <button
                        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
                        onclick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(userStat.user.id);
                        }}
                      >
                        {#if isExpanded}
                          <ChevronUp class="h-4 w-4 text-muted-foreground" />
                        {:else}
                          <ChevronDown class="h-4 w-4 text-muted-foreground" />
                        {/if}
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <div class="flex items-center gap-2">
                        {#if RankIcon}
                          <div
                            class={`flex h-8 w-8 items-center justify-center rounded-full border ${getRankBadgeClass(rank)}`}
                          >
                            <RankIcon class="h-4 w-4" />
                          </div>
                        {:else}
                          <span class="font-semibold">{rank}</span>
                        {/if}
                      </div>
                    </Table.Cell>
                    <Table.Cell class="font-medium">
                      {userStat.user.name}
                      {userStat.user.surname}
                    </Table.Cell>
                    <Table.Cell class="hidden text-muted-foreground md:table-cell">
                      @{userStat.user.username}
                    </Table.Cell>
                    <Table.Cell class="text-right">
                      <span class="text-lg font-bold">{userStat.totalScore.toFixed(1)}%</span>
                    </Table.Cell>
                    <Table.Cell class="text-right">
                      <span class="font-semibold text-primary">{userStat.tasksSolved}</span>
                    </Table.Cell>
                    <Table.Cell class="hidden text-right lg:table-cell">
                      <span class="font-semibold text-secondary"
                        >{userStat.tasksPartiallySolved}</span
                      >
                    </Table.Cell>
                    <Table.Cell class="hidden text-right xl:table-cell">
                      <span class="font-semibold">{userStat.tasksAttempted}</span>
                    </Table.Cell>
                  </Table.Row>
                  <!-- Expanded task breakdown row -->
                  {#if isExpanded}
                    <Table.Row class="bg-card">
                      <Table.Cell colspan={8} class="p-0">
                        <div class="p-4 transition-colors">
                          <h4 class="mb-3 text-sm font-semibold text-foreground">
                            {m.contest_user_stats_task_breakdown()}
                          </h4>
                          <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                              <thead>
                                <tr class="border-b border-border">
                                  <th class="pb-2 text-left font-medium text-muted-foreground">
                                    {m.contest_user_stats_task_title()}
                                  </th>
                                  <th class="pb-2 text-right font-medium text-muted-foreground">
                                    {m.contest_user_stats_task_score()}
                                  </th>
                                  <th class="pb-2 text-right font-medium text-muted-foreground">
                                    {m.contest_user_stats_task_attempts()}
                                  </th>
                                  <th class="pb-2 text-center font-medium text-muted-foreground">
                                    {m.contest_user_stats_task_status()}
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="divide-y divide-border">
                                {#each userStat.taskBreakdown as task (task.taskId)}
                                  {@const statusBadge = getTaskStatusBadge(task)}
                                  <tr class="bg-card">
                                    <td class="py-2 font-medium text-foreground">
                                      {task.taskTitle}
                                    </td>
                                    <td class="py-2 text-right">
                                      <span
                                        class="font-semibold"
                                        class:text-primary={task.isSolved}
                                        class:text-secondary={!task.isSolved && task.bestScore > 0}
                                      >
                                        {task.bestScore.toFixed(1)}%
                                      </span>
                                    </td>
                                    <td class="py-2 text-right text-muted-foreground">
                                      {task.attemptCount}
                                    </td>
                                    <td class="py-2 text-center">
                                      <span
                                        class={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadge.class}`}
                                      >
                                        {statusBadge.text}
                                      </span>
                                    </td>
                                  </tr>
                                {/each}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  {/if}
                {/each}
              </Table.Body>
            </Table.Root>
          </div>

          <!-- Pagination Controls -->
          {#if totalPages > 1}
            <div class="mt-4 flex items-center justify-between">
              <p class="text-sm text-muted-foreground">
                {m.contest_user_stats_showing({
                  start: (currentPage - 1) * pageSize + 1,
                  end: Math.min(currentPage * pageSize, sortedStats.length),
                  total: sortedStats.length
                })}
              </p>
              <div class="flex gap-2">
                <button
                  class="rounded border border-border px-3 py-1 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                  disabled={currentPage === 1}
                  onclick={() => currentPage--}
                >
                  {m.contest_user_stats_previous()}
                </button>
                <span class="flex items-center px-3 text-sm">
                  {m.contest_user_stats_page_info({ current: currentPage, total: totalPages })}
                </span>
                <button
                  class="rounded border border-border px-3 py-1 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onclick={() => currentPage++}
                >
                  {m.contest_user_stats_next()}
                </button>
              </div>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    {:else}
      <EmptyState
        title={m.contest_user_stats_no_data_title()}
        description={m.contest_user_stats_no_data_description()}
        icon={Trophy}
      />
    {/if}
  {/if}
</div>
