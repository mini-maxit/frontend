<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Send from '@lucide/svelte/icons/send';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    disabled?: boolean;
    loading?: boolean;
    onclick?: () => void;
  }

  let { disabled = false, loading = false, onclick }: Props = $props();
</script>

<Button class="w-full" {disabled} {onclick}>
  {#if loading}
    <Loader class="mr-2 h-4 w-4 animate-spin" />
    {m.task_submit_loading()}
  {:else}
    <Send class="mr-2 h-4 w-4" />
    {m.task_submit_button()}
  {/if}
</Button>
