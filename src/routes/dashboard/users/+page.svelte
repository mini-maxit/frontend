<script lang="ts">
	import UsersViewAll from '$lib/components/users/UsersViewAll.svelte';

	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<UsersViewAll users={data.users} />
