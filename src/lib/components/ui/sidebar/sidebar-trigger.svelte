<script lang="ts">
  import { cn } from '$lib/utils.js';
  import PanelLeftIcon from '@lucide/svelte/icons/panel-left';
  import { useSidebar } from './context.svelte.js';
  import SidebarMenuButton from './sidebar-menu-button.svelte';

  let {
    class: className,
    onclick,
    hiddable = false,
    ...restProps
  }: {
    class?: string;
    onclick?: (e: MouseEvent) => void;
    [key: string]: any;
  } = $props();

  const sidebar = useSidebar();
  const hidden = $derived(sidebar.open && hiddable);
</script>

<SidebarMenuButton
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  variant="default"
  size="sm"
  class={cn(`size-7 justify-center ${hidden ? 'hidden' : ''}`, className)}
  onclick={(e) => {
    onclick?.(e);
    sidebar.toggle();
  }}
  {...restProps}
>
  <PanelLeftIcon class="size-4" />
</SidebarMenuButton>
