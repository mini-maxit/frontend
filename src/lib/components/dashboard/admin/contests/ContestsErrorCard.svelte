<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    error: Error | null;
    onRetry: () => void;
  }

  let { error, onRetry }: Props = $props();
</script>

<div
  class="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-12 text-center"
>
  <p class="text-lg font-medium text-destructive">{m.admin_contests_load_error_title()}</p>
  <p class="mt-1 text-sm text-muted-foreground">
    {error?.message || m.error_unknown_error()}
  </p>
  <Button variant="outline" class="mt-4" onclick={onRetry}>
    {m.admin_contests_try_again()}
  </Button>
</div>
