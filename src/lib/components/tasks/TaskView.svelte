<script lang="ts">
	import UploadTaskSolution from '$lib/components/tasks/solutions/UploadSolution.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { type UploadTaskSolutionSchema } from './solutions/formSchema';
	import type { LanguageConfig } from '$lib/backendSchemas';
	import Button from '$lib/components/ui/button/button.svelte';

	let {
		data
	}: {
		data: {
			task: {
				name: string;
				id: number;
				description: Promise<ArrayBuffer>;
			};
			uploadSolutionForm: SuperValidated<Infer<UploadTaskSolutionSchema>>;
			availableLanguages: LanguageConfig[];
		};
	} = $props();

	const uploadSolutionData = {
		form: data.uploadSolutionForm,
		task_id: data.task.id,
		availableLanguages: data.availableLanguages
	};
</script>

<div class="container mb-12 flex flex-col flex-1">
	<div class="flex justify-between p-4 items-center">
		<h1 class="text-2xl font-bold my-4">{data.task.name}</h1>
		<!--todo-->
		<Button href="/dashboard/tasks/{data.task.id}/edit" class="mb-4">Edit</Button>
	</div>
	<div class="flex-1 flex overflow-hidden">
		<div class="w-1/2 p-4 border rounded-sm border-gray-800 overflow-hidden">
			{#await data.task.description}
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
