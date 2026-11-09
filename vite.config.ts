import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter(),
      preprocess: vitePreprocess(),
      // Escape hatch from kit 3's $lib removal (message: "To keep using $lib, add alias").
      // Full #lib subpath-import migration is deferred to the kit 4 upgrade.
      alias: {
        $lib: 'src/lib'
      },
      compilerOptions: {
        experimental: {
          async: true
        }
      }
    }),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide'
    })
  ],
  server: {
    proxy: {
      '/buckets': {
        target: 'http://localhost:8888',
        changeOrigin: true
      }
    }
  }
});
