<script lang="ts">
  import { clientLogout } from '$lib/auth/client-logout';
  import { browser } from '$app/environment';
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
  let isLoading = $state(false);

  async function handleLogout() {
    if (!browser) return;

    isLoading = true;
    try {
      await clientLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // clientLogout handles navigation
    } finally {
      isLoading = false;
    }
  }
</script>

<button type="button" onclick={handleLogout} disabled={isLoading} class={className}>
  {#if children}
    {@render children()}
  {:else}
    {isLoading ? 'Logging out...' : 'Logout'}
  {/if}
</button>
