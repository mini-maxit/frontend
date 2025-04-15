<script lang="ts">
	import type { TaskData } from '$lib/backendSchemas';
	import * as Table from '$components/ui/table';
	import * as m from '$lib/paraglide/messages.js';
	import Button from '$components/ui/button/button.svelte';

	let { tasks }: { tasks: TaskData[] } = $props();
</script>

<Table.Root>
	<Table.Caption>{m.tasks_table_title()}</Table.Caption>
	<Table.Header>
		<Button
			class="hidden lg:flex absolute right-2 mt-1.5"
			size="sm"
			variant="outline"
			href="/dashboard/tasks/new"
		>
			Dodaj nowe zadanie
		</Button>
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
