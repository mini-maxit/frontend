<script lang="ts">
  import { page } from '$app/state';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { delocalizePath, AppRoutes } from '$lib/routes';
  import { Button } from '$lib/components/ui/button';
  import * as m from '$lib/paraglide/messages';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Info from '@lucide/svelte/icons/info';

  // Define mocked pages
  const MOCKED_PAGES = [AppRoutes.UserTasks];

  // Check if current page is mocked
  const isMockedPage = $derived.by(() => {
    const currentPath = delocalizePath(page.url.pathname);
    return MOCKED_PAGES.some((route) => currentPath === route);
  });

  // Only show overlay in development mode and on mocked pages
  const shouldShowOverlay = $derived(isMockedPage);
</script>

{#if shouldShowOverlay}
  <div
    class="pointer-events-none fixed inset-0 z-50 flex items-start justify-center p-4"
    role="alert"
    aria-live="polite"
  >
    <div
      class="pointer-events-auto flex items-center gap-3 rounded-lg border border-orange-500 bg-orange-50 px-4 py-3 shadow-lg dark:border-orange-700 dark:bg-orange-950"
    >
      <Info class="h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-orange-900 dark:text-orange-100">
          {m.overlay_mocked_page()}
        </span>
        <Button
          href={localizeHref(AppRoutes.Dashboard)}
          variant="outline"
          size="sm"
          class="gap-2 border-orange-300 bg-white hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900 dark:hover:bg-orange-800"
        >
          <ArrowLeft class="h-4 w-4" />
          {m.overlay_go_back()}
        </Button>
      </div>
    </div>
  </div>
{/if}
