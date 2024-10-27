<script lang="ts">
	import type { Task } from "$lib/components/tasks";
    import TaskUpload from "$lib/components/tasks/TaskUpload.svelte";
	import type { LayoutServerData } from "../$types";

    let { data }: { data: LayoutServerData } = $props();
    let task: Task | null = $state(null);

</script>

<TaskUpload userId={data.user.id} onTaskUploaded={() => {
    task 
}} />