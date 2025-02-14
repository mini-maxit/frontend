<script lang="ts">
	import type { PageServerData } from './$types';
	import UserView from '$lib/components/users/UserView.svelte';

	let { data }: { data: PageServerData } = $props();

	const { user } = data;
	const { submissions } = data;
</script>

<div class="p-10 pb-16">
	<UserView {user} {submissions} />
</div>
