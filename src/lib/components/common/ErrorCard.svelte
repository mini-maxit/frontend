<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import * as m from '$lib/paraglide/messages';

  interface ErrorCardProps {
    title: string;
    error?: Error | string | null;
    onRetry?: () => void;
    showIcon?: boolean;
    inCard?: boolean;
    iconBackground?: boolean;
    class?: string;
  }

  let {
    title,
    error,
    onRetry,
    showIcon = true,
    inCard = false,
    iconBackground = false,
    class: className = ''
  }: ErrorCardProps = $props();

  const errorMessage = $derived(
    typeof error === 'string' ? error : error?.message || m.error_unknown_error()
  );
</script>

{#if inCard}
  <div
    class="rounded-2xl border border-destructive/50 bg-destructive/5 text-card-foreground shadow-md {className}"
  >
    <div class="p-8">
      <div class="flex flex-col items-center gap-4 text-center">
        {#if showIcon}
          {#if iconBackground}
            <div class="rounded-full bg-destructive/10 p-3">
              <AlertCircle class="h-8 w-8 text-destructive" />
            </div>
          {:else}
            <AlertCircle class="h-8 w-8 text-destructive" />
          {/if}
        {/if}
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-foreground">
            {title}
          </h3>
          <p class="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        {#if onRetry}
          <Button onclick={onRetry} variant="outline" class="mt-2">
            {m.error_try_again()}
          </Button>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div
    class="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-12 text-center {className}"
  >
    {#if showIcon}
      <AlertCircle class="h-12 w-12 text-destructive" />
    {/if}
    <p class="mt-4 text-lg font-medium text-destructive">{title}</p>
    <p class="mt-1 text-sm text-muted-foreground">
      {errorMessage}
    </p>
    {#if onRetry}
      <Button variant="outline" class="mt-4" onclick={onRetry}>
        {m.error_try_again()}
      </Button>
    {/if}
  </div>
{/if}
