<script lang="ts">
	import type { GroupData, TaskData, UserData } from '$lib/backendSchemas';
	import * as Table from '$components/ui/table';
	import * as m from '$lib/paraglide/messages.js';

	let {
		group,
		groupTasks,
		groupUsers
	}: { group: GroupData; groupTasks: TaskData[]; groupUsers: UserData[] } = $props();
</script>

<div class="flex flex-row space-x-4 mx-8 mt-8">
	<Table.Root>
		<Table.Caption>{m.users_table_title()}</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>{m.user_id()}</Table.Head>
				<Table.Head>{m.user_email()}</Table.Head>
				<Table.Head>{m.user_fullname()}</Table.Head>
				<Table.Head>{m.user_link()}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each groupUsers as user}
				<Table.Row>
					<Table.Cell>{user.id}</Table.Cell>
					<Table.Cell>{user.name} {user.surname}</Table.Cell>
					<Table.Cell>
						<a href={`/dashboard/users/${user.id}`} class="hover:underline">{m.user_link_text()}</a>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

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
			{#each groupTasks as task}
				<Table.Row>
					<Table.Cell>{task.id}</Table.Cell>
					<Table.Cell>{task.title}</Table.Cell>
					<Table.Cell>
						<a href={`/dashboard/tasks/${task.id}`} class="hover:underline"
							>{m.groups_table_group_link_text()}</a
						>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
