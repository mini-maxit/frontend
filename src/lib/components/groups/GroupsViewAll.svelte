<script lang="ts">
	import * as Table from '$components/ui/table';
	import * as m from '$lib/paraglide/messages.js';
	import type { GroupData } from '$lib/backendSchemas';

	let { groups }: { groups: GroupData[] } = $props();
</script>

<Table.Root>
	<Table.Caption>{m.groups_table_title()}</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>{m.groups_table_group_id()}</Table.Head>
			<Table.Head>{m.groups_table_group_name()}</Table.Head>
			<Table.Head>{m.groups_table_group_link()}</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each groups as group}
			<Table.Row>
				<Table.Cell>{group.id}</Table.Cell>
				<Table.Cell>{group.name}</Table.Cell>
				<Table.Cell>
					<a href={`/dashboard/groups/${group.id}`} class="hover:underline"
						>{m.groups_table_group_link_text()}</a
					>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
