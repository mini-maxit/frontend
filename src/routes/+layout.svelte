<script lang="ts">
	import '../app.css';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<main class="min-h-screen w-full flex flex-col">
		<Header />
		{@render children()}
	</main>
</ParaglideJS>
