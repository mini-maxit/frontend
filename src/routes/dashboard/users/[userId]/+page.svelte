<script lang="ts">
	import type { PageServerData } from './$types';
	import UserView from '$lib/components/users/UserView.svelte';

	let { data }: { data: PageServerData } = $props();

	const { user } = data;
	const { submissions } = data;
	const { localUser } = data;
	const { editUserForm } = data;
</script>

<div class="p-10 pb-16">
	<UserView {user} {submissions} {localUser} {editUserForm} />
</div>
