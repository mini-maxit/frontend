<script lang="ts">
	import type { UserData } from '$lib/backendSchemas';
	import * as AlertDialog from '$components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import {
		editUserSchema,
		type EditUserSchema,
		editPasswordSchema,
		type EditPasswordSchema
	} from './formSchemas';
	import * as Form from '$components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from '../ui/input/input.svelte';
	import Separator from '../ui/separator/separator.svelte';

	let {
		user,
		editPasswordForm,
		editUserForm
	}: {
		user: UserData;
		editPasswordForm: SuperValidated<Infer<EditPasswordSchema>>;
		editUserForm: SuperValidated<Infer<EditUserSchema>>;
	} = $props();

	const userForm = superForm(editUserForm, {
		validators: zodClient(editUserSchema),
		resetForm: false,
		onResult: ({ result: { type } }) => {
			open = type !== 'success';
		}
	});

	const passwordForm = superForm(editPasswordForm, {
		validators: zodClient(editPasswordSchema),
		onResult: ({ result: { type } }) => {
			open = type !== 'success';
		}
	});

	const { form: userFormData, enhance: userFormEnhance, message: userFormMessage } = userForm;
	const {
		form: passwordFormData,
		enhance: passwordFormEnhance,
		message: passwordFormMessage
	} = passwordForm;

	$userFormData.userId = user.id;
	$userFormData.username = user.username;
	$userFormData.email = user.email;
	$userFormData.name = user.name;
	$userFormData.surname = user.surname;
	$userFormData.role = user.role;

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
				<form action="?/editUser" method="POST" use:userFormEnhance>
					<Form.Field form={userForm} name="userId" hidden>
						<Form.Control>
							{#snippet children({ props })}
								<Input type="number" {...props} bind:value={$userFormData.userId} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={userForm} name="username">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.username()}</Form.Label>
								<Input {...props} bind:value={$userFormData.username} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={userForm} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.user_email()}</Form.Label>
								<Input {...props} bind:value={$userFormData.email} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={userForm} name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.user_first_name()}</Form.Label>
								<Input {...props} bind:value={$userFormData.name} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={userForm} name="surname">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.user_last_name()}</Form.Label>
								<Input {...props} bind:value={$userFormData.surname} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={userForm} name="role">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.user_last_name()}</Form.Label>
								<Input disabled {...props} bind:value={$userFormData.role} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					{#if $userFormMessage}
						<p class="text-destructive my-2 text-sm font-medium">{$userFormMessage}</p>
					{/if}
					<Separator class="my-4" />
					<div class="flex-row w-full">
						<div class="my-4">
							{m.edit_profile_submit_description()}
						</div>
						<Form.Button type="submit">{m.edit_profile_submit()}</Form.Button>
					</div>
				</form>

				<form action="?/editPassword" method="POST" use:passwordFormEnhance>
					<Form.Field form={passwordForm} name="currentPassword">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.edit_profile_password_label()}</Form.Label>
								<Input {...props} type="password" bind:value={$passwordFormData.currentPassword} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={passwordForm} name="newPassword">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.edit_profile_password_label()}</Form.Label>
								<Input {...props} type="password" bind:value={$passwordFormData.newPassword} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={passwordForm} name="confirmPassword">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.edit_profile_password_confirm_label()}</Form.Label>
								<Input {...props} type="password" bind:value={$passwordFormData.confirmPassword} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</form>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{m.cancel()}</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
