<script lang="ts">
  import type { Component } from 'svelte';

  interface EmptyStateProps {
    /** Title text to display */
    title: string;
    /** Optional description text */
    description?: string;
    /** Lucide icon component to display */
    icon: Component<any>;
    /** Size of the icon (default: 'h-12 w-12') */
    iconSize?: string;
    /** Whether to wrap in a Card component */
    card?: boolean;
    /** Whether to show icon in a rounded background (requires card=true) */
    iconBackground?: boolean;
    /** Additional CSS classes for the container */
    class?: string;
  }

  let {
    title,
    description,
    icon: Icon,
    iconSize = 'h-12 w-12',
    card = false,
    iconBackground = false,
    class: className = ''
  }: EmptyStateProps = $props();
</script>

{#if card}
  <div class="rounded-2xl border bg-card text-card-foreground shadow-md {className}">
    <div class="p-12">
      <div class="flex flex-col items-center gap-4 text-center">
        {#if iconBackground}
          <div class="rounded-full bg-muted p-4">
            <Icon class="{iconSize} text-muted-foreground" />
          </div>
        {:else}
          <Icon class="{iconSize} text-muted-foreground" />
        {/if}
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-foreground">
            {title}
          </h3>
          {#if description}
            <p class="text-sm text-muted-foreground">
              {description}
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-12 text-center {className}"
  >
    <Icon class="{iconSize} text-muted-foreground" />
    <p class="mt-4 text-lg font-medium text-foreground">{title}</p>
    {#if description}
      <p class="mt-1 text-sm text-muted-foreground">{description}</p>
    {/if}
  </div>
{/if}
