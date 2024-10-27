<script lang="ts">
	import type { Task } from ".";
	import TaskView from "./TaskView.svelte";

    let { tasks }: { tasks: Task[]  } = $props();
</script>

{#each tasks as task}
    <TaskView {task} />
{/each}