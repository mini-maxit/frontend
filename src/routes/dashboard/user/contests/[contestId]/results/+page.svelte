<script lang="ts">
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import * as Table from '$lib/components/ui/table';
  import * as Card from '$lib/components/ui/card';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Medal from '@lucide/svelte/icons/medal';
  import Target from '@lucide/svelte/icons/target';
  import Users from '@lucide/svelte/icons/users';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import { getContestResults } from './results.remote';
  import { formatDistanceToNow, format } from 'date-fns';

  interface Props {
    data: {
      contestId: number;
      currentUserId: number;
    };
  }

  let { data }: Props = $props();

  const resultsQuery = getContestResults(data.contestId);

  // Sort leaderboard by total score (sum of best scores across all tasks)
  let sortedLeaderboard = $derived.by(() => {
    if (!resultsQuery.current?.leaderboard) return [];

    return [...resultsQuery.current.leaderboard]
      .map((userStats) => {
        const totalScore = userStats.taskBreakdown.reduce(
          (sum, task) => sum + task.bestScore,
          0
        );
        return { ...userStats, totalScore };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  });

  // Find current user's position
  let currentUserPosition = $derived.by(() => {
    const position = sortedLeaderboard.findIndex((user) => user.user.id === data.currentUserId);
    return position >= 0 ? position + 1 : null;
  });

  function getRankBadgeClass(rank: number): string {
    if (rank === 1) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (rank === 2) return 'bg-slate-400/10 text-slate-600 border-slate-400/20';
    if (rank === 3) return 'bg-amber-700/10 text-amber-700 border-amber-700/20';
    return 'bg-muted text-muted-foreground border-border';
  }

  function getRankIcon(rank: number) {
    if (rank <= 3) return Medal;
    return null;
  }

  function formatContestDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  }

  // Pagination state
  let currentPage = $state(1);
  let pageSize = $state(10);

  let paginatedLeaderboard = $derived.by(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedLeaderboard.slice(start, end);
  });

  let totalPages = $derived(Math.ceil(sortedLeaderboard.length / pageSize));
</script>

<div class="space-y-6 p-4 sm:p-6 lg:p-8">
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      Contest Results
    </h1>
    {#if resultsQuery.current?.contest}
      <div class="flex flex-col gap-2 text-lg text-muted-foreground">
        <p class="font-medium">{resultsQuery.current.contest.name}</p>
        <p class="text-sm">
          {formatContestDate(resultsQuery.current.contest.startAt)} - {formatContestDate(resultsQuery.current.contest.endAt)}
        </p>
      </div>
    {/if}
  </div>

  {#if resultsQuery.error}
    <ErrorCard
      title="Failed to load results"
      error={resultsQuery.error}
      onRetry={() => resultsQuery.refresh()}
    />
  {:else if resultsQuery.loading}
    <LoadingSpinner message="Loading contest results..." />
  {:else if resultsQuery.current}
    <!-- My Results Summary Cards -->
    {#if resultsQuery.current.myResults}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card.Root>
          <Card.Header class="pb-3">
            <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Trophy class="h-4 w-4" />
              My Total Score
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <p class="text-2xl font-bold text-foreground">
              {resultsQuery.current.myResults.taskResults.reduce((sum, task) => sum + task.bestScore, 0).toFixed(1)}
            </p>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header class="pb-3">
            <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle class="h-4 w-4" />
              Tasks Completed
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <p class="text-2xl font-bold text-foreground">
              {resultsQuery.current.myResults.taskResults.filter(t => t.bestScore === 100).length} / {resultsQuery.current.myResults.taskResults.length}
            </p>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header class="pb-3">
            <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Target class="h-4 w-4" />
              Total Submissions
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <p class="text-2xl font-bold text-foreground">
              {resultsQuery.current.myResults.taskResults.reduce((sum, task) => sum + task.submissionCount, 0)}
            </p>
          </Card.Content>
        </Card.Root>

        {#if currentUserPosition}
          <Card.Root>
            <Card.Header class="pb-3">
              <Card.Title class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Medal class="h-4 w-4" />
                My Rank
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p class="text-2xl font-bold text-foreground">
                #{currentUserPosition}
              </p>
            </Card.Content>
          </Card.Root>
        {/if}
      </div>

      <!-- My Task Results -->
      <Card.Root>
        <Card.Header>
          <Card.Title>My Task Results</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="overflow-x-auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Task</Table.Head>
                  <Table.Head class="hidden sm:table-cell">Best Score</Table.Head>
                  <Table.Head class="hidden md:table-cell">Submissions</Table.Head>
                  <Table.Head class="sm:hidden">Score / Submissions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each resultsQuery.current.myResults.taskResults as taskResult}
                  <Table.Row>
                    <Table.Cell class="font-medium">{taskResult.task.title}</Table.Cell>
                    <Table.Cell class="hidden sm:table-cell">
                      <span class="font-semibold" class:text-green-600={taskResult.bestScore === 100}>
                        {taskResult.bestScore.toFixed(1)}%
                      </span>
                    </Table.Cell>
                    <Table.Cell class="hidden md:table-cell">{taskResult.submissionCount}</Table.Cell>
                    <Table.Cell class="sm:hidden">
                      <span class="font-semibold" class:text-green-600={taskResult.bestScore === 100}>
                        {taskResult.bestScore.toFixed(1)}%
                      </span>
                      <span class="text-muted-foreground"> / {taskResult.submissionCount}</span>
                    </Table.Cell>
                  </Table.Row>
                {/each}
              </Table.Body>
            </Table.Root>
          </div>
        </Card.Content>
      </Card.Root>
    {/if}

    <!-- Leaderboard -->
    {#if sortedLeaderboard.length > 0}
      <Card.Root>
        <Card.Header>
          <div class="flex items-center justify-between">
            <Card.Title class="flex items-center gap-2">
              <Users class="h-5 w-5" />
              Leaderboard
            </Card.Title>
            <p class="text-sm text-muted-foreground">
              {sortedLeaderboard.length} {sortedLeaderboard.length === 1 ? 'participant' : 'participants'}
            </p>
          </div>
        </Card.Header>
        <Card.Content>
          <div class="overflow-x-auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head class="w-16">Rank</Table.Head>
                  <Table.Head>Name</Table.Head>
                  <Table.Head class="hidden md:table-cell">Username</Table.Head>
                  <Table.Head class="text-right">Total Score</Table.Head>
                  <Table.Head class="hidden lg:table-cell text-right">Solved</Table.Head>
                  <Table.Head class="hidden xl:table-cell text-right">Partially Solved</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each paginatedLeaderboard as userStats, index}
                  {@const rank = (currentPage - 1) * pageSize + index + 1}
                  {@const RankIcon = getRankIcon(rank)}
                  <Table.Row>
                    <Table.Cell>
                      <div class="flex items-center gap-2">
                        {#if RankIcon}
                          <div class={`flex h-8 w-8 items-center justify-center rounded-full border ${getRankBadgeClass(rank)}`}>
                            <RankIcon class="h-4 w-4" />
                          </div>
                        {:else}
                          <span class="font-semibold">{rank}</span>
                        {/if}
                      </div>
                    </Table.Cell>
                    <Table.Cell class="font-medium">
                      {userStats.user.name} {userStats.user.surname}
                    </Table.Cell>
                    <Table.Cell class="hidden md:table-cell text-muted-foreground">
                      @{userStats.user.username}
                    </Table.Cell>
                    <Table.Cell class="text-right">
                      <span class="font-bold text-lg">{userStats.totalScore.toFixed(1)}</span>
                    </Table.Cell>
                    <Table.Cell class="hidden lg:table-cell text-right">
                      <span class="text-green-600 font-semibold">{userStats.tasksSolved}</span>
                    </Table.Cell>
                    <Table.Cell class="hidden xl:table-cell text-right">
                      <span class="text-yellow-600 font-semibold">{userStats.tasksPartiallySolved}</span>
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
                Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedLeaderboard.length)} of {sortedLeaderboard.length}
              </p>
              <div class="flex gap-2">
                <button
                  class="rounded border border-border px-3 py-1 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                  disabled={currentPage === 1}
                  onclick={() => currentPage--}
                >
                  Previous
                </button>
                <span class="flex items-center px-3 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  class="rounded border border-border px-3 py-1 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onclick={() => currentPage++}
                >
                  Next
                </button>
              </div>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    {:else}
      <EmptyState
        title="No results available"
        description="No participants have submitted solutions yet."
        icon={Trophy}
      />
    {/if}
  {/if}
</div>
