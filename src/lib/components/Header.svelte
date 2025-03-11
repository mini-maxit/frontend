<script lang="ts">
	import Button from './ui/button/button.svelte';
	import ChangeLanguage from './ChangeLanguage.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<header class="z-50 sticky top-0 flex items-center justify-center bg-white shadow-md">
	<Button
		href="/dashboard"
		size="lg"
		class="bg-neutral-700 hover:bg-neutral-800 transition-colors duration-150 absolute left-2"
		>{m.dashboard_header_button()}</Button
	>
	<a href="/">
		<img src="/MaxitLogo.svg" alt="Maxit Logo" class="h-16 w-16" />
	</a>
	<ChangeLanguage />
</header>
