<script lang="ts">
	import type { PageServerData } from './$types';
	import GroupsViewAll from '$components/groups/GroupsViewAll.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<GroupsViewAll groups={data.groups} />
