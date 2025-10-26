<script lang="ts">
  import BackgroundDecoration from '$lib/components/BackgroundDecoration.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as m from '$lib/paraglide/messages';
  import Construction from '@lucide/svelte/icons/construction';

  let { onBack }: { onBack?: () => void } = $props();
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4"
>
  <BackgroundDecoration opacity={0.15} strokeColor="#F1F1F1" />

  <div class="relative z-10 max-w-2xl text-center">
    <div class="mb-8 flex justify-center">
      <div class="rounded-full bg-primary-foreground/10 p-8 backdrop-blur-sm">
        <Construction class="h-24 w-24 text-primary-foreground" strokeWidth={1.5} />
      </div>
    </div>

    <h1 class="mb-6 text-3xl font-bold tracking-tight text-primary-foreground lg:text-5xl">
      {m.development_overlay_title()}
    </h1>

    <p class="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-primary-foreground/90 lg:text-xl">
      {m.development_overlay_description()}
    </p>

    {#if onBack}
      <Button
        onclick={onBack}
        size="lg"
        class="bg-primary-foreground px-8 py-6 text-lg text-primary shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-primary-foreground/90"
      >
        {m.development_overlay_back_button()}
      </Button>
    {/if}
  </div>
</div>
