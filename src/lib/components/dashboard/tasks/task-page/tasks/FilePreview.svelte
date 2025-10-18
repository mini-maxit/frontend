<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    content: string;
  }

  let { content }: Props = $props();
</script>

<Card.Root class="flex-1 overflow-hidden">
  <Card.Header>
    <Card.Title>{m.task_preview_title()}</Card.Title>
  </Card.Header>
  <Card.Content class="mx-6 overflow-auto px-0">
    <pre class="rounded-lg p-4 text-xs"><code>{content}</code></pre>
  </Card.Content>
</Card.Root>
