<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { LayoutServerData } from './$types';

	let { data }: { data: LayoutServerData } = $props();
</script>

<div class="flex flex-1 items-center justify-center bg-gray-100">
	<div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
		<h1 class="text-2xl font-semibold text-gray-700 mb-4">{m.hi()} {data.user.username}!</h1>
		<p class="text-gray-600 mb-6">
			{m.your_user_id()} <span class="font-medium text-gray-800">{data.user.id}</span>.
		</p>
		<form method="post" action="?/logout" use:enhance>
			<Button class="w-full bg-red-600 rounded-lg hover:bg-red-700" type="submit"
				>{m.logout()}</Button
			>
		</form>
		<Button class="w-full mt-4 bg-blue-600 rounded-lg hover:bg-blue-700" href="/dashboard/tasks">
			{m.view_tasks()}
		</Button>
		<Button
			class="w-full mt-4 bg-green-600 rounded-lg hover:bg-green-700"
			href="/dashboard/tasks/new"
		>
			{m.add_task()}
		</Button>
	</div>
</div>
