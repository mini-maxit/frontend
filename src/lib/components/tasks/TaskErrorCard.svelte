<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as m from '$lib/paraglide/messages';
  import type { HttpError } from '@sveltejs/kit';

  interface Props {
    error?: HttpError | any;
    onRetry?: () => void;
  }

  let { error, onRetry }: Props = $props();
</script>

<Card.Root class="border-destructive/20 bg-destructive/5">
  <Card.Header>
    <Card.Title class="text-destructive">{m.task_error_title()}</Card.Title>
  </Card.Header>
  <Card.Content>
    <p class="text-sm text-muted-foreground">
      {error?.message || m.task_error_unknown()}
    </p>
    {#if onRetry}
      <Button variant="outline" class="mt-4" onclick={onRetry}>
        {m.task_error_try_again()}
      </Button>
    {/if}
  </Card.Content>
</Card.Root>
