<script lang="ts">
	import TaskView from '$components/tasks/TaskView.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	const { task, localUser, uploadSolutionForm, editTaskForm, availableLanguages } = data;
</script>

<TaskView {task} {localUser} {uploadSolutionForm} {editTaskForm} {availableLanguages} />
