<script lang="ts">
	import UploadTaskSolution from '$components/tasks/solutions/UploadSolution.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { type UploadTaskSolutionSchema } from './solutions/formSchema';
	import {
		UserRole,
		type GroupData,
		type LanguageConfig,
		type TaskData,
		type UserData
	} from '$lib/backendSchemas';
	import EditTaskDialog from './EditTaskDialog.svelte';
	import type { AssingTaskToGroupsSchema, EditTaskSchema } from './formSchemas';

	let {
		localUser,
		task,
		uploadSolutionForm,
		editTaskForm,
		assingTaskToGroupsForm,
		userGroups,
		availableLanguages
	}: {
		localUser: UserData;
		task: Omit<TaskData, 'description_url'> & {
			description_file: Promise<ArrayBuffer>;
		};
		editTaskForm: SuperValidated<Infer<EditTaskSchema>>;
		assingTaskToGroupsForm: SuperValidated<Infer<AssingTaskToGroupsSchema>>;
		uploadSolutionForm: SuperValidated<Infer<UploadTaskSolutionSchema>>;
		userGroups: GroupData[];
		availableLanguages: LanguageConfig[];
	} = $props();

	const uploadSolutionData = {
		form: uploadSolutionForm,
		task_id: task.id,
		availableLanguages: availableLanguages
	};

	function isAllowedToEdit() {
		return (
			(localUser.role === UserRole.Teacher && task.created_by === localUser.id) ||
			localUser.role === UserRole.Admin
		);
	}
</script>

<div class="container mb-12 flex flex-col flex-1">
	<div class="flex justify-between p-4 items-center">
		<h1 class="text-2xl font-bold my-4">{task.title}</h1>
		{#if isAllowedToEdit()}
			<EditTaskDialog taskData={task} {editTaskForm} {assingTaskToGroupsForm} {userGroups} />
		{/if}
	</div>
	<div class="flex-1 flex overflow-hidden">
		<div class="w-1/2 p-4 border rounded-sm border-gray-800 overflow-hidden">
			{#await task.description_file}
				<p class="p-4">{m.loading()}</p>
			{:then arrayBuffer}
				{@const pdfUrl = URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/pdf' }))}
				<iframe src={pdfUrl} title="PDF Viewer" class="w-full h-full"></iframe>
			{/await}
		</div>

		<div class="w-1/2 p-4 overflow-hidden">
			<UploadTaskSolution data={uploadSolutionData} />
		</div>
	</div>
</div>
