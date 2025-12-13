<script lang="ts">
  import AdminTaskCard from '$lib/components/dashboard/tasks/AdminTaskCard.svelte';
  import type { Task } from '$lib/dto/task';
  import type { DeleteTaskForm } from '$routes/dashboard/teacher/tasks/tasks.remote';

  interface TasksListProps {
    tasks: Task[];
    deleteTask: DeleteTaskForm;
  }

  let { tasks, deleteTask }: TasksListProps = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each tasks as task (task.id)}
    <AdminTaskCard {task} {deleteTask} />
  {/each}
</div>
