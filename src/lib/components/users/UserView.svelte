<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { SubmissionData, UserData } from '$lib/backendSchemas';
	import * as Table from '$lib/components/ui/table';
	import Separator from '../ui/separator/separator.svelte';

	let { user, submissions }: { user: UserData; submissions: SubmissionData[] } = $props();
</script>

<Card.Root>
	<Card.Header class="text-xl pb-6 font-semibold">
		<h2>{user.name} {user.surname}</h2>
	</Card.Header>
	<Separator />
	<Card.Content>
		<div class="flex flex-row space-x-6">
			<div id="UserData">
				<div class="font-semibold mb-2 text-lg">Personal Information</div>
				<p>ID: {user.id}</p>
				<p>Email: {user.email}</p>
				<p>Username: {user.username}</p>
				<p>Role: {user.role}</p>
			</div>
			<Separator orientation="vertical" />
			<div id="UserSubmissions">
				<!-- <Table.Root>
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
                </Table.Root>                 -->
			</div>
		</div>
	</Card.Content>
	{#if user.role == 'admin'}
		<Card.Footer>
			<a href={`/dashboard/users/${user.id}/edit`}>Edit</a>
		</Card.Footer>
	{/if}
</Card.Root>
