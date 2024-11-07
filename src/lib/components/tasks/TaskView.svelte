<script lang="ts">
	import { onMount } from 'svelte';
	import UploadTaskSolution from '$lib/components/tasks/solutions/UploadSolution.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { type UploadTaskSolutionSchema } from './solutions/formSchema';

	let {
		data
	}: {
		data: {
			task: {
				name: string;
				id: number;
				description: ArrayBuffer;
			};
			uploadSolutionForm: SuperValidated<Infer<UploadTaskSolutionSchema>>;
		};
	} = $props();

	let pdfUrl: string | null = $state(null);

	onMount(() => {
		const taskBlob = new Blob([data.task.description], { type: 'application/pdf' });
		pdfUrl = URL.createObjectURL(taskBlob);
	});

	const uploadSolutionData = {
		form: data.uploadSolutionForm,
		task_id: data.task.id
	};
</script>

<div class="container mb-12 flex flex-col flex-1">
	<h1 class="text-2xl font-bold my-4">{data.task.name}</h1>

	<div class="flex-1 flex overflow-hidden">
		<div class="w-1/2 p-4 border rounded-sm border-gray-800 overflow-hidden">
			{#if pdfUrl}
				<iframe src={pdfUrl} title="PDF Viewer" class="w-full h-full"></iframe>
			{:else}
				<p class="p-4">{m.loading()}</p>
			{/if}
		</div>

		<div class="w-1/2 p-4 overflow-hidden">
			<UploadTaskSolution data={uploadSolutionData} />
		</div>
	</div>
</div>
