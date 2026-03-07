<script lang="ts">
  import QuickActions from '$lib/components/dashboard/home/QuickActions.svelte';
  import { userStore } from '$lib/stores/user-store.svelte';
  import * as m from '$lib/paraglide/messages';
  import { getLocale } from '$lib/paraglide/runtime';

  // User is already fetched by dashboard layout, just read from store
  const user = $derived(userStore.getUserUnsafe());

  const today = new Date();
  const dateString = today.toLocaleDateString(getLocale(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
</script>

<div class="space-y-8">
  <!-- Welcome Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight">
      👋 {m.dashboard_welcome()}, {user.name}!
    </h1>
    <p class="text-lg text-muted-foreground">{dateString}</p>
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-bold">{m.dashboard_quick_actions()}</h2>
    <QuickActions />
  </div>
</div>
