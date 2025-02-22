<script lang="ts">
	import type { UserData } from '$lib/backendSchemas';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { editUserSchema, type EditUserSchema } from './formSchemas';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from '../ui/input/input.svelte';
	import Separator from '../ui/separator/separator.svelte';

	let {
		user,
		editUserForm
	}: { user: UserData; editUserForm: SuperValidated<Infer<EditUserSchema>> } = $props();

	const form = superForm(editUserForm, {
		validators: zodClient(editUserSchema),
		resetForm: false,
		onResult: ({ result: { type } }) => {
			open = type !== 'success';
		}
	});

	const { form: formData, enhance, message } = form;

	$formData.userId = user.id;
	$formData.username = user.username;
	$formData.name = user.name;
	$formData.surname = user.surname;

	let open = $state(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'outline', size: 'lg' })}>
		{m.edit_profile_title()}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{m.edit_profile_title()}</AlertDialog.Title>
			<AlertDialog.Description>
				<form action="?/editProfile" method="POST" use:enhance>
					<Form.Field {form} name="userId" hidden>
						<Form.Control>
							{#snippet children({ props })}
								<Input type="number" {...props} bind:value={$formData.userId} />
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
					<Form.Field {form} name="currentPassword">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.edit_profile_password_label()}</Form.Label>
								<Input {...props} type="password" bind:value={$formData.currentPassword} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="newPassword">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.edit_profile_password_label()}</Form.Label>
								<Input {...props} type="password" bind:value={$formData.newPassword} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="confirmPassword">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.edit_profile_password_confirm_label()}</Form.Label>
								<Input {...props} type="password" bind:value={$formData.confirmPassword} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					{#if $message}
						<p class="text-destructive my-2 text-sm font-medium">{$message}</p>
					{/if}
					<Separator class="my-4" />
					<div class="flex-row w-full">
						<div class="my-4">
							{m.edit_profile_submit_description()}
						</div>
						<Form.Button type="submit">{m.edit_profile_submit()}</Form.Button>
					</div>
				</form>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{m.cancel()}</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
