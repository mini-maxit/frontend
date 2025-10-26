<script lang="ts">
  import Loader from '@lucide/svelte/icons/loader-circle';

  interface LoadingSpinnerProps {
    message?: string;
    size?: string;
    inCard?: boolean;
    class?: string;
  }

  let {
    message,
    size = 'h-8 w-8',
    inCard = false,
    class: className = ''
  }: LoadingSpinnerProps = $props();
</script>

{#if inCard}
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
