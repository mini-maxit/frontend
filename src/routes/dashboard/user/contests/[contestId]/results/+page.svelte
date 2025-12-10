<script lang="ts">
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as Table from '$lib/components/ui/table';
  import * as Card from '$lib/components/ui/card';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Medal from '@lucide/svelte/icons/medal';
  import Target from '@lucide/svelte/icons/target';
  import Users from '@lucide/svelte/icons/users';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import { getContestResults } from './results.remote';
  import { format } from 'date-fns';

  interface Props {
    data: {
      contestId: number;
      currentUserId: number;
      contest: import('$lib/dto/contest').ContestDetailed;
    };
  }

  let { data }: Props = $props();

  const resultsQuery = getContestResults({
    contestId: data.contestId,
    contest: data.contest
  });

  // Sort leaderboard by total score (sum of best scores across all tasks)
  let sortedLeaderboard = $derived.by(() => {
    if (!resultsQuery.current?.leaderboard) return [];

    return [...resultsQuery.current.leaderboard]
      .map((userStats) => {
        const totalScore = userStats.taskBreakdown.reduce((sum, task) => sum + task.bestScore, 0);
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
    if (rank === 1) return 'bg-primary/10 text-primary border-primary/20';
    if (rank === 2) return 'bg-secondary/10 text-secondary border-secondary/20';
    if (rank === 3) return 'bg-accent/10 text-accent-foreground border-accent/20';
    return 'bg-muted text-muted-foreground border-border';
  }

  function getRankIcon(rank: number) {
    // Returns Medal component for top 3 ranks, null for rank 4+
    if (rank <= 3) return Medal;
    return null;
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
    <h1 class="text-4xl font-bold tracking-tight text-foreground">Contest Results</h1>
    {#if resultsQuery.current?.contest}
      <div class="flex flex-col gap-2 text-lg text-muted-foreground">
        <p class="font-medium">{resultsQuery.current.contest.name}</p>
        <p class="text-sm">
          {format(new Date(resultsQuery.current.contest.startAt), 'MMM dd, yyyy')} - {format(
            new Date(resultsQuery.current.contest.endAt),
            'MMM dd, yyyy'
          )}
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
              {resultsQuery.current.myResults.taskResults
                .reduce((sum, task) => sum + task.bestScore, 0)
                .toFixed(1)}
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
              {resultsQuery.current.myResults.taskResults.filter((t) => t.bestScore === 100).length}
              / {resultsQuery.current.myResults.taskResults.length}
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
              {resultsQuery.current.myResults.taskResults.reduce(
                (sum, task) => sum + task.submissionCount,
                0
              )}
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
                {#each resultsQuery.current.myResults.taskResults as taskResult (taskResult.task.id)}
                  <Table.Row>
                    <Table.Cell class="font-medium">{taskResult.task.title}</Table.Cell>
                    <Table.Cell class="hidden sm:table-cell">
                      <span class="font-semibold" class:text-primary={taskResult.bestScore === 100}>
                        {taskResult.bestScore.toFixed(1)}%
                      </span>
                    </Table.Cell>
                    <Table.Cell class="hidden md:table-cell"
                      >{taskResult.submissionCount}</Table.Cell
                    >
                    <Table.Cell class="sm:hidden">
                      <span class="font-semibold" class:text-primary={taskResult.bestScore === 100}>
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

    <!-- Top 3 Podium -->
    {#if sortedLeaderboard.length >= 3}
      <Card.Root class="bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card.Header>
          <Card.Title class="flex items-center gap-2">
            <Trophy class="h-5 w-5 text-primary" />
            Top 3 Champions
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="grid gap-4 md:grid-cols-3">
            <!-- 2nd Place -->
            {#if sortedLeaderboard[1]}
              <div
                class="order-2 flex flex-col items-center rounded-lg border-2 border-secondary/30 bg-card/50 p-4 md:order-1"
              >
                <div
                  class="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary/80 to-secondary shadow-lg"
                >
                  <Medal class="h-8 w-8 text-secondary-foreground" />
                </div>
                <div class="text-center">
                  <p class="text-lg font-semibold">
                    {sortedLeaderboard[1].user.name}
                    {sortedLeaderboard[1].user.surname}
                  </p>
                  <p class="text-sm text-muted-foreground">@{sortedLeaderboard[1].user.username}</p>
                  <p class="mt-2 text-2xl font-bold text-foreground">
                    {sortedLeaderboard[1].totalScore.toFixed(1)}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {sortedLeaderboard[1].tasksSolved} solved · {sortedLeaderboard[1]
                      .tasksPartiallySolved} partial
                  </p>
                </div>
              </div>
            {/if}

            <!-- 1st Place -->
            {#if sortedLeaderboard[0]}
              <div
                class="order-1 flex flex-col items-center rounded-lg border-2 border-primary/50 bg-card/50 p-6 md:order-2 md:-translate-y-4"
              >
                <div
                  class="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/90 to-primary shadow-xl ring-4 ring-primary/20"
                >
                  <Trophy class="h-10 w-10 text-primary-foreground" />
                </div>
                <div class="text-center">
                  <p class="text-xl font-bold">
                    {sortedLeaderboard[0].user.name}
                    {sortedLeaderboard[0].user.surname}
                  </p>
                  <p class="text-sm text-muted-foreground">@{sortedLeaderboard[0].user.username}</p>
                  <p class="mt-3 text-3xl font-bold text-foreground">
                    {sortedLeaderboard[0].totalScore.toFixed(1)}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {sortedLeaderboard[0].tasksSolved} solved · {sortedLeaderboard[0]
                      .tasksPartiallySolved} partial
                  </p>
                </div>
              </div>
            {/if}

            <!-- 3rd Place -->
            {#if sortedLeaderboard[2]}
              <div
                class="order-3 flex flex-col items-center rounded-lg border-2 border-accent/30 bg-card/50 p-4"
              >
                <div
                  class="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/80 to-accent shadow-lg"
                >
                  <Medal class="h-8 w-8 text-accent-foreground" />
                </div>
                <div class="text-center">
                  <p class="text-lg font-semibold">
                    {sortedLeaderboard[2].user.name}
                    {sortedLeaderboard[2].user.surname}
                  </p>
                  <p class="text-sm text-muted-foreground">@{sortedLeaderboard[2].user.username}</p>
                  <p class="mt-2 text-2xl font-bold text-foreground">
                    {sortedLeaderboard[2].totalScore.toFixed(1)}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {sortedLeaderboard[2].tasksSolved} solved · {sortedLeaderboard[2]
                      .tasksPartiallySolved} partial
                  </p>
                </div>
              </div>
            {/if}
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
              {sortedLeaderboard.length}
              {sortedLeaderboard.length === 1 ? 'participant' : 'participants'}
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
                  <Table.Head class="hidden text-right lg:table-cell">Solved</Table.Head>
                  <Table.Head class="hidden text-right xl:table-cell">Partially Solved</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each paginatedLeaderboard as userStats, index (userStats.user.id)}
                  {@const rank = (currentPage - 1) * pageSize + index + 1}
                  {@const RankIcon = getRankIcon(rank)}
                  {@const isCurrentUser = userStats.user.id === data.currentUserId}
                  <Table.Row class={isCurrentUser ? 'bg-primary/5 font-semibold' : ''}>
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
                      {userStats.user.name}
                      {userStats.user.surname}
                      {#if isCurrentUser}
                        <span class="ml-2 text-xs text-primary">(You)</span>
                      {/if}
                    </Table.Cell>
                    <Table.Cell class="hidden text-muted-foreground md:table-cell">
                      @{userStats.user.username}
                    </Table.Cell>
                    <Table.Cell class="text-right">
                      <span class="text-lg font-bold">{userStats.totalScore.toFixed(1)}</span>
                    </Table.Cell>
                    <Table.Cell class="hidden text-right lg:table-cell">
                      <span class="font-semibold text-primary">{userStats.tasksSolved}</span>
                    </Table.Cell>
                    <Table.Cell class="hidden text-right xl:table-cell">
                      <span class="font-semibold text-secondary"
                        >{userStats.tasksPartiallySolved}</span
                      >
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
                Showing {(currentPage - 1) * pageSize + 1} - {Math.min(
                  currentPage * pageSize,
                  sortedLeaderboard.length
                )} of {sortedLeaderboard.length}
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
