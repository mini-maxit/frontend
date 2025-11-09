<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import MaxitLogo from '$lib/assets/MaxitLogo.svelte';
  import BackgroundDecoration from '$lib/components/BackgroundDecoration.svelte';
  import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
  import Home from '@lucide/svelte/icons/home';
  import RefreshCw from '@lucide/svelte/icons/refresh-cw';
  import { m } from '$lib/paraglide/messages.js';
  import { AppRoutes } from '$lib/routes';

  const status = $page.status;
  const message = $page.error?.message || m.error_default_message();

  const errorMessages = {
    404: {
      title: m.error_404_title(),
      description: m.error_404_description()
    },
    500: {
      title: m.error_500_title(),
      description: m.error_500_description()
    },
    403: {
      title: m.error_403_title(),
      description: m.error_403_description()
    },
    401: {
      title: m.error_401_title(),
      description: m.error_401_description()
    }
  };

  const errorInfo = errorMessages[status as keyof typeof errorMessages] || {
    title: m.error_generic_title(),
    description: message
  };

  function goHome() {
    window.location.href = AppRoutes.Home;
  }

  function reload() {
    window.location.reload();
  }
</script>

<svelte:head>
  <title>{status} - {errorInfo.title} | Maxit</title>
</svelte:head>

<section
  class="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
>
  <BackgroundDecoration />

  <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
    <div class="mx-auto max-w-4xl">
      <div class="flex flex-col items-center gap-8">
        <div class="transition-transform duration-500 hover:scale-105">
          <MaxitLogo width={120} height={120} />
        </div>

        <div
          class="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110"
        >
          <div
            class="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
          >
            <AlertTriangle class="h-12 w-12 animate-pulse text-primary-foreground" />
          </div>
        </div>

        <div
          class="cursor-default rounded-2xl bg-white/10 px-8 py-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <h1 class="text-6xl font-bold tracking-tight text-primary-foreground md:text-8xl">
            {status}
          </h1>
        </div>

        <div class="max-w-2xl text-center">
          <h2
            class="mb-4 text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl"
          >
            {errorInfo.title}
          </h2>
          <p class="text-lg text-primary-foreground/90 md:text-xl">
            {errorInfo.description}
          </p>
        </div>

        <div class="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            class="group gap-2 bg-white/20 text-primary-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/30 hover:shadow-xl"
            onclick={goHome}
          >
            <Home class="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            {m.error_go_home()}
          </Button>

          <Button
            size="lg"
            variant="outline"
            class="group gap-2 border-white/30 bg-white/10 text-primary-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/20 hover:shadow-xl"
            onclick={reload}
          >
            <RefreshCw class="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
            {m.error_try_again()}
          </Button>
        </div>

        <div class="mt-8 text-center">
          <p class="text-sm text-primary-foreground/70">
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Decorative Floating Elements -->
  <div
    class="absolute top-20 left-10 h-20 w-20 animate-bounce rounded-full bg-white/5 opacity-50 blur-xl"
    style="animation-duration: 3s; animation-delay: 0s"
  ></div>
  <div
    class="absolute top-40 right-20 h-32 w-32 animate-bounce rounded-full bg-white/5 opacity-50 blur-xl"
    style="animation-duration: 4s; animation-delay: 1s"
  ></div>
  <div
    class="absolute bottom-20 left-1/4 h-24 w-24 animate-bounce rounded-full bg-white/5 opacity-50 blur-xl"
    style="animation-duration: 3.5s; animation-delay: 0.5s"
  ></div>
</section>
