<script lang="ts">
	import type { GroupData, TaskData, UserData } from '$lib/backendSchemas';
	import * as AlertDialog from '$components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { fileProxy, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import {
		assignTaskToGroupsSchema,
		editTaskSchema,
		type AssingTaskToGroupsSchema,
		type EditTaskSchema
	} from './formSchemas';
	import * as Form from '$components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from '../ui/input/input.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import Label from '../ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	let {
		taskData,
		userGroups,
		editTaskForm,
		assingTaskToGroupsForm
	}: {
		taskData: Omit<TaskData, 'description_url'>;
		userGroups: GroupData[];
		editTaskForm: SuperValidated<Infer<EditTaskSchema>>;
		assingTaskToGroupsForm: SuperValidated<Infer<AssingTaskToGroupsSchema>>;
	} = $props();

	const editForm = superForm(editTaskForm, {
		validators: zodClient(editTaskSchema),
		resetForm: false,
		onResult: ({ result: { type } }) => {
			if (type === 'success') {
				open = false;
				location.reload();
			}
		}
	});

	const assignToGroupsForm = superForm(assingTaskToGroupsForm, {
		validators: zodClient(assignTaskToGroupsSchema),
		resetForm: false,
		onResult: ({ result: { type } }) => {
			if (type === 'success') {
				open = false;
				location.reload();
			}
		}
	});

	const { form: editTaskFormData, message: editTaskMessage, enhance: editTaskEnhance } = editForm;
	const {
		form: assignToGroupsFormData,
		message: assignToGroupsMessage,
		enhance: assignToGroupsEnhance
	} = assignToGroupsForm;

	$editTaskFormData.id = taskData.id;
	$editTaskFormData.title = taskData.title;
	$editTaskFormData.archive = null;

	$assignToGroupsFormData.taskId = taskData.id;

	const file = fileProxy(editForm, 'archive');

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
				<form enctype="multipart/form-data" action="?/editTask" method="POST" use:editTaskEnhance>
					<Form.Field form={editForm} name="id" hidden>
						<Form.Control>
							{#snippet children({ props })}
								<Input type="number" {...props} bind:value={$editTaskFormData.id} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={editForm} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.edit_task_title_label()}</Form.Label>
								<Input {...props} bind:value={$editTaskFormData.title} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={editForm} name="archive">
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
					{#if $editTaskMessage}
						<p class="text-destructive my-2 text-sm font-medium">{$editTaskMessage}</p>
					{/if}
					<Separator class="my-4" />
					<div class="flex-row w-full">
						<div class="my-4">
							{m.edit_task_submit_description()}
						</div>
						<Form.Button type="submit">{m.edit_profile_submit()}</Form.Button>
					</div>
				</form>
				<Separator class="my-4" />
				<h2 class="font-semibold text-lg text-foreground">
					{m.task_assign_groups_form_title()}
				</h2>
				<form action="?/assignGroups" method="POST" use:assignToGroupsEnhance>
					<Form.Field form={assignToGroupsForm} name="taskId" hidden>
						<Form.Control>
							{#snippet children({ props })}
								<Input type="number" {...props} bind:value={$assignToGroupsFormData.taskId} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={assignToGroupsForm} name="groupIds" class="my-4">
						<Form.Control>
							{#snippet children({ props })}
								<Select.Root
									type="multiple"
									bind:value={$assignToGroupsFormData.groupIds}
									{...props}
								>
									<Select.Trigger class="w-[180px]">
										{m.task_assign_group_select_title()}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											{#each userGroups as userGroup}
												<Select.Item value={userGroup.id.toString()} label={userGroup.name}
													>{userGroup.name}</Select.Item
												>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					{#if $assignToGroupsMessage}
						<p class="text-destructive my-2 text-sm font-medium">{$assignToGroupsMessage}</p>
					{/if}
					<Form.Button type="submit">{m.task_assign_groups_submit()}</Form.Button>
				</form>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{m.cancel()}</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
