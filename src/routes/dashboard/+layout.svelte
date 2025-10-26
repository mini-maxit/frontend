<script lang="ts">
  import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';
  import DashboardSidebar from '$lib/components/dashboard/DashboardSidebar.svelte';
  import DevModeOverlay from '$lib/components/dashboard/DevModeOverlay.svelte';
  import { getDashboardTitleTranslationFromPathname } from '$lib/components/dashboard/utils';
  import { page } from '$app/state';
  import type { LayoutProps } from './$types';
  import Footer from '$lib/components/Footer.svelte';

  let { children, data }: LayoutProps = $props();

  const pageTitle = $derived(getDashboardTitleTranslationFromPathname(page.url.pathname));
</script>

<SidebarProvider>
  <DashboardSidebar user={data.user} />
  <SidebarInset class="flex flex-col">
    <DevModeOverlay />
    <div class="flex items-center justify-center gap-4 border-b p-4">
      <SidebarTrigger class={`absolute left-4`} hiddable={true} />
      <h1 class="text-xl font-semibold">{pageTitle}</h1>
    </div>
    <main class="flex-1 p-4">
      {@render children()}
    </main>
    <Footer />
  </SidebarInset>
</SidebarProvider>
