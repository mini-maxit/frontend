<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Input } from '$lib/components/ui/input';
	import { uploadTaskSchema, type UploadTaskSchema } from './formSchema';
	import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as m from '$lib/paraglide/messages.js';

	let { data }: { data: SuperValidated<Infer<UploadTaskSchema>> } = $props();

	const form = superForm(data, {
		validators: zodClient(uploadTaskSchema)
	});

	const { form: formData, enhance } = form;

	const file = fileProxy(form, 'taskFile');
</script>

<form enctype="multipart/form-data" method="POST" use:enhance>
	<Form.Field {form} name="taskName">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.task_form_task_name_label()}</Form.Label>
				<Input {...props} bind:value={$formData.taskName} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="taskFile">
		<Form.Control>
			{#snippet children({ props })}
				<Label for="taskFile">{m.task_form_task_file_label()}</Label>
				<input
					{...props}
					id="taskFile"
					type="file"
					class={'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'}
					bind:files={$file}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description>{m.task_form_task_file_description()}</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="mt-4">{m.task_form_submit()}</Form.Button>
</form>
