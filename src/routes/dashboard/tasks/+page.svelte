<script lang="ts">
	import TasksViewAll from '$lib/components/tasks/TasksViewAll.svelte';
	import { type TaskListItem } from '.';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	const tasks: TaskListItem[] = data.tasks;
</script>

<TasksViewAll {tasks} />
