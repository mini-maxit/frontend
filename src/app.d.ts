// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type * as Icons from 'unplugin-icons/types/svelte';
import type { UserData } from '$lib/backendSchemas';

declare global {
	namespace App {
		interface Locals {
			user: UserData | null;
			sessionId: string | null;
		}
		interface Error {
			code?: string;
			message: string;
		}
	}
}

export {};
