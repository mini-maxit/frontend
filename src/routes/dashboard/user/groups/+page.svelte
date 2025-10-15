<script lang="ts">
  import GroupsStats from '$lib/components/dashboard/groups/GroupsStats.svelte';
  import GroupCard from '$lib/components/dashboard/groups/GroupCard.svelte';

  const groups = [
    {
      name: 'Data Structures & Algorithms',
      memberCount: 45,
      activeTasks: 12,
      recentSubmissions: 87,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Advanced Programming Techniques',
      memberCount: 32,
      activeTasks: 8,
      recentSubmissions: 54,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Web Development Fundamentals',
      memberCount: 58,
      activeTasks: 15,
      recentSubmissions: 123,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Machine Learning Basics',
      memberCount: 28,
      activeTasks: 6,
      recentSubmissions: 41,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Database Systems',
      memberCount: 41,
      activeTasks: 10,
      recentSubmissions: 68,
      color: 'from-pink-500 to-pink-600'
    },
    {
      name: 'Software Engineering Principles',
      memberCount: 52,
      activeTasks: 14,
      recentSubmissions: 95,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Computer Networks',
      memberCount: 36,
      activeTasks: 9,
      recentSubmissions: 62,
      color: 'from-teal-500 to-teal-600'
    },
    {
      name: 'Operating Systems',
      memberCount: 50,
      activeTasks: 11,
      recentSubmissions: 79,
      color: 'from-red-500 to-red-600'
    }
  ];
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">Your Groups</h1>
    <p class="text-lg text-muted-foreground">Manage and view all your groups in one place</p>
  </div>

  <!-- Stats Banner -->
  <GroupsStats />

  <!-- Groups Grid -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">All Groups</h2>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each groups as group}
        <GroupCard
          name={group.name}
          memberCount={group.memberCount}
          activeTasks={group.activeTasks}
          recentSubmissions={group.recentSubmissions}
          color={group.color}
        />
      {/each}
    </div>
  </div>
</div>
