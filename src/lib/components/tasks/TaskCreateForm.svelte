<script lang="ts">
	import * as Form from '$components/ui/form';
	import Label from '$components/ui/label/label.svelte';
	import { Input } from '$components/ui/input';
	import { createTaskSchema, type CreateTaskSchema } from './formSchemas';
	import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as m from '$lib/paraglide/messages.js';

	let { data, userId }: { data: SuperValidated<Infer<CreateTaskSchema>>; userId: number } =
		$props();

	const form = superForm(data, {
		validators: zodClient(createTaskSchema)
	});

	const { form: formData, message, enhance } = form;

	$formData.userId = userId;

	const file = fileProxy(form, 'archive');
</script>

<form enctype="multipart/form-data" method="POST" use:enhance>
	<h2 class="font-semibold mb-2">
		{m.task_form_title()}
	</h2>
	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.task_form_title_input_label()}</Form.Label>
				<Input {...props} bind:value={$formData.title} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="userId" hidden>
		<Form.Control>
			{#snippet children({ props })}
				\ <Input type="number" {...props} bind:value={$formData.userId} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="archive">
		<Form.Control>
			{#snippet children({ props })}
				<Label for="archive">{m.task_form_task_file_label()}</Label>
				<input
					{...props}
					id="archive"
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
	{#if $message}
		<div class="mt-4 text-red-500">{$message}</div>
	{/if}
</form>
