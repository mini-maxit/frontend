<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import * as m from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';

  interface Props {
    /** Fallback destination when there is no browser history to go back to. */
    href: string;
    label?: string;
  }

  let { href, label }: Props = $props();

  function handleBack() {
    if (browser && window.history.length > 1) {
      window.history.back();
    } else {
      goto(localizeHref(href));
    }
  }
</script>

<Button
  variant="ghost"
  size="sm"
  class="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
  onclick={handleBack}
>
  <ArrowLeft class="h-4 w-4" />
  {label ?? m.common_back()}
</Button>
