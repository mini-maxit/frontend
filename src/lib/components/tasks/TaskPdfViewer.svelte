<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    pdfDataUrl?: string | null;
  }

  let { pdfDataUrl }: Props = $props();
</script>

<Card.Root class="flex flex-col">
  <Card.Header>
    <Card.Title>{m.task_description_title()}</Card.Title>
  </Card.Header>
  <Card.Content class="flex-1">
    <div class="h-full w-full overflow-hidden rounded-lg border">
      {#if pdfDataUrl}
        <iframe
          src={pdfDataUrl}
          title={m.task_description_title()}
          class="h-full w-full"
          frameborder="0"
        ></iframe>
      {:else}
        <div class="flex h-full items-center justify-center">
          <p class="text-sm text-muted-foreground">{m.task_description_none()}</p>
        </div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
