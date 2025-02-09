<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
	import { editTaskSchema, type EditTaskSchema } from './formSchema';
	import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as m from '$lib/paraglide/messages.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { LanguageConfig } from '$lib/backendSchemas';
	import { writable } from 'svelte/store';

	let {
		data
	}: {
		data: {
			form: SuperValidated<Infer<EditTaskSchema>>;
			task: { name: string; id: number };
			availableLanguages: LanguageConfig[];
		};
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(editTaskSchema),
		dataType: 'json'
	});

	const { form: formData, message, enhance } = form;
	const archive = fileProxy(form, 'archive');
	$formData.id = data.task.id;
	$formData.name = data.task.name;

	// Store for selected languages
	const selectedLanguages = writable<LanguageConfig[]>([]);

	// Handle drag start
	function handleDragStart(event: DragEvent, lang: LanguageConfig) {
		event.dataTransfer?.setData('text/plain', JSON.stringify(lang));
	}

	// Handle drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const langData = event.dataTransfer?.getData('text/plain');
		if (langData) {
			const lang: LanguageConfig = JSON.parse(langData);
			selectedLanguages.update((langs) => {
				if (!langs.some((l) => l.id === lang.id)) {
					langs.push(lang);
				}
				return langs;
			});
			$formData.languages = $selectedLanguages.map((l) => l.id);
		}
	}

	// Remove a language
	function removeLanguage(langId: number) {
		selectedLanguages.update((langs) => langs.filter((l) => l.id !== langId));
		$formData.languages = $selectedLanguages.map((l) => l.id);
	}

	// Prevent default behavior to allow dropping
	function allowDrop(event: DragEvent) {
		event.preventDefault();
	}
</script>

<form enctype="multipart/form-data" method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control>
			<Label for="name">Change task name</Label>
			<Input type="text" id="name" bind:value={$formData.name} placeholder={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<!-- Language Selection (Drag Source) -->
	<div class="flex flex-wrap gap-2">
		{#each data.availableLanguages as lang}
			<div
				class="draggable"
				draggable="true"
				on:dragstart={(event) => handleDragStart(event, lang)}
			>
				{lang.language}
				{lang.version}
			</div>
		{/each}
	</div>

	<!-- Drop Target -->
	<div class="dropzone mt-4" on:dragover={allowDrop} on:drop={handleDrop}>
		{#if $selectedLanguages.length > 0}
			<ul>
				{#each $selectedLanguages as lang}
					<li class="text-green-600">
						{lang.language}
						{lang.version}
						<button type="button" on:click={() => removeLanguage(lang.id)} class="ml-2 text-red-500"
							>✖</button
						>
					</li>
				{/each}
			</ul>
		{:else}
			<span class="text-gray-500">Drop languages here</span>
		{/if}
	</div>

	<!-- Hidden field for storing selected languages -->
	<Form.Field {form} hidden name="languages">
		<Form.Control>
			<Input type="text" id="languages" bind:value={$formData.languages} readonly />
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="archive">
		<Form.Control>
			<Label for="file">Replace task archive</Label>
			<input
				type="file"
				id="file"
				class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				bind:files={$archive}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="mt-4">{m.task_form_submit()}</Form.Button>
	{#if $message}
		<div class="mt-4 text-red-500">{$message}</div>
	{/if}
</form>

<style>
	.draggable {
		cursor: grab;
		background: #f3f3f3;
		border: 1px solid #ccc;
		padding: 8px;
		margin: 4px;
		border-radius: 4px;
		display: inline-block;
	}
	.dropzone {
		min-height: 50px;
		border: 2px dashed #999;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
