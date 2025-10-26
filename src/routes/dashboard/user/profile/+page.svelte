<script lang="ts">
  import UserInfoCard from '$lib/components/dashboard/profile/UserInfoCard.svelte';
  import QuickActions from '$lib/components/dashboard/profile/QuickActions.svelte';
  import * as m from '$lib/paraglide/messages';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">{m.profile_page_title()}</h1>
    <p class="text-lg text-muted-foreground">{m.profile_page_description()}</p>
  </div>

  <!-- Top Section: User Info + Quick Actions -->
  <div class="grid gap-6 lg:grid-cols-3">
    <div class="lg:col-span-2">
      <UserInfoCard user={data.user} />
    </div>
    <div class="lg:col-span-1">
      <QuickActions />
    </div>
  </div>

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
