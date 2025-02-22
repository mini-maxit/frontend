<script lang="ts">
	import type { TaskData, UserData } from '$lib/backendSchemas';
	import * as AlertDialog from '$components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { fileProxy, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { editTaskSchema, type EditTaskSchema } from './formSchemas';
	import * as Form from '$components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from '../ui/input/input.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import Label from '../ui/label/label.svelte';

	let {
		localUser,
		taskData,
		editTaskForm
	}: {
		localUser: UserData;
		taskData: Omit<TaskData, 'description_url'>;
		editTaskForm: SuperValidated<Infer<EditTaskSchema>>;
	} = $props();

	const form = superForm(editTaskForm, {
		validators: zodClient(editTaskSchema),
		resetForm: false,
		onResult: ({ result: { type } }) => {
			if (type === 'success') {
				open = false;
				location.reload();
			}
		}
	});

	const { form: formData, message, enhance } = form;

	$formData.id = taskData.id;
	$formData.title = taskData.title;
	$formData.archive = null;

	const file = fileProxy(form, 'archive');

	let open = $state(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'outline', size: 'lg' })}>
		{m.edit_task_title()}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{m.edit_task_title()}</AlertDialog.Title>
			<AlertDialog.Description>
				<form enctype="multipart/form-data" action="?/editTask" method="POST" use:enhance>
					<Form.Field {form} name="id" hidden>
						<Form.Control>
							{#snippet children({ props })}
								<Input type="number" {...props} bind:value={$formData.id} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.edit_task_title_label()}</Form.Label>
								<Input {...props} bind:value={$formData.title} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="archive">
						<Form.Control>
							{#snippet children({ props })}
								<Label for="archive">{m.task_form_task_file_label()}</Label>
								<input
									{...props}
									id="archive"
									type="file"
									class={'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'}
									bind:files={$file}
								/>
							{/snippet}
						</Form.Control>
						<Form.Description>{m.task_form_task_file_description()}</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
					{#if $message}
						<p class="text-destructive my-2 text-sm font-medium">{$message}</p>
					{/if}
					<Separator class="my-4" />
					<div class="flex-row w-full">
						<div class="my-4">
							{m.edit_profile_password_change_description()}
						</div>
						<Form.Button type="submit">{m.edit_profile_submit()}</Form.Button>
					</div>
				</form>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{m.cancel()}</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
