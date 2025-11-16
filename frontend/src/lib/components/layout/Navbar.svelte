<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import ProfileModal from '$lib/components/user/ProfileModal.svelte';
	import SettingsModal from '$lib/components/user/SettingsModal.svelte';

	const modalStore = getModalStore();

	let user: any = null;
	let dropdownOpen = false;

	authStore.subscribe((state) => {
		user = state.user;
	});

	function handleLogout() {
		authStore.logout();
		goto('/');
		dropdownOpen = false;
	}

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function closeDropdown() {
		dropdownOpen = false;
	}

	function openProfile() {
		closeDropdown();
		modalStore.trigger({
			type: 'component',
			component: { ref: ProfileModal }
		});
	}

	function openSettings() {
		closeDropdown();
		modalStore.trigger({
			type: 'component',
			component: { ref: SettingsModal }
		});
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.user-dropdown')) {
			closeDropdown();
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="glass border-b border-slate-800/50 sticky top-0 z-50 backdrop-blur-xl">
	<div class="container mx-auto px-4 lg:px-6 py-3">
		<div class="flex justify-between items-center">
			<!-- Logo/Brand -->
			<a href="/dashboard" class="flex items-center gap-2.5 group">
				<div class="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-green-500 flex items-center justify-center transition-transform group-hover:scale-110">
					<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
					</svg>
				</div>
				<span class="text-xl font-bold gradient-text hidden sm:block" style="font-family: 'Space Grotesk', sans-serif;">
					FrontierFiles
				</span>
			</a>

			<!-- User menu with dropdown -->
			<div class="relative user-dropdown">
				<button
					on:click={toggleDropdown}
					class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-200 group"
				>
					<div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-slate-700 group-hover:ring-green-500/50 transition-all">
						{user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
					</div>
					<span class="text-slate-200 text-sm font-medium hidden md:block">{user?.name || user?.email}</span>
					<svg 
						class="w-4 h-4 text-slate-400 transition-transform duration-200 {dropdownOpen ? 'rotate-180' : ''}"
						fill="none" 
						stroke="currentColor" 
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				<!-- Dropdown Menu -->
				{#if dropdownOpen}
					<div class="absolute right-0 mt-2 w-56 rounded-lg bg-slate-900 border border-slate-700/50 shadow-xl shadow-black/50 overflow-hidden animate-fadeIn">
						<!-- User Info -->
						<div class="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
							<p class="text-sm font-medium text-slate-200">{user?.name || 'User'}</p>
							<p class="text-xs text-slate-400 truncate">{user?.email}</p>
						</div>

						<!-- Menu Items -->
						<div class="py-1.5">
							<button
								on:click={() => { goto('/dashboard'); closeDropdown(); }}
								class="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-colors flex items-center gap-3"
							>
								<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
								Dashboard
							</button>

							<button
								on:click={openProfile}
								class="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-colors flex items-center gap-3"
							>
								<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								Profile
							</button>

							<button
								on:click={openSettings}
								class="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-colors flex items-center gap-3"
							>
								<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								Settings
							</button>
						</div>

						<!-- Logout -->
						<div class="border-t border-slate-700/50 py-1.5">
							<button
								on:click={handleLogout}
								class="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								Logout
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>
