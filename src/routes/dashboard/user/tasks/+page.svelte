<script lang="ts">
  // import TasksStats from '$lib/components/dashboard/tasks/TasksStats.svelte';
  import TaskCard from '$lib/components/dashboard/tasks/TaskCard.svelte';
  import Trophy from '@lucide/svelte/icons/trophy';

  const contestTasks = [
    {
      contestName: 'Spring Code Sprint 2025',
      tasks: [
        {
          name: 'Array Manipulation Challenge',
          difficulty: 'easy' as const,
          status: 'completed' as const,
          bestScore: 100,
          maxScore: 100,
          attempts: 1
        },
        {
          name: 'String Parsing Problem',
          difficulty: 'medium' as const,
          status: 'in-progress' as const,
          bestScore: 80,
          maxScore: 100,
          attempts: 3
        },
        {
          name: 'Advanced Algorithm Task',
          difficulty: 'hard' as const,
          status: 'not-started' as const,
          bestScore: 0,
          maxScore: 100,
          attempts: 0
        }
      ]
    },
    {
      contestName: 'Weekly Algorithm Challenge',
      tasks: [
        {
          name: 'Two Pointer Technique',
          difficulty: 'easy' as const,
          status: 'completed' as const,
          bestScore: 90,
          maxScore: 100,
          attempts: 2
        },
        {
          name: 'Sliding Window Problem',
          difficulty: 'medium' as const,
          status: 'completed' as const,
          bestScore: 85,
          maxScore: 100,
          attempts: 3
        }
      ]
    }
  ];
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">Your Tasks</h1>
    <p class="text-lg text-muted-foreground">Complete tasks from your groups and active contests</p>
  </div>

  <!-- Stats Banner -->
  <!-- <TasksStats /> -->

  <!-- Tasks from Contests -->
  <div class="space-y-6">
    <div class="flex items-center gap-2">
      <Trophy class="h-6 w-6 text-primary" />
      <h2 class="text-2xl font-bold text-foreground">Tasks from Contests</h2>
    </div>

    {#each contestTasks as contest}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-foreground">{contest.contestName}</h3>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each contest.tasks as task}
            <TaskCard
              name={task.name}
              difficulty={task.difficulty}
              status={task.status}
              bestScore={task.bestScore}
              maxScore={task.maxScore}
              attempts={task.attempts}
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
