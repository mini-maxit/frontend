<script lang="ts">
  import AvailableTasksStats from '$lib/components/dashboard/available-tasks/AvailableTasksStats.svelte';
  import TasksFilterBar from '$lib/components/dashboard/available-tasks/TasksFilterBar.svelte';
  import AvailableTaskCard from '$lib/components/dashboard/available-tasks/AvailableTaskCard.svelte';
  import { Button } from '$lib/components/ui/button';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';

  const tasks = [
    {
      name: 'Two Sum Problem',
      difficulty: 'easy' as const,
      status: 'solved' as const,
      acceptanceRate: 88,
      category: 'Arrays'
    },
    {
      name: 'Binary Search Tree Implementation',
      difficulty: 'medium' as const,
      status: 'solved' as const,
      acceptanceRate: 72,
      category: 'Trees'
    },
    {
      name: 'Dynamic Programming Challenge',
      difficulty: 'hard' as const,
      status: 'attempted' as const,
      acceptanceRate: 45,
      category: 'DP'
    },
    {
      name: 'Linked List Reversal',
      difficulty: 'easy' as const,
      status: 'solved' as const,
      acceptanceRate: 91,
      category: 'Linked Lists'
    },
    {
      name: 'Graph Traversal Algorithm',
      difficulty: 'hard' as const,
      status: 'not-attempted' as const,
      acceptanceRate: 52,
      category: 'Graphs'
    },
    {
      name: 'String Manipulation',
      difficulty: 'easy' as const,
      status: 'not-attempted' as const,
      acceptanceRate: 85,
      category: 'Strings'
    },
    {
      name: 'Sorting Algorithm Optimization',
      difficulty: 'medium' as const,
      status: 'attempted' as const,
      acceptanceRate: 68,
      category: 'Sorting'
    },
    {
      name: 'Hash Table Design',
      difficulty: 'medium' as const,
      status: 'solved' as const,
      acceptanceRate: 75,
      category: 'Hash Tables'
    },
    {
      name: 'Backtracking Algorithm',
      difficulty: 'hard' as const,
      status: 'not-attempted' as const,
      acceptanceRate: 38,
      category: 'Backtracking'
    },
    {
      name: 'Stack Implementation',
      difficulty: 'easy' as const,
      status: 'solved' as const,
      acceptanceRate: 93,
      category: 'Stacks'
    },
    {
      name: 'Tree Traversal Methods',
      difficulty: 'medium' as const,
      status: 'attempted' as const,
      acceptanceRate: 70,
      category: 'Trees'
    },
    {
      name: 'Advanced Recursion',
      difficulty: 'hard' as const,
      status: 'not-attempted' as const,
      acceptanceRate: 41,
      category: 'Recursion'
    }
  ];

  let currentPage = $state(1);
  const itemsPerPage = 12;
  const totalPages = $derived(Math.ceil(tasks.length / itemsPerPage));

  const paginatedTasks = $derived(
    tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">Available Tasks</h1>
    <p class="text-lg text-muted-foreground">
      Browse and solve programming challenges to improve your skills
    </p>
  </div>

  <!-- Stats Banner -->
  <AvailableTasksStats />

  <!-- Filter Bar -->
  <TasksFilterBar />

  <!-- Tasks Grid -->
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-foreground">All Tasks</h2>
      <p class="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(
          currentPage * itemsPerPage,
          tasks.length
        )} of {tasks.length}
      </p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each paginatedTasks as task}
        <AvailableTaskCard
          name={task.name}
          difficulty={task.difficulty}
          status={task.status}
          acceptanceRate={task.acceptanceRate}
          category={task.category}
        />
      {/each}
    </div>
  </div>

  <!-- Pagination -->
  {#if totalPages > 1}
    <div class="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onclick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft class="h-4 w-4" />
        Previous
      </Button>

      <div class="flex gap-1">
        {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
          <Button
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onclick={() => goToPage(page)}
            class="min-w-10"
          >
            {page}
          </Button>
        {/each}
      </div>

      <Button
        variant="outline"
        size="sm"
        onclick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
  {/if}
</div>
