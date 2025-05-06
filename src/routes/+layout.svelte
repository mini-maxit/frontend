<script lang="ts">
	import '../app.css';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { Toaster } from '$components/ui/sonner/index.js';
	import Header from '$components/Header.svelte';
	import type { UserData } from '$lib/backendSchemas';
	let { children, data } = $props();

	let localUser = $derived(data.localUser);
</script>

<ParaglideJS {i18n}>
	<Toaster richColors />
	<main class="min-h-screen w-full flex flex-col">
		<Header {localUser} />
		{@render children?.()}
	</main>
</ParaglideJS>
