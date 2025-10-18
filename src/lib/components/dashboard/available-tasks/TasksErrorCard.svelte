<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    error: string;
    onRetry: () => void;
  }

  let { error, onRetry }: Props = $props();
</script>

<Card.Root class="border-destructive/50 bg-destructive/5">
  <Card.Header>
    <div class="flex items-center gap-2">
      <AlertCircle class="h-5 w-5 text-destructive" />
      <Card.Title class="text-destructive">{m.user_tasks_load_error()}</Card.Title>
    </div>
  </Card.Header>
  <Card.Content>
    <p class="text-sm text-muted-foreground">{error}</p>
  </Card.Content>
  <Card.Footer>
    <Button onclick={onRetry} variant="outline" size="sm">
      {m.user_tasks_try_again()}
    </Button>
  </Card.Footer>
</Card.Root>
