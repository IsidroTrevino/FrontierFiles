import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	// Check if user is authenticated (client-side check)
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('token');
		if (!token && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/register') && url.pathname !== '/') {
			throw redirect(302, '/');
		}
	}
};
