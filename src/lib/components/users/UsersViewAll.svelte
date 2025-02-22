<script lang="ts">
	import * as Table from '$components/ui/table';
	import * as m from '$lib/paraglide/messages.js';
	import type { UserData } from '$lib/backendSchemas';

	let { users }: { users: UserData[] } = $props();
</script>

<Table.Root>
	<Table.Caption>{m.users_table_title()}</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>{m.user_id()}</Table.Head>
			<Table.Head>{m.user_username()}</Table.Head>
			<Table.Head>{m.user_email()}</Table.Head>
			<Table.Head>{m.user_fullname()}</Table.Head>
			<Table.Head>{m.user_link()}</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each users as user}
			<Table.Row>
				<Table.Cell>{user.id}</Table.Cell>
				<Table.Cell>{user.username}</Table.Cell>
				<Table.Cell>{user.email}</Table.Cell>
				<Table.Cell>{user.name} {user.surname}</Table.Cell>
				<Table.Cell>
					<a href={`/dashboard/users/${user.id}`} class="hover:underline">{m.user_link_text()}</a>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
