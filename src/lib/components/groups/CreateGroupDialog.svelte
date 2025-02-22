<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { createGroupSchema, type CreateGroupSchema } from './formschema';
	import * as AlertDialog from '$components/ui/alert-dialog/index.js';
	import * as Form from '$components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from '$components/ui/input/input.svelte';
	import Label from '$components/ui/label/label.svelte';

	let { createGroupForm }: { createGroupForm: SuperValidated<Infer<CreateGroupSchema>> } = $props();

	const form = superForm(createGroupForm, {
		validators: zodClient(createGroupSchema),
		resetForm: false,
		onResult: ({ result: { type } }) => {
			open = type !== 'success';
		}
	});

	const { form: formData, message, enhance } = form;

	let open = $state(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger
		class="w-full mt-4 bg-green-600 rounded-lg hover:bg-green-700 h-10 p-2 text-white font-medium text-sm transition-colors duration-200"
	>
		{m.create_group()}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<form action="?/createGroup" method="POST" use:enhance>
			<AlertDialog.Header>
				<AlertDialog.Title>{m.group_form_title()}</AlertDialog.Title>
				<AlertDialog.Description>
					<Form.Field {form} name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Label>{m.group_form_name_label()}</Label>
								<Input {...props} bind:value={$formData.name} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					{#if $message}
						<p class="text-destructive my-2 text-sm font-medium">{$message}</p>
					{/if}
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer class="mt-2">
				<AlertDialog.Cancel type="button">{m.cancel()}</AlertDialog.Cancel>
				<AlertDialog.Action type="submit">{m.group_form_submit()}</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
