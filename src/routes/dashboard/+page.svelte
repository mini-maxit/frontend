<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
		<h1 class="text-2xl font-semibold text-gray-700 mb-4">Hi, {data.user.username}!</h1>
		<p class="text-gray-600 mb-6">
			Your user ID is <span class="font-medium text-gray-800">{data.user.id}</span>.
		</p>
		<form method="post" action="?/logout" use:enhance>
			<button
				class="w-full py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
			>
				Sign out
			</button>
		</form>
	</div>
</div>
