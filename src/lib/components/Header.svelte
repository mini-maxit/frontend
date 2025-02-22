<script lang="ts">
	import Button from './ui/button/button.svelte';
	import ChangeLanguage from './ChangeLanguage.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import maxitLogo from '/MaxitLogo.svg';
</script>

<header class="z-50 sticky top-0 flex items-center justify-center bg-white shadow-md">
	<a href="/">
		<img src={maxitLogo} alt="Maxit Logo" class="h-16 w-16" />
	</a>
	<div class="flex items-center justify-center absolute right-2">
		<ChangeLanguage />
		<Button
			href="/dashboard"
			size="lg"
			class="bg-neutral-700 hover:bg-neutral-800 transition-colors duration-150"
			>{m.dashboard_header_button()}</Button
		>
	</div>
</header>
