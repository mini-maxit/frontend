<script lang="ts">
	import TaskAllSubmissionsView from '$components/tasks/submissions/TaskAllSubmissionsView.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<TaskAllSubmissionsView submissions={data.submissions} />
