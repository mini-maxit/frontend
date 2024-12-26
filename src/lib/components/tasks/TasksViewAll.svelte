<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as m from '$lib/paraglide/messages.js';

	interface TaskListItem {
		id: number;
		title: string;
		created_at: string;
		created_by: number;
	}

	let { tasks }: { tasks: TaskListItem[] } = $props();
</script>

<Table.Root>
	<Table.Caption>{m.tasks_table_title()}</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>{m.task_id()}</Table.Head>
			<Table.Head>{m.task_name()}</Table.Head>
			<Table.Head>{m.task_link()}</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each tasks as task}
			<Table.Row>
				<Table.Cell>{task.id}</Table.Cell>
				<Table.Cell>{task.title}</Table.Cell>
				<Table.Cell>
					<a href={`/dashboard/tasks/${task.id}`} class="hover:underline">{m.task_link_text()}</a>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
