<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { SubmissionData, UserData } from '$lib/backendSchemas';
	import * as Table from '$lib/components/ui/table';
	import Separator from '../ui/separator/separator.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import EditUserDialog from './EditUserDialog.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { EditUserSchema } from './formSchemas';

	let {
		user,
		submissions,
		localUser,
		editUserForm
	}: {
		user: UserData;
		submissions: SubmissionData[];
		localUser: UserData;
		editUserForm: SuperValidated<Infer<EditUserSchema>>;
	} = $props();

	function get_status_color(status: string) {
		switch (status) {
			case 'received':
				return 'bg-white';
			case 'sent for evaluation':
				return 'bg-blue-200';
			case 'evaluated':
				return 'bg-green-200';
			case 'lost':
				return 'bg-red-200';
			default:
				return 'bg-gray-200';
		}
	}
</script>

<Card.Root>
	<Card.Header class="text-xl pb-6 flex flex-row justify-between items-center">
		<h2>{user.name} {user.surname}</h2>
		{#if localUser.role == 'admin' || localUser.id == user.id}
			<EditUserDialog {user} {editUserForm} />
		{/if}
	</Card.Header>
	<Separator />
	<Card.Content>
		<div class="flex flex-row space-x-6">
			<div id="UserData" class="flex-shrink-0">
				<div class="font-semibold mb-2 text-lg">Personal Information</div>
				<p>ID: {user.id}</p>
				<p>Email: {user.email}</p>
				<p>Username: {user.username}</p>
				<p>Role: {user.role}</p>
			</div>
			<Separator orientation="vertical" />
			<div id="UserSubmissions" class="flex-grow">
				<Table.Root>
					<Table.Caption>{m.user_submissions_table_title()}</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head>{m.user_submissions_task_link_label()}</Table.Head>
							<Table.Head>{m.user_submissions_programming_language_label()}</Table.Head>
							<Table.Head>{m.user_submissions_submitted_at_label()}</Table.Head>
							<Table.Head>{m.user_submissions_status_label()}</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each submissions as submission}
							<Table.Row>
								<Table.Cell
									><a href={`/dashboard/tasks/${submission.task.id}`} class="hover:underline"
										>{submission.task.title}</a
									></Table.Cell
								>
								<Table.Cell>{submission.language.language}</Table.Cell>
								{@const formatted_date = new Date(submission.submitted_at).toLocaleString()}
								<Table.Cell>{formatted_date}</Table.Cell>
								{@const status_color = get_status_color(submission.status)}
								<Table.Cell class={status_color}>{submission.status}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	</Card.Content>
</Card.Root>
