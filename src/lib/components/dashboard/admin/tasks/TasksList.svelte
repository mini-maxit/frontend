<script lang="ts">
  import AdminTaskCard from '$lib/components/dashboard/tasks/AdminTaskCard.svelte';
  import type { Task } from '$lib/dto/task';

  interface TasksListProps {
    tasks: Task[];
  }

  let { tasks }: TasksListProps = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each tasks as task (task.id)}
    <AdminTaskCard {task} />
  {/each}
</div>
