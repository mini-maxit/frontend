<script lang="ts">
	import { onMount } from 'svelte';
	import { type Task } from '.';
	let { task }: { task: Task } = $props();

	let pdfUrl: string | null = $state(null);

	onMount(() => {
		pdfUrl = URL.createObjectURL(task.doc.content);
	});
</script>

<div class="container flex h-screen">
	<div class="pdf-viewer flex-1 border-r border-gray-300 overflow-auto">
		{#if pdfUrl}
			<iframe src={pdfUrl} title="PDF Viewer" class="w-full h-full"></iframe>
		{:else}
			<p>Loading PDF...</p>
		{/if}
	</div>

	<div class="inputs-outputs flex-1 p-5 overflow-auto">
		<h2 class="text-xl font-semibold mb-4">Input Files</h2>
		{#each task.inOut.tasks as [input, output]}
			<div class="file-section mb-5">
				<h3 class="font-medium text-lg">Input: {input.filepath}</h3>
				<pre class="bg-gray-100 p-2 rounded">{input.content}</pre>
				<h3 class="font-medium text-lg mt-4">Output: {output.filepath}</h3>
				<pre class="bg-gray-100 p-2 rounded">{output.content}</pre>
			</div>
		{/each}
	</div>
</div>
