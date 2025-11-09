<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as m from '$lib/paraglide/messages';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/mono-blue.css';

  interface Props {
    content: string;
  }

  let { content }: Props = $props();

  const highlighted = $derived(() => {
    if (!content) return '';
    const result = hljs.highlightAuto(content);
    return result.value;
  });
</script>

<Card.Root class="flex-1 overflow-hidden">
  <Card.Header>
    <Card.Title>{m.task_preview_title()}</Card.Title>
  </Card.Header>
  <Card.Content class="mx-6 overflow-auto px-0">
    <pre class="rounded-lg text-xs"><code>{@html highlighted()}</code></pre>
  </Card.Content>
</Card.Root>
