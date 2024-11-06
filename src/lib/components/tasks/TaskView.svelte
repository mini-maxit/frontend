<script lang="ts">
	import { onMount } from 'svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as m from '$lib/paraglide/messages.js';

	let { task }: { task: {
		name: string;
	id: number;
	description: ArrayBuffer
	} } = $props();

	let pdfUrl: string | null = $state(null);

	onMount(() => {
		const taskBlob = new Blob([task.description], { type: 'application/pdf' });
		pdfUrl = URL.createObjectURL(taskBlob);
	});
</script>

<div class="container mb-12 flex flex-col flex-1">
	<h1 class="text-2xl font-bold my-4">{task.name}</h1>

	<div class="flex-1 flex overflow-hidden">
		<div class="w-1/2 p-4 border rounded-sm border-gray-800 overflow-hidden">
			{#if pdfUrl}
				<iframe src={pdfUrl} title="PDF Viewer" class="w-full h-full"></iframe>
			{:else}
				<p class="p-4">{m.loading()}</p>
			{/if}
		</div>

		<div class="w-1/2 p-4 overflow-hidden">

		</div>
	</div>
</div>
