<script lang="ts">
	import MaxitLogo from '$lib/assets/MaxitLogo.svelte';
	import { getLocale, localizeHref, setLocale } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { isMobile } from '$lib/hooks/is-mobile.svelte';

	let isScrolled = $state(false);

	onMount(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			isScrolled = scrollTop > 50;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	const textColor = $derived(isScrolled ? 'text-gray-700' : 'text-white');
	const currentLang = $derived(getLocale());
</script>

<header
	class={`fixed top-0 right-0 left-0 z-50 overflow-hidden p-4 transition-all duration-300 ${
		isScrolled ? 'bg-background shadow-lg backdrop-blur-md' : 'bg-transparent'
	}`}
>
	<div class="relative mx-auto flex max-w-7xl items-center justify-between">
		<a class="absolute top-1/2 left-0 -translate-y-1/2 overflow-hidden" href={localizeHref('/')}>
			<MaxitLogo
				width={isMobile.current ? 64 : 128}
				height={isMobile.current ? 64 : 128}
				bind:isScrolled
			/>
		</a>

		<div class="ml-auto flex items-center gap-8">
			<div class={`flex items-center gap-2 transition-colors duration-300 ${textColor}`}>
				<Button
					class={`cursor-pointer text-sm font-medium ${isScrolled ? 'text-primary' : 'text-primary-foreground'} ${currentLang === 'en' ? 'opacity-100' : 'opacity-60'}`}
					variant="link"
					onclick={() => setLocale('en')}>EN</Button
				>
				<span class="text-sm font-medium">/</span>
				<Button
					class={`cursor-pointer text-sm font-medium ${isScrolled ? 'text-primary' : 'text-primary-foreground'} ${currentLang === 'pl' ? 'opacity-100' : 'opacity-60'}`}
					variant="link"
					onclick={() => setLocale('pl')}>PL</Button
				>
			</div>

			<Button href={localizeHref('/dashboard')}>Dashboard</Button>
		</div>
	</div>
</header>
