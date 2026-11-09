import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  // Dynamic (non-static): read from the environment at app start, matching the
  // old $env/dynamic/public behavior. Optional: the build environment may not
  // provide it; runtime compose sets PUBLIC_BACKEND_API_URL.
  PUBLIC_BACKEND_API_URL: {
    public: true,
    description: 'Backend API base URL, e.g. https://maxit.mini.pw.edu.pl/api/v1',
    schema: (value) => value
  }
});
