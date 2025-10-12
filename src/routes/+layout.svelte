<script lang="ts">
  import '../app.css';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import favicon from '$lib/assets/favicon.svg';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Toaster />

<Header />
<main class="min-h-screen">
  {@render children?.()}
</main>
<Footer />
