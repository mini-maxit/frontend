<script lang="ts">
	import * as Form from '$components/ui/form';
	import Label from '$components/ui/label/label.svelte';
	import { uploadTaskSolutionSchema, type UploadTaskSolutionSchema } from './formSchema';
	import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as m from '$lib/paraglide/messages.js';
	import { ScrollArea } from '$components/ui/scroll-area/index.js';
	import Input from '$components/ui/input/input.svelte';
	import type { LanguageConfig } from '$lib/backendSchemas';
	import { toast } from 'svelte-sonner';

	let {
		data
	}: {
		data: {
			form: SuperValidated<Infer<UploadTaskSolutionSchema>>;
			task_id: number;
			availableLanguages: LanguageConfig[];
		};
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(uploadTaskSolutionSchema),
		onUpdate({ result }) {
			if (result.type === 'success') {
				toast.success(m.toaster_task_form_submit_success());
			} else if (result.type === 'failure') {
				toast.error(m.error_unexpected_request_error_message());
			}
		}
	});

	const { form: formData, message, errors, enhance } = form;
	const file = fileProxy(form, 'file');
	$formData.id = data.task_id;

	let fileContentPromise = $derived($errors.file ? null : $file[0]?.text());
</script>

<form enctype="multipart/form-data" action="?/uploadSolution" method="POST" use:enhance>
	<Form.Field {form} name="file">
		<Form.Control>
			{#snippet children({ props })}
				<Label for="file">{m.task_form_task_file_label()}</Label>
				<input
					{...props}
					id="file"
					type="file"
					class={'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'}
					bind:files={$file}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description>{m.task_form_task_file_description()}</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="languageId">
		<Form.Control>
			{#snippet children({ props })}
				<Label for="languageID">{m.task_form_task_language_label()}</Label>
				<select
					{...props}
					id="languageID"
					class={'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'}
					bind:value={$formData.languageId}
				>
					{#each data.availableLanguages as lang}
						<option value={lang.id}>{lang.language} {lang.version}</option>
					{/each}
				</select>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} hidden name="id">
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} type="number" id="id" bind:value={$formData.id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="mt-4">{m.task_form_submit()}</Form.Button>
	{#if $message}
		<div class="mt-4 text-red-500">{$message}</div>
	{/if}
</form>

{#await fileContentPromise}
	<div class="mt-4">Loading...</div>
{:then content}
	{#if content}
		<div class="mt-4">
			<ScrollArea class="h-[400px]">
				<pre class="bg-gray-100 p-4 rounded-lg">{content}</pre>
			</ScrollArea>
		</div>
	{/if}
{:catch error}
	<div class="mt-4 text-red-500">Error loading file: {error.message}</div>
{/await}
