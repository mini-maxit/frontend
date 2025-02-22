<script lang="ts">
	import Logo from './Logo.svelte';
	import Button from './ui/button/button.svelte';
	import ChangeLanguage from './ChangeLanguage.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
</script>

<header class="z-50 sticky top-0 flex items-center justify-center p-4 bg-white shadow-md">
	<Logo />
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
