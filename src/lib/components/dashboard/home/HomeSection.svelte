<script lang="ts">
  import type { Snippet } from 'svelte';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { localizeHref } from '#lib/paraglide/runtime.js';
  import * as m from '#lib/paraglide/messages.js';
  import type { Query } from '#lib/utils/query.svelte.js';

  interface Props {
    title: string;
    count?: number | null;
    href?: string;
    linkLabel?: string;
    /** When given, renders loading / error states and only calls children once data is in. */
    query?: Query<unknown>;
    children: Snippet;
  }

  let { title, count, href, linkLabel, query, children }: Props = $props();
</script>

<section class="min-w-0" aria-label={title}>
  <header class="mb-3 flex items-baseline justify-between gap-4">
    <h2 class="text-base font-semibold tracking-tight">
      {title}
      {#if count != null}
        <span class="ml-1 font-normal text-muted-foreground tabular-nums">{count}</span>
      {/if}
    </h2>
    {#if href}
      <a
        href={localizeHref(href)}
        class="group inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary"
      >
        {linkLabel ?? m.home_view_all()}
        <ArrowRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
    {/if}
  </header>

  <div class="overflow-hidden rounded-lg border border-foreground/10 bg-card">
    {#if query?.loading}
      <div class="space-y-3 p-4" aria-busy="true">
        {#each [0, 1, 2] as i (i)}
          <div
            class="h-4 animate-pulse rounded bg-foreground/5"
            style="width: {85 - i * 18}%"
          ></div>
        {/each}
      </div>
    {:else if query?.error}
      <div class="flex items-center justify-between gap-4 p-4 text-sm">
        <span class="text-destructive">{m.home_load_error()}</span>
        <button
          type="button"
          onclick={() => query.refresh()}
          class="rounded px-2 py-1 text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          {m.home_retry()}
        </button>
      </div>
    {:else}
      {@render children()}
    {/if}
  </div>
</section>
