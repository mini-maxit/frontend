<script lang="ts">
  import SubmissionsStats from '$lib/components/dashboard/submissions/SubmissionsStats.svelte';
  import SubmissionRow from '$lib/components/dashboard/submissions/SubmissionRow.svelte';

  const submissions = [
    {
      taskName: 'Binary Search Tree Implementation',
      status: 'success' as const,
      score: '100/100',
      language: 'Python',
      submissionDate: '2h ago',
      executionTime: '0.45s',
      memoryUsed: '15.2 MB'
    },
    {
      taskName: 'Dynamic Programming Challenge',
      status: 'failed' as const,
      score: '45/100',
      language: 'C++',
      submissionDate: '5h ago',
      executionTime: '1.23s',
      memoryUsed: '22.8 MB'
    },
    {
      taskName: 'Graph Traversal Algorithm',
      status: 'success' as const,
      score: '95/100',
      language: 'Java',
      submissionDate: '1d ago',
      executionTime: '0.67s',
      memoryUsed: '18.4 MB'
    },
    {
      taskName: 'String Manipulation Task',
      status: 'success' as const,
      score: '100/100',
      language: 'JavaScript',
      submissionDate: '2d ago',
      executionTime: '0.32s',
      memoryUsed: '12.1 MB'
    },
    {
      taskName: 'Sorting Algorithm Optimization',
      status: 'failed' as const,
      score: '60/100',
      language: 'Python',
      submissionDate: '3d ago',
      executionTime: '2.15s',
      memoryUsed: '28.6 MB'
    },
    {
      taskName: 'Hash Table Design',
      status: 'success' as const,
      score: '88/100',
      language: 'Go',
      submissionDate: '4d ago',
      executionTime: '0.55s',
      memoryUsed: '14.9 MB'
    },
    {
      taskName: 'Recursive Problem Solving',
      status: 'pending' as const,
      score: '-/-',
      language: 'Python',
      submissionDate: '5d ago',
      executionTime: '-',
      memoryUsed: '-'
    },
    {
      taskName: 'Matrix Operations',
      status: 'success' as const,
      score: '92/100',
      language: 'C++',
      submissionDate: '6d ago',
      executionTime: '0.78s',
      memoryUsed: '19.3 MB'
    },
    {
      taskName: 'Linked List Reversal',
      status: 'success' as const,
      score: '100/100',
      language: 'Java',
      submissionDate: '1w ago',
      executionTime: '0.41s',
      memoryUsed: '16.7 MB'
    },
    {
      taskName: 'Backtracking Algorithm',
      status: 'failed' as const,
      score: '38/100',
      language: 'Python',
      submissionDate: '1w ago',
      executionTime: '3.42s',
      memoryUsed: '35.1 MB'
    },
    {
      taskName: 'Tree Traversal Methods',
      status: 'success' as const,
      score: '85/100',
      language: 'JavaScript',
      submissionDate: '2w ago',
      executionTime: '0.59s',
      memoryUsed: '17.2 MB'
    },
    {
      taskName: 'Two Pointer Technique',
      status: 'success' as const,
      score: '100/100',
      language: 'C++',
      submissionDate: '2w ago',
      executionTime: '0.38s',
      memoryUsed: '13.5 MB'
    },
    {
      taskName: 'Greedy Algorithm Practice',
      status: 'failed' as const,
      score: '52/100',
      language: 'Java',
      submissionDate: '3w ago',
      executionTime: '1.89s',
      memoryUsed: '26.4 MB'
    },
    {
      taskName: 'Bit Manipulation Challenges',
      status: 'success' as const,
      score: '78/100',
      language: 'Python',
      submissionDate: '3w ago',
      executionTime: '0.63s',
      memoryUsed: '15.8 MB'
    },
    {
      taskName: 'Stack and Queue Implementation',
      status: 'success' as const,
      score: '100/100',
      language: 'Go',
      submissionDate: '1mo ago',
      executionTime: '0.47s',
      memoryUsed: '14.3 MB'
    }
  ];
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">Your Submissions</h1>
    <p class="text-lg text-muted-foreground">Track your progress and review all your submissions</p>
  </div>

  <!-- Stats Banner -->
  <SubmissionsStats />

  <!-- Submissions List -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">All Submissions</h2>
    <div class="space-y-3">
      {#each submissions as submission}
        <SubmissionRow
          taskName={submission.taskName}
          status={submission.status}
          score={submission.score}
          language={submission.language}
          submissionDate={submission.submissionDate}
          executionTime={submission.executionTime}
          memoryUsed={submission.memoryUsed}
        />
      {/each}
    </div>
  </div>
</div>
