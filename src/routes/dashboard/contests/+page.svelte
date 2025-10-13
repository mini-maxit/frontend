<script lang="ts">
  import AvailableContestsStats from '$lib/components/dashboard/available-contests/AvailableContestsStats.svelte';
  import AvailableContestCard from '$lib/components/dashboard/available-contests/AvailableContestCard.svelte';

  const liveContests = [
    {
      name: 'Spring Coding Marathon 2025',
      status: 'live' as const,
      startDate: 'Mar 10, 09:00',
      endDate: 'Mar 13, 21:00',
      participantCount: 347,
      tasksCount: 15,
      isRegistered: true,
      endsInMinutes: 3794 // 2d 14h
    },
    {
      name: 'Weekly Algorithm Challenge',
      status: 'live' as const,
      startDate: 'Mar 11, 14:00',
      endDate: 'Mar 11, 23:00',
      participantCount: 128,
      tasksCount: 8,
      isRegistered: false,
      endsInMinutes: 540 // 9h
    }
  ];

  const upcomingContests = [
    {
      name: 'Data Structures Master Class',
      status: 'upcoming' as const,
      startDate: 'Mar 15, 10:00',
      endDate: 'Mar 18, 18:00',
      participantCount: 89,
      tasksCount: 10,
      isRegistered: true
    },
    {
      name: 'Advanced Algorithms Sprint',
      status: 'upcoming' as const,
      startDate: 'Mar 20, 12:00',
      endDate: 'Mar 22, 20:00',
      participantCount: 156,
      tasksCount: 12,
      isRegistered: false
    },
    {
      name: 'Web Development Challenge',
      status: 'upcoming' as const,
      startDate: 'Mar 25, 08:00',
      endDate: 'Mar 26, 20:00',
      participantCount: 203,
      tasksCount: 6,
      isRegistered: false
    },
    {
      name: 'System Design Contest',
      status: 'upcoming' as const,
      startDate: 'Apr 1, 15:00',
      endDate: 'Apr 3, 18:00',
      participantCount: 67,
      tasksCount: 8,
      isRegistered: true
    }
  ];

  const pastContests = [
    {
      name: 'February Programming Contest',
      status: 'past' as const,
      startDate: 'Feb 20, 10:00',
      endDate: 'Feb 22, 18:00',
      participantCount: 245,
      tasksCount: 14,
      isRegistered: true
    },
    {
      name: 'Winter Coding Challenge',
      status: 'past' as const,
      startDate: 'Jan 15, 09:00',
      endDate: 'Jan 17, 21:00',
      participantCount: 312,
      tasksCount: 10,
      isRegistered: false
    }
  ];
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">Available Contests</h1>
    <p class="text-lg text-muted-foreground">
      Browse and join contests to compete with other students
    </p>
  </div>

  <!-- Stats Banner -->
  <AvailableContestsStats />

  <!-- Live Contests Section -->
  {#if liveContests.length > 0}
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-foreground">Live Contests</h2>
        <span
          class="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"
            ></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
          {liveContests.length} Live
        </span>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each liveContests as contest}
          <AvailableContestCard
            name={contest.name}
            status={contest.status}
            startDate={contest.startDate}
            endDate={contest.endDate}
            participantCount={contest.participantCount}
            tasksCount={contest.tasksCount}
            isRegistered={contest.isRegistered}
            endsInMinutes={contest.endsInMinutes}
          />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Upcoming Contests Section -->
  {#if upcomingContests.length > 0}
    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-foreground">Upcoming Contests</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each upcomingContests as contest}
          <AvailableContestCard
            name={contest.name}
            status={contest.status}
            startDate={contest.startDate}
            endDate={contest.endDate}
            participantCount={contest.participantCount}
            tasksCount={contest.tasksCount}
            isRegistered={contest.isRegistered}
          />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Past Contests Section -->
  {#if pastContests.length > 0}
    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-foreground">Past Contests</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each pastContests as contest}
          <AvailableContestCard
            name={contest.name}
            status={contest.status}
            startDate={contest.startDate}
            endDate={contest.endDate}
            participantCount={contest.participantCount}
            tasksCount={contest.tasksCount}
            isRegistered={contest.isRegistered}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>
