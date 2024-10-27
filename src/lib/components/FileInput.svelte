<script lang="ts">
	import { loadTask } from './tasks/taskFile.svelte';

	let { updateTask }: { updateTask: (task: any) => void } = $props();

	let errorMessage = $state('');
	let successMessage = $state('');
	async function handleFileUpload(e: Event) {
		errorMessage = '';
		successMessage = '';

		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file || !file.name.endsWith('.zip')) {
			errorMessage = 'Proszę przesłać plik w formacie .zip';
			return;
		}

		try {
			updateTask(await loadTask(file));
		} catch (error) {
			errorMessage = 'Wystąpił błąd podczas przetwarzania pliku .zip' + error;
		}
		target.value = '';
	}
</script>

<div>
	<input type="file" onchange={handleFileUpload} accept=".zip" />
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	{#if successMessage}
		<p class="success">{successMessage}</p>
	{/if}
</div>

<style>
	.error {
		color: red;
	}
	.success {
		color: green;
	}
</style>
