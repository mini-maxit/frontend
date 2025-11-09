<script lang="ts">
  import QuickActions from '$lib/components/dashboard/home/QuickActions.svelte';
  import { getCurrentUser } from './user.remote';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import { getLocale } from '$lib/paraglide/runtime';

  const userQuery = getCurrentUser();

  const today = new Date();
  const dateString = today.toLocaleDateString(getLocale(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
</script>

{#if userQuery.error}
  <ErrorCard
    title={m.dashboard_error_title()}
    error={userQuery.error}
    onRetry={() => userQuery.refresh()}
  />
{:else if userQuery.loading}
  <LoadingSpinner />
{:else if userQuery.current}
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight">
        👋 {m.dashboard_welcome()}, {userQuery.current.name}!
      </h1>
      <p class="text-lg text-muted-foreground">{dateString}</p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold">{m.dashboard_quick_actions()}</h2>
      <QuickActions />
    </div>
  </div>
{/if}
