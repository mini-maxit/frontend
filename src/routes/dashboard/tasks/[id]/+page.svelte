<script lang="ts">
	import TaskView from '$lib/components/tasks/TaskView.svelte';
	import { clientSideBase64ToBlob } from '$lib/utils';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	const task = {
		...data.task,
		doc: {
			...data.task.doc,
			content: clientSideBase64ToBlob(data.task.doc.contentBase64, 'application/pdf')
		}
	};
</script>

<TaskView {task} />
