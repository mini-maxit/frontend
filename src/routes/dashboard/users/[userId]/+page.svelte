<script lang="ts">
	import type { PageServerData } from './$types';
	import UserView from '$components/users/UserView.svelte';

	let { data }: { data: PageServerData } = $props();

	const {
		user,
		submissions,
		groups,
		localUser,
		editUserForm,
		editPasswordForm,
		assignUserToGroupsForm
	} = data;
</script>

<div class="p-10 pb-16">
	<UserView
		{user}
		{submissions}
		{groups}
		{localUser}
		{editUserForm}
		{editPasswordForm}
		{assignUserToGroupsForm}
	/>
</div>
