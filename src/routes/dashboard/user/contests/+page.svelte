<script lang="ts">
  import ContestsStats from '$lib/components/dashboard/contests/ContestsStats.svelte';
  import ActiveContestCard from '$lib/components/dashboard/contests/ActiveContestCard.svelte';
  import PastContestCard from '$lib/components/dashboard/contests/PastContestCard.svelte';

  const activeContests = [
    {
      name: 'Spring Code Sprint 2025',
      status: 'live' as const,
      endsIn: 154, // 2h 34m in minutes
      participants: 347,
      totalTasks: 12,
      completedTasks: 3,
      currentRank: 42
    },
    {
      name: 'Weekly Algorithm Challenge',
      status: 'live' as const,
      endsIn: 420, // 7 hours in minutes
      participants: 128,
      totalTasks: 8,
      completedTasks: 5,
      currentRank: 18
    },
    {
      name: 'Data Structures Master Class',
      status: 'upcoming' as const,
      endsIn: 1260, // 21 hours (starts in)
      participants: 89,
      totalTasks: 10,
      completedTasks: 0
    }
  ];

  const pastContests = [
    {
      name: 'February Programming Contest',
      score: 285,
      maxScore: 300,
      completionPercentage: 95,
      date: '2 weeks ago',
      participants: 156
    },
    {
      name: 'Winter Coding Challenge',
      score: 180,
      maxScore: 250,
      completionPercentage: 72,
      date: '1 month ago',
      participants: 203
    }
  ];
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">Your Contests</h1>
    <p class="text-lg text-muted-foreground">
      Participate in contests and compete with other students
    </p>
  </div>

  <!-- Stats Banner -->
  <ContestsStats />

  <!-- Active Contests Section -->
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-foreground">Active & Upcoming Contests</h2>
      <span
        class="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600"
      >
        <span class="relative flex h-2 w-2">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"
          ></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
        </span>
        {activeContests.filter((c) => c.status === 'live').length} Live
      </span>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      {#each activeContests as contest}
        <ActiveContestCard
          name={contest.name}
          status={contest.status}
          endsIn={contest.endsIn}
          participants={contest.participants}
          totalTasks={contest.totalTasks}
          completedTasks={contest.completedTasks}
          currentRank={contest.currentRank}
        />
      {/each}
    </div>
  </div>

  <!-- Past Contests Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">Past Contests</h2>
    <div class="grid gap-6 sm:grid-cols-2">
      {#each pastContests as contest}
        <PastContestCard
          name={contest.name}
          score={contest.score}
          maxScore={contest.maxScore}
          completionPercentage={contest.completionPercentage}
          date={contest.date}
          participants={contest.participants}
        />
      {/each}
    </div>
  </div>
</div>
