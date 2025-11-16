import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '$lib/types';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		token: null,
		isAuthenticated: false
	});

	return {
		subscribe,
		login: (user: User, token: string) => {
			if (browser) {
				localStorage.setItem('user', JSON.stringify(user));
				localStorage.setItem('token', token);
			}
			set({ user, token, isAuthenticated: true });
		},
		logout: () => {
			if (browser) {
				localStorage.removeItem('user');
				localStorage.removeItem('token');
			}
			set({ user: null, token: null, isAuthenticated: false });
		},
		init: () => {
			if (browser) {
				const userStr = localStorage.getItem('user');
				const token = localStorage.getItem('token');
				if (userStr && token) {
					const user = JSON.parse(userStr);
					set({ user, token, isAuthenticated: true });
				}
			}
		},
		updateUser: (user: User) => {
			if (browser) {
				localStorage.setItem('user', JSON.stringify(user));
			}
			update((state) => ({ ...state, user }));
		}
	};
}

export const authStore = createAuthStore();
