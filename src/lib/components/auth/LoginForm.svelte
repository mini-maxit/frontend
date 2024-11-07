<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { loginSchema, type LoginSchema } from './schemas';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: SuperValidated<Infer<LoginSchema>> } = $props();

	const form = superForm(data, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form action="?/login" method="POST" use:enhance>
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
				<Form.Label>Hasło</Form.Label>
				<Input {...props} type="password" bind:value={$formData.password} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button type="submit">Zaloguj się</Form.Button>
</form>
