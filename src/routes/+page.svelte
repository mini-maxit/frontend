<script lang="ts">
  import HeroSection from '$lib/components/landing_page/HeroSection.svelte';
  import FeaturesSection from '$lib/components/landing_page/FeaturesSection.svelte';
  import HowItWorksSection from '$lib/components/landing_page/HowItWorksSection.svelte';
  import CallToActionSection from '$lib/components/landing_page/CallToActionSection.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<Header />
<main class="min-h-screen">
  <HeroSection />
  <FeaturesSection />
  <HowItWorksSection />
  <CallToActionSection />
</main>
<Footer />
