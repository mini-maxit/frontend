<script lang="ts">
  import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger
  } from '#lib/components/ui/sidebar/index.js';
  import DashboardSidebar from '#lib/components/dashboard/DashboardSidebar.svelte';
  import { getDashboardTitleTranslationFromPathname } from '#lib/components/dashboard/utils.js';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import { goto } from '$app/navigation';
  import { AppRoutes } from '#lib/routes.js';
  import { userStore } from '#lib/stores/user-store.svelte.js';
  import { tokenStore } from '#lib/stores/token-store.svelte.js';
  import { getUserInstance, getApiInstance } from '#lib/services/index.js';
  import { LoadingSpinner } from '#lib/components/common/index.js';
  import Footer from '#lib/components/Footer.svelte';
  import { buildDocumentTitle } from '#lib/title.js';

  let { children } = $props();

  const pageTitle = $derived(getDashboardTitleTranslationFromPathname(page.url.pathname));
  const isLoading = $derived(userStore.isLoading());
  // Client-side authentication guard and user fetch
  onMount(async () => {
    if (!browser) return;

    // Check if we have a token, if not try silent refresh
    if (!tokenStore.hasToken()) {
      const apiClient = getApiInstance();
      if (apiClient) {
        try {
          const refreshed = await apiClient.silentRefresh();
          if (!refreshed) {
            // No valid session, redirect to login
            const redirectTo = page.url.pathname + page.url.search;
            goto(`${AppRoutes.Login}?redirectTo=${encodeURIComponent(redirectTo)}`);
            return;
          }
        } catch (error) {
          // Silent refresh failed, redirect to login
          const redirectTo = page.url.pathname + page.url.search;
          goto(`${AppRoutes.Login}?redirectTo=${encodeURIComponent(redirectTo)}`);
          return;
        }
      }
    }

    // Fetch user data if not already loaded
    if (!userStore.tryGetUser() && !isLoading) {
      const userService = getUserInstance();
      if (userService) {
        const result = await userService.getCurrentUser();
        if (!result.success) {
          // Failed to fetch user, redirect to login
          const redirectTo = page.url.pathname + page.url.search;
          goto(`${AppRoutes.Login}?redirectTo=${encodeURIComponent(redirectTo)}`);
        }
      }
    }
  });
</script>

<svelte:head>
  <title>{buildDocumentTitle(pageTitle)}</title>
</svelte:head>

{#if isLoading || !userStore.tryGetUser()}
  <div class="flex h-screen items-center justify-center">
    <LoadingSpinner />
  </div>
{:else}
  <SidebarProvider>
    <DashboardSidebar />
    <SidebarInset class="flex flex-col">
      <div class="flex items-center justify-center gap-4 border-b p-4">
        <SidebarTrigger class="absolute left-4" hiddable={true} />
        <h1 class="text-xl font-semibold">{pageTitle}</h1>
      </div>
      <main class="flex-1 p-4">
        {@render children()}
      </main>
      <Footer />
    </SidebarInset>
  </SidebarProvider>
{/if}
