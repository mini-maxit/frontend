<script lang="ts">
  import AdminTaskCard from '$lib/components/dashboard/tasks/AdminTaskCard.svelte';
  import type { Task } from '$lib/dto/task';
  // TODO: Import DeleteTaskForm from legacy-form-types when it's added

  interface TasksListProps {
    tasks: Task[];
    deleteTask: any; // TODO: Use proper DeleteTaskForm type from legacy-form-types
  }

  let { tasks, deleteTask }: TasksListProps = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each tasks as task (task.id)}
    <AdminTaskCard {task} {deleteTask} />
  {/each}
</div>
