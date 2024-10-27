<script lang="ts">
	interface Props {
		text: string;
		href: string;
		class?: string;
	}

	let { text, href, class: className = '' }: Props = $props();
</script>

<a
	{href}
	class="text-md h-min flex justify-center items-center text-nowrap rounded-[10px] px-5 py-3 text-center font-semibold {className}"
>
	{text}
</a>
