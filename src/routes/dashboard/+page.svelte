<script lang="ts">
  import QuickActions from '$lib/components/dashboard/home/QuickActions.svelte';
  import { getCurrentUser } from './user.remote';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import { getLocale } from '$lib/paraglide/runtime';
  import { format } from 'date-fns';
  import { enUS, pl } from 'date-fns/locale';

  const userQuery = getCurrentUser();

  const locale = getLocale() === 'pl' ? pl : enUS;
  const dateString = format(new Date(), 'EEEE, MMMM d, yyyy', { locale });
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
