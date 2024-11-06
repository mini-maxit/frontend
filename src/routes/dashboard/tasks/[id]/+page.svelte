<script lang="ts">
	import TaskView from '$lib/components/tasks/TaskView.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

</script>

<TaskView task={data.task} />
