<script lang="ts">
	import UploadTaskSolution from '$lib/components/tasks/solutions/UploadSolution.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { LanguageConfig } from '$lib/backendSchemas';
	import { editTaskSchema, type EditTaskSchema } from '$lib/components/tasks/formSchema';
	import EditTaskView from '$lib/components/tasks/EditTaskView.svelte';

	let {
		data
	}: {
		data: {
			task: {
				name: string;
				id: number;
				description: Promise<ArrayBuffer>;
			};
			editTaskForm: SuperValidated<Infer<EditTaskSchema>>;
			availableLanguages: LanguageConfig[];
		};
	} = $props();

	const editTaskData = {
		form: data.editTaskForm,
		task: data.task,
		availableLanguages: data.availableLanguages
	};
</script>

<div class="container mb-12 flex flex-col flex-1 items-center">
	<div class="flex-1 flex flex-col items-center overflow-hidden">
		<div class="w-full p-4 overflow-hidden">
			<EditTaskView data={editTaskData} />
		</div>
		<div class="w-full h-[794px] p-4 border rounded-sm border-gray-800">
			{#await data.task.description}
				<p class="p-4">{m.loading()}</p>
			{:then arrayBuffer}
				{@const pdfUrl = URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/pdf' }))}
				<iframe src={pdfUrl} title="PDF Viewer" class="w-full h-full"></iframe>
			{/await}
		</div>
	</div>
</div>
