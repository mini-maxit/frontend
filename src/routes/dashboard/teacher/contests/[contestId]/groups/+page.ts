import { redirect } from '@sveltejs/kit';
import { localizeHref } from '#lib/paraglide/runtime.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  redirect(307, localizeHref(`/dashboard/teacher/contests/${params.contestId}/participants`));
};
