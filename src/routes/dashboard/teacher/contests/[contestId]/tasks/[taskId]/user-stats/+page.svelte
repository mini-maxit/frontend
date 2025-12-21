<script lang="ts">
  import { getTaskUserStats } from './user-stats.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as Table from '$lib/components/ui/table';
  import * as Card from '$lib/components/ui/card';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Medal from '@lucide/svelte/icons/medal';
  import Target from '@lucide/svelte/icons/target';
  import Users from '@lucide/svelte/icons/users';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    data: {
      contestId: number;
      taskId: number;
    };
  }

  let { data }: Props = $props();

  const statsQuery = getTaskUserStats({
    contestId: data.contestId,
    taskId: data.taskId
  });

  // Sort users by best score (descending)
  let sortedStats = $derived.by(() => {
    if (!statsQuery.current) return [];
    return [...statsQuery.current].sort((a, b) => b.bestScore - a.bestScore);
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

  let paginatedStats = $derived.by(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedStats.slice(start, end);
  });

  let totalPages = $derived(Math.ceil(sortedStats.length / pageSize));

  // Statistics calculations
  let averageScore = $derived.by(() => {
    if (sortedStats.length === 0) return 0;
    const sum = sortedStats.reduce((acc, stat) => acc + stat.bestScore, 0);
    return sum / sortedStats.length;
  });

  let totalSubmissions = $derived.by(() => {
    return sortedStats.reduce((acc, stat) => acc + stat.submissionCount, 0);
  });

  let perfectScores = $derived.by(() => {
    return sortedStats.filter((stat) => stat.bestScore === 100).length;
  });
</script>

<div class="space-y-6 p-4 sm:p-6 lg:p-8">
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      {m.task_user_stats_title()}
    </h1>
    <p class="text-lg text-muted-foreground">
      {m.task_user_stats_subtitle({ contestId: data.contestId, taskId: data.taskId })}
    </p>
  </div>

  {#if statsQuery.error}
    <ErrorCard
      title={m.task_user_stats_load_error()}
      error={statsQuery.error}
      onRetry={() => statsQuery.refresh()}
    />
  {:else if statsQuery.loading}
    <LoadingSpinner message={m.task_user_stats_loading()} />
  {:else if statsQuery.current}
    <!-- Summary Statistics Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users class="h-4 w-4" />
            {m.task_user_stats_total_users()}
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
            {m.task_user_stats_average_score()}
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
            {m.task_user_stats_perfect_scores()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">{perfectScores}</p>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header class="pb-3">
          <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Target class="h-4 w-4" />
            {m.task_user_stats_total_submissions()}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-2xl font-bold text-foreground">{totalSubmissions}</p>
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
              {m.task_user_stats_all_users()}
            </Card.Title>
            <p class="text-sm text-muted-foreground">
              {m.task_user_stats_participants({ count: sortedStats.length })}
            </p>
          </div>
        </Card.Header>
        <Card.Content>
          <div class="overflow-x-auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head class="w-16">{m.task_user_stats_rank()}</Table.Head>
                  <Table.Head>{m.task_user_stats_name()}</Table.Head>
                  <Table.Head class="hidden md:table-cell"
                    >{m.task_user_stats_username()}</Table.Head
                  >
                  <Table.Head class="text-right">{m.task_user_stats_best_score()}</Table.Head>
                  <Table.Head class="text-right">{m.task_user_stats_submissions()}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each paginatedStats as userStat, index (userStat.user.id)}
                  {@const rank = (currentPage - 1) * pageSize + index + 1}
                  {@const RankIcon = getRankIcon(rank)}
                  <Table.Row>
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
                      <span
                        class="text-lg font-bold"
                        class:text-primary={userStat.bestScore === 100}
                      >
                        {userStat.bestScore.toFixed(1)}%
                      </span>
                    </Table.Cell>
                    <Table.Cell class="text-right">
                      <span class="font-semibold">{userStat.submissionCount}</span>
                    </Table.Cell>
                  </Table.Row>
                {/each}
              </Table.Body>
            </Table.Root>
          </div>

          <!-- Pagination Controls -->
          {#if totalPages > 1}
            <div class="mt-4 flex items-center justify-between">
              <p class="text-sm text-muted-foreground">
                {m.task_user_stats_showing({
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
                  {m.task_user_stats_previous()}
                </button>
                <span class="flex items-center px-3 text-sm">
                  {m.task_user_stats_page_info({ current: currentPage, total: totalPages })}
                </span>
                <button
                  class="rounded border border-border px-3 py-1 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onclick={() => currentPage++}
                >
                  {m.task_user_stats_next()}
                </button>
              </div>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    {:else}
      <EmptyState
        title={m.task_user_stats_no_data_title()}
        description={m.task_user_stats_no_data_description()}
        icon={Trophy}
      />
    {/if}
  {/if}
</div>
