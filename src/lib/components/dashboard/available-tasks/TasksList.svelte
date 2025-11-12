<script lang="ts">
  import TaskCard from './TaskCard.svelte';
  import type { Task } from '$lib/dto/task';

  interface Props {
    tasks: Task[];
  }

  let { tasks }: Props = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each tasks as task (task.id)}
    <TaskCard {task} />
  {/each}
</div>
