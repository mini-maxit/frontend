<script lang="ts">
	import TasksViewAll from '$components/tasks/TasksViewAll.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<TasksViewAll tasks={data.tasks} />
