<script lang="ts">
	import Logo from './Logo.svelte';
	import Link from './Link.svelte';
	import ChangeLanguage from './ChangeLanguage.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<header class="sticky top-0 flex items-center justify-center p-4 bg-white shadow-md">
	<Logo />
	<div class="flex items-center justify-center absolute right-2">
		<ChangeLanguage />
		<Link
			text={m.dashboard()}
			href="/dashboard"
			class="text-white bg-neutral-700 hover:bg-neutral-800 px-4 py-2 transition-colors duration-150"
		/>
	</div>
</header>
