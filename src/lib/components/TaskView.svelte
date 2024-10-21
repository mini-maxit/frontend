<script lang="ts">
	import { onMount } from 'svelte';
	import { type Task } from './taskFile.svelte';
	let { task }: { task: Task } = $props();

	let pdfUrl: string | null = $state(null);

	onMount(() => {
        const blob = new Blob([task.doc.content], { type: 'application/pdf' });
        pdfUrl = URL.createObjectURL(blob);
	});
</script>

<div class="container">
	<div class="pdf-viewer">
		{#if pdfUrl}
			<iframe src={pdfUrl} title="PDF Viewer"> </iframe>
		{:else}
			<p>Loading PDF...</p>
		{/if}
	</div>

	<div class="inputs-outputs">
		<h2>Input Files</h2>
		{#each task.inOut.tasks as [input, output]}
			<div class="file-section">
				<h3>Input: {input.filepath}</h3>
				<pre>{input.content}</pre>
				<h3>Output: {output.filepath}</h3>
				<pre>{output.content}</pre>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		height: 100vh;
	}

	.pdf-viewer {
		flex: 1;
		border-right: 1px solid #ccc;
		overflow: auto;
	}

	.inputs-outputs {
		flex: 1;
		padding: 20px;
		overflow: auto;
	}

	iframe {
		width: 100%;
		height: 100%;
	}

	.file-section {
		margin-bottom: 20px;
	}

	h2 {
		margin-bottom: 10px;
	}
</style>
