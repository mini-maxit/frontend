<script lang="ts">
	import TaskView from '$lib/components/TaskView.svelte';
	import FileInput from '$lib/components/FileInput.svelte';
	import { type Task } from '$lib/components/taskFile.svelte';
	let task: Task | null = $state(null);

	function updateTask(updatedTask: Task) {
		task = updatedTask;
	}
</script>

<FileInput {updateTask} />
{#if task}
	<TaskView {task} />
{/if}
