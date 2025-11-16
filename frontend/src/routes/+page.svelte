<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to dashboard if already logged in
		authStore.subscribe((state) => {
			if (state.isAuthenticated) {
				goto('/dashboard');
			}
		});
	});
</script>

<svelte:head>
	<title>FrontierFiles - Your Digital Asset Hub</title>
</svelte:head>

<div class="min-h-screen gradient-bg overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl float-animation"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" style="animation: float 8s ease-in-out infinite;"></div>
		<div class="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" style="animation: float 10s ease-in-out infinite;"></div>
	</div>

	<!-- Content -->
	<div class="relative min-h-screen flex flex-col items-center justify-center p-4">
		<!-- Logo/Brand -->
		<div class="text-center mb-12 fade-in">
			<div class="inline-flex items-center gap-3 mb-6">
				<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-green-500 flex items-center justify-center">
					<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
					</svg>
				</div>
				<h1 class="text-5xl md:text-6xl font-bold" style="font-family: 'Space Grotesk', sans-serif;">
					<span class="gradient-text">FrontierFiles</span>
				</h1>
			</div>
		</div>

		<!-- CTA Card -->
		<div class="glass rounded-2xl p-8 md:p-10 w-full max-w-md shadow-2xl fade-in" style="animation-delay: 0.3s;">
			<div class="space-y-6">
				<!-- Action Buttons -->
				<div class="space-y-3">
					<a
						href="/login"
						class="modern-btn block w-full py-4 px-6 rounded-xl font-semibold text-center bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 text-white"
					>
						Sign In
					</a>
					<a
						href="/register"
						class="modern-btn block w-full py-4 px-6 rounded-xl font-semibold text-center border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300 text-slate-200"
					>
						Create Account
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
