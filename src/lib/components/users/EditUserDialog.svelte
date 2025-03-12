<script lang="ts">
	import { UserRole, type GroupData, type UserData } from '$lib/backendSchemas';
	import * as AlertDialog from '$components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import {
		editUserSchema,
		type EditUserSchema,
		editPasswordSchema,
		type EditPasswordSchema,
		assignUserToGroupsSchema,
		type AssignUserToGroupsSchema
	} from './formSchemas';
	import * as Form from '$components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from '../ui/input/input.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { toast } from 'svelte-sonner';

	let {
		user = $bindable(),
		groups,
		localUser,
		editPasswordForm,
		editUserForm,
		assignUserToGroupsForm
	}: {
		user: UserData;
		groups: GroupData[];
		localUser: UserData;
		editPasswordForm: SuperValidated<Infer<EditPasswordSchema>>;
		editUserForm: SuperValidated<Infer<EditUserSchema>>;
		assignUserToGroupsForm: SuperValidated<Infer<AssignUserToGroupsSchema>>;
	} = $props();

	const userForm = superForm(editUserForm, {
		validators: zodClient(editUserSchema),
		resetForm: false,
		onUpdate({ form, result }) {
			console.log(result);
			if (form.valid && result.type === 'success') {
				toast.success(m.toaster_edit_user_success_message());
				open = false;
				user.email = form.data.email;
				user.name = form.data.name;
				user.surname = form.data.surname;
				user.username = form.data.username;
				user.role = form.data.role;
			} else if (result.type === 'failure') {
				toast.error(m.error_unexpected_request_error_message());
			}
		}
	});

	const passwordForm = superForm(editPasswordForm, {
		validators: zodClient(editPasswordSchema),
		resetForm: false,
		onUpdate({ form, result }) {
			if (form.valid && result.type === 'success') {
				toast.success(m.toaster_edit_password_success_message());
				open = false;
			} else if (result.type === 'failure') {
				toast.error(m.error_unexpected_request_error_message());
			}
			form.data.currentPassword = '';
			form.data.newPassword = '';
			form.data.confirmPassword = '';
		}
	});

	const userGroupForm = superForm(assignUserToGroupsForm, {
		validators: zodClient(assignUserToGroupsSchema),
		resetForm: false,
		onUpdate({ form, result }) {
			if (form.valid && result.type === 'success') {
				toast.success(m.toaster_assign_user_to_group_success_message());
				open = false;
			} else if (result.type === 'failure') {
				toast.error(m.error_unexpected_request_error_message());
			}
		}
	});

	const { form: userFormData, enhance: userFormEnhance, message: userFormMessage } = userForm;
	const {
		form: passwordFormData,
		enhance: passwordFormEnhance,
		message: passwordFormMessage
	} = passwordForm;

	const {
		form: userGroupFormData,
		enhance: userGroupFormEnhance,
		message: userGroupFormMessage
	} = userGroupForm;

	$passwordFormData.userId = user.id;
	$userGroupFormData.userId = user.id;

	let open = $state(false);
	let alertDialogDescriptionClass = localUser.id === user.id ? 'flex space-x-4' : '';
	const assignGroupTriggerValue = $derived(
		groups.find((g) => g.id.toString() === $userGroupFormData.groupId)?.name ??
			m.user_assign_group_select_title()
	);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'outline', size: 'lg' })}>
		{m.edit_profile_title()}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{m.edit_profile_title()}</AlertDialog.Title>
			<AlertDialog.Description>
				<div class={alertDialogDescriptionClass}>
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
									<Form.Label>{m.role()}</Form.Label>
									<Select.Root
										type="single"
										bind:value={$userFormData.role}
										name={props.name}
										disabled={localUser.role !== UserRole.Admin}
									>
										<Select.Trigger {...props}>
											{$userFormData.role}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value={UserRole.Admin} label={UserRole.Admin} />
											<Select.Item value={UserRole.Teacher} label={UserRole.Teacher} />
											<Select.Item value={UserRole.Student} label={UserRole.Student} />
										</Select.Content>
									</Select.Root>
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
								{m.edit_profile_submit_general_information_description()}
							</div>
							<Form.Button type="submit">{m.edit_profile_submit()}</Form.Button>
						</div>
					</form>
					{#if localUser.id === user.id}
						<Separator orientation="vertical" />
						<form action="?/editPassword" method="POST" use:passwordFormEnhance>
							<Form.Field form={passwordForm} name="userId" hidden>
								<Form.Control>
									{#snippet children({ props })}
										<Input {...props} type="number" bind:value={$passwordFormData.userId} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field form={passwordForm} name="currentPassword">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>{m.edit_profile_old_password_label()}</Form.Label>
										<Input
											{...props}
											type="password"
											bind:value={$passwordFormData.currentPassword}
										/>
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
										<Input
											{...props}
											type="password"
											bind:value={$passwordFormData.confirmPassword}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							{#if $passwordFormMessage}
								<p class="text-destructive my-2 text-sm font-medium">{$passwordFormMessage}</p>
							{/if}
							<Separator class="my-4" />
							<div class="flex-row w-full">
								<div class="my-4">
									{m.edit_profile_password_change_description()}
								</div>
								<Form.Button type="submit">{m.edit_profile_submit()}</Form.Button>
							</div>
						</form>
					{/if}
				</div>

				<Separator class="my-4" />
				<h2 class="font-semibold text-lg text-foreground">
					{m.user_assign_group_form_title()}
				</h2>
				<form action="?/assignGroups" method="POST" use:userGroupFormEnhance>
					<Form.Field form={userGroupForm} name="userId" hidden>
						<Form.Control>
							{#snippet children({ props })}
								<Input type="number" {...props} bind:value={$userGroupFormData.userId} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={userGroupForm} name="groupId" class="my-4">
						<Form.Control>
							{#snippet children({ props })}
								<Select.Root type="single" bind:value={$userGroupFormData.groupId} {...props}>
									<Select.Trigger class="w-[180px]">
										{assignGroupTriggerValue}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											{#each groups as userGroup}
												<Select.Item value={userGroup.id.toString()} label={userGroup.name}
													>{userGroup.name}</Select.Item
												>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					{#if $userGroupFormMessage}
						<p class="text-destructive my-2 text-sm font-medium">{$userGroupFormMessage}</p>
					{/if}
					<Form.Button type="submit">{m.user_assign_group_submit()}</Form.Button>
				</form>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{m.cancel()}</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
