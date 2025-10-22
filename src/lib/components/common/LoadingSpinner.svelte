<script lang="ts">
  import Loader from '@lucide/svelte/icons/loader-circle';

  interface LoadingSpinnerProps {
    /** Optional loading message to display below the spinner */
    message?: string;
    /** Size of the spinner icon (default: 'h-8 w-8') */
    size?: string;
    /** Whether to wrap in a Card component */
    card?: boolean;
    /** Additional CSS classes for the container */
    class?: string;
  }

  let {
    message,
    size = 'h-8 w-8',
    card = false,
    class: className = ''
  }: LoadingSpinnerProps = $props();
</script>

{#if card}
  <div class="rounded-2xl border bg-card text-card-foreground shadow-md">
    <div class="flex items-center justify-center p-12 {className}">
      <div class="flex flex-col items-center gap-4 text-center">
        <Loader class="{size} animate-spin text-primary" />
        {#if message}
          <p class="text-lg font-medium text-muted-foreground">
            {message}
          </p>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center py-12 {className}">
    {#if message}
      <div class="flex flex-col items-center space-y-4">
        <Loader class="{size} animate-spin text-primary" />
        <p class="text-sm text-muted-foreground">{message}</p>
      </div>
    {:else}
      <Loader class="{size} animate-spin text-primary" />
    {/if}
  </div>
{/if}
