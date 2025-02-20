<script lang="ts">
	import TaskAllSubmissionsView from '$lib/components/tasks/submissions/TaskAllSubmissionsView.svelte';
	import type { PageServerData } from './$types';

	let { data }: PageServerData = $props();
</script>

<TaskAllSubmissionsView submissions={data.submissionData} />
