<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import * as m from '$lib/paraglide/messages';

  interface TasksErrorCardProps {
    error?: Error | null;
    onRetry: () => void;
  }

  let { error, onRetry }: TasksErrorCardProps = $props();
</script>

<div
  class="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-12 text-center"
>
  <AlertCircle class="h-12 w-12 text-destructive" />
  <p class="mt-4 text-lg font-medium text-destructive">{m.admin_tasks_load_error_title()}</p>
  <p class="mt-1 text-sm text-muted-foreground">
    {error?.message || m.error_unknown_error()}
  </p>
  <Button variant="outline" class="mt-4" onclick={onRetry}>
    {m.error_try_again()}
  </Button>
</div>
