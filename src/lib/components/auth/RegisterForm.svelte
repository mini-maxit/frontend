<script lang="ts">
	import * as Form from '$components/ui/form';
	import Input from '$components/ui/input/input.svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { registerSchema, type RegisterSchema } from './formSchemas';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as m from '$lib/paraglide/messages.js';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { data }: { data: SuperValidated<Infer<RegisterSchema>> } = $props();

	const form = superForm(data, {
		validators: zodClient(registerSchema),
		onUpdate({ result }) {
			if (result.type === 'success') {
				toast.success(m.toaster_register_success_message());
				goto('/dashboard');
			} else if (result.status == 500) {
				toast.error(m.error_unexpected_request_error_message());
			}
		}
	});

	const { form: formData, enhance, message } = form;
</script>

<form action="?/register" method="POST" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.username()}</Form.Label>
				<Input {...props} bind:value={$formData.username} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.user_first_name()}</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="surname">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.user_last_name()}</Form.Label>
				<Input {...props} bind:value={$formData.surname} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.password_input_label()}</Form.Label>
				<Input {...props} type="password" bind:value={$formData.password} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="confirmPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.password_confirm_input_label()}</Form.Label>
				<Input {...props} type="password" bind:value={$formData.confirmPassword} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	{#if $message}
		<p class="text-destructive my-2 text-sm font-medium">{$message}</p>
	{/if}
	<Form.Button type="submit">{m.register()}</Form.Button>
</form>
