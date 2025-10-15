<script lang="ts">
  import TasksStats from '$lib/components/dashboard/tasks/TasksStats.svelte';
  import TaskCard from '$lib/components/dashboard/tasks/TaskCard.svelte';
  import Users from '@lucide/svelte/icons/users';
  import Trophy from '@lucide/svelte/icons/trophy';

  // Tasks from Groups
  const groupTasks = [
    {
      groupName: 'Data Structures & Algorithms',
      tasks: [
        {
          name: 'Binary Search Tree Implementation',
          difficulty: 'medium' as const,
          status: 'completed' as const,
          bestScore: 100,
          maxScore: 100,
          attempts: 2
        },
        {
          name: 'Graph Traversal Algorithm',
          difficulty: 'hard' as const,
          status: 'in-progress' as const,
          bestScore: 75,
          maxScore: 100,
          attempts: 4
        },
        {
          name: 'Dynamic Programming Challenge',
          difficulty: 'hard' as const,
          status: 'not-started' as const,
          bestScore: 0,
          maxScore: 100,
          attempts: 0
        }
      ]
    },
    {
      groupName: 'Web Development Fundamentals',
      tasks: [
        {
          name: 'React Component Design',
          difficulty: 'easy' as const,
          status: 'completed' as const,
          bestScore: 95,
          maxScore: 100,
          attempts: 1
        },
        {
          name: 'REST API Implementation',
          difficulty: 'medium' as const,
          status: 'in-progress' as const,
          bestScore: 60,
          maxScore: 100,
          attempts: 2
        },
        {
          name: 'Authentication System',
          difficulty: 'hard' as const,
          status: 'not-started' as const,
          bestScore: 0,
          maxScore: 100,
          attempts: 0
        }
      ]
    },
    {
      groupName: 'Machine Learning Basics',
      tasks: [
        {
          name: 'Linear Regression Model',
          difficulty: 'easy' as const,
          status: 'completed' as const,
          bestScore: 100,
          maxScore: 100,
          attempts: 1
        },
        {
          name: 'Neural Network Implementation',
          difficulty: 'hard' as const,
          status: 'in-progress' as const,
          bestScore: 45,
          maxScore: 100,
          attempts: 5
        }
      ]
    }
  ];

  // Tasks from Contests
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
  <TasksStats />

  <!-- Tasks from Groups -->
  <div class="space-y-6">
    <div class="flex items-center gap-2">
      <Users class="h-6 w-6 text-primary" />
      <h2 class="text-2xl font-bold text-foreground">Tasks from Groups</h2>
    </div>

    {#each groupTasks as group}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-foreground">{group.groupName}</h3>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each group.tasks as task}
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
