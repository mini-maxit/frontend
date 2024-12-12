// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type * as Icons from 'unplugin-icons/types/svelte';

declare global {
	namespace App {
		interface Locals {
			userId: number | null;
			session: {
				id: string;
				userId: string;
				expiresAt: Date;
			} | null;
		}
	}
}

export {};
