<script lang="ts">
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import FlagGb4x3 from '~icons/flag/gb-4x3';
	import FlagPl4x3 from '~icons/flag/pl-4x3';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
</script>

<div class="absolute right-2">
	<button onclick={() => switchToLanguage('en')}><FlagGb4x3 /></button>
	<button onclick={() => switchToLanguage('pl')}><FlagPl4x3 /></button>
</div>
