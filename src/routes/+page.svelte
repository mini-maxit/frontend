<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="flex flex-1 items-center justify-center bg-gray-100">
	<div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
		<h1 class="text-2xl font-semibold text-gray-700 mb-4">{m.landing_page_hero_title()}</h1>
		<p class="text-gray-600 mb-6">
			{m.landing_page_hero_text_1()}
			<a href="/dashboard/login" class="text-blue-600 font-medium hover:underline"
				>{m.landing_page_hero_text_link()}</a
			>
			{m.landing_page_hero_text_2()}
		</p>
	</div>
</div>
