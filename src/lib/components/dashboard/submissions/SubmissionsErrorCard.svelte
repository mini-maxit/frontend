<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import * as m from '$lib/paraglide/messages';

  interface SubmissionsErrorCardProps {
    error: Error;
    onRetry: () => void;
  }

  let { error, onRetry }: SubmissionsErrorCardProps = $props();
</script>

<Card.Root class="border-destructive/50 bg-destructive/5 shadow-md">
  <Card.Content class="p-8">
    <div class="flex flex-col items-center gap-4 text-center">
      <div class="rounded-full bg-destructive/10 p-3">
        <AlertCircle class="h-8 w-8 text-destructive" />
      </div>
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-foreground">
          {m.submissions_load_error()}
        </h3>
        <p class="text-sm text-muted-foreground">{error.message}</p>
      </div>
      <Button onclick={onRetry} variant="outline" class="mt-2">
        {m.submissions_try_again()}
      </Button>
    </div>
  </Card.Content>
</Card.Root>
