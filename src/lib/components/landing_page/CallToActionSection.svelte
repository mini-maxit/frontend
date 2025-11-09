<script>
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
  import BackgroundDecoration from '$lib/components/BackgroundDecoration.svelte';
  import { AppRoutes } from '$lib/routes';
</script>

<section
  id="cta"
  class="relative overflow-hidden bg-gradient-to-br from-primary to-secondary px-4 py-20"
>
  <BackgroundDecoration opacity={0.1} strokeColor="#F1F1F1" />

  <div class="relative mx-auto max-w-4xl text-center">
    <h2 class="mb-6 text-3xl font-bold tracking-tight text-primary-foreground lg:text-4xl">
      {m.cta_heading()}
    </h2>

    <p
      class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed tracking-tight text-primary-foreground/90 lg:text-xl"
    >
      {m.cta_description()}
    </p>

    <Button
      href={AppRoutes.Dashboard}
      size="lg"
      class="bg-primary-foreground px-8 py-6 text-lg text-primary shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-primary-foreground/90"
    >
      {m.cta_button()}
    </Button>
  </div>
</section>
