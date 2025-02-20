<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { SubmissionData, SubmissionResultData, UserData } from '$lib/backendSchemas';
	import * as Table from '$lib/components/ui/table';
	import Separator from '../ui/separator/separator.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import EditUserDialog from './EditUserDialog.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { EditUserSchema } from './formSchemas';
	import {
		get_submission_passed_color,
		get_submission_passed_text,
		get_submission_status_color
	} from '$lib';

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
</script>

<Card.Root>
	<Card.Header class="pb-6  flex-row justify-between items-center">
		<div id="UserData" class="flex flex-row space-x-8">
			<h2 class="font-semibold text-xl">{m.profile_information()}:</h2>

			<div>
				<p>ID: {user.id}</p>
				<p>Email: {user.email}</p>
				<p>{m.role()}: {user.role}</p>
			</div>
			<Separator orientation="vertical" />
			<div>
				<p>{m.username()}: {user.username}</p>
				<p>{m.user_first_name()}: {user.name}</p>
				<p>{m.user_last_name()}: {user.surname}</p>
			</div>
		</div>
		{#if localUser.id == user.id}
			<EditUserDialog {user} {editUserForm} />
		{/if}
	</Card.Header>
	<Separator />
	<Card.Content>
		<div class="xl:flex xl:space-x-6 space-y-8">
			<div id="UserSubmissions" class="flex-grow">
				<Table.Root>
					<Table.Caption>{m.submissions_table_title()}</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head>{m.submissions_task_link_label()}</Table.Head>
							<Table.Head>{m.submissions_task_submission_result_label()}</Table.Head>
							<Table.Head>{m.submissions_programming_language_label()}</Table.Head>
							<Table.Head>{m.submissions_submitted_at_label()}</Table.Head>
							<Table.Head>{m.submissions_status_label()}</Table.Head>
							<Table.Head>{m.submissions_passed_label()}</Table.Head>
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
								<Table.Cell>
									<a
										href={`/dashboard/tasks/${submission.task.id}/submissions/${submission.id}`}
										class="hover:underline">{m.submissions_task_submission_result_description()}</a
									></Table.Cell
								>
								<Table.Cell>{submission.language.language}</Table.Cell>
								<Table.Cell>
									{new Date(submission.submitted_at).toLocaleString()}
								</Table.Cell>
								<Table.Cell class={get_submission_status_color(submission.status)}
									>{submission.status}</Table.Cell
								>
								<Table.Cell class={get_submission_passed_color(submission.result)}
									>{get_submission_passed_text(submission.result)}</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	</Card.Content>
</Card.Root>
