<script lang="ts">
  import '../app.css';
  import { Toaster } from '#lib/components/ui/sonner/index.js';
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import { page } from '$app/state';
  import { getApiInstance } from '#lib/services/index.js';
  import { isProtectedRoute } from '#lib/routes.js';
  import { buildDocumentTitle } from '#lib/title.js';

  let { children } = $props();

  onMount(async () => {
    if (browser) {
      // Only perform silent refresh on protected routes
      if (isProtectedRoute(page.url.pathname)) {
        const apiClient = getApiInstance();
        if (apiClient) {
          try {
            await apiClient.silentRefresh();
          } catch (error) {
            console.debug('Silent refresh not available:', error);
          }
        }
      }
    }
  });
</script>

<svelte:head>
  <title>{buildDocumentTitle()}</title>
</svelte:head>

<Toaster />

{@render children?.()}
