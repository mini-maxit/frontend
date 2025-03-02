<script lang="ts">
	import type { SubmissionData } from '$lib/backendSchemas';
	import * as Table from '$components/ui/table';
	import * as m from '$lib/paraglide/messages.js';
	import {
		get_submission_passed_color,
		get_submission_passed_text,
		get_submission_status_color
	} from '$lib';

	let { submissions }: { submissions: SubmissionData[] } = $props();
</script>

<Table.Root>
	<Table.Caption>{m.submissions_table_title()}</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>{m.submissions_user_link_label()}</Table.Head>
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
					><a href={`/dashboard/users/${submission.user.id}`} class="hover:underline"
						>{submission.user.username}</a
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
