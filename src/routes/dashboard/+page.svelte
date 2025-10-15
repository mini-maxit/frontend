<script lang="ts">
  import DashboardStats from '$lib/components/dashboard/home/DashboardStats.svelte';
  import QuickActions from '$lib/components/dashboard/home/QuickActions.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  // Get current date for welcome message
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract username from data if available
  const username = 'John'; // TODO: Get from data.user when available
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Welcome Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      👋 Welcome back, {username}!
    </h1>
    <p class="text-lg text-muted-foreground">{dateString}</p>
    <p class="text-md text-muted-foreground">
      You've completed <span class="font-semibold text-foreground">15 tasks</span> this week. Keep it
      up!
    </p>
  </div>

  <!-- Quick Stats -->
  <DashboardStats />

  <!-- Quick Actions -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">Quick Actions</h2>
    <QuickActions />
  </div>
</div>
