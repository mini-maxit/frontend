<script lang="ts">
	import type { PageServerData } from './$types.js';
	import TaskForm from '$lib/components/tasks/TaskForm.svelte';
	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex-1 flex items-center justify-center bg-gray-100">
	<div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
		<TaskForm data={data.form} />
	</div>
</div>
