<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text?: string;
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	let { text = '', class: className = '', onclick = () => {}, children }: Props = $props();

	if (text && children) {
		throw new Error('Button component cannot have both text and children');
	}
</script>

<button
	{onclick}
	class="text-md text-center font-semibold h-min items-center rounded-[10px] {className}"
>
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</button>
