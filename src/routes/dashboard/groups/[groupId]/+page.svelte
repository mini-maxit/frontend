<script lang="ts">
	import type { PageServerData } from './$types';
	import GroupView from '$components/groups/GroupView.svelte';

	let { data }: { data: PageServerData } = $props();
	const { group, groupTasks, groupUsers } = data;
</script>

<GroupView {group} {groupTasks} {groupUsers} />
