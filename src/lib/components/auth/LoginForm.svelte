<script lang="ts">
	import * as Form from '$components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import Input from '$components/ui/input/input.svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { loginSchema, type LoginSchema } from './formSchemas';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { data }: { data: SuperValidated<Infer<LoginSchema>> } = $props();

	const form = superForm(data, {
		validators: zodClient(loginSchema),
		onUpdate({ result }) {
			if (result.type === 'success') {
				toast.success(m.toaster_login_success_message());
				goto('/dashboard');
			} else if (result.status == 500) {
				toast.error(m.error_unexpected_request_error_message());
			}
		}
	});

	const { form: formData, enhance, message } = form;
</script>

<form action="?/login" method="POST" use:enhance class="flex-1">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.password()}</Form.Label>
				<Input {...props} type="password" bind:value={$formData.password} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	{#if $message}
		<p class="text-destructive my-2 text-sm font-medium">{$message}</p>
	{/if}
	<Form.Button type="submit">{m.login()}</Form.Button>
</form>
