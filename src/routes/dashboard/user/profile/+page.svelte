<script lang="ts">
  import UserInfoCard from '$lib/components/dashboard/profile/UserInfoCard.svelte';
  import QuickActions from '$lib/components/dashboard/profile/QuickActions.svelte';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import { getUserProfile } from './profile.remote';

  const userProfileQuery = getUserProfile();
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">{m.profile_page_title()}</h1>
    <p class="text-lg text-muted-foreground">{m.profile_page_description()}</p>
  </div>

  {#if userProfileQuery.error}
    <ErrorCard
      title={m.profile_error_title()}
      error={userProfileQuery.error}
      onRetry={() => userProfileQuery.refresh()}
      inCard
      iconBackground
    />
  {:else if userProfileQuery.loading}
    <LoadingSpinner message={m.profile_loading()} inCard size="h-12 w-12" />
  {:else if userProfileQuery.current}
    <!-- Top Section: User Info + Quick Actions -->
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <UserInfoCard user={userProfileQuery.current} />
      </div>
      <div class="lg:col-span-1">
        <QuickActions />
      </div>
    </div>
  {/if}

  <!-- Stats Overview -->
  <!-- TODO IMPLEMENT THIS -->
  <!-- <div class="w-full">
    <StatsOverview />
  </div> -->

  <!-- Bottom Section: Recent Activity + Groups -->
  <!-- <div class="grid gap-6 lg:grid-cols-2">
    <div>
      <RecentActivity />
    </div>
    <div>
      <UserGroups />
    </div>
  </div> -->
</div>
