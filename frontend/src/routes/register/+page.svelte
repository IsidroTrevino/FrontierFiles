<script lang="ts">
	import { goto } from '$app/navigation';
	import { authApi } from '$lib/api';
	import { authStore } from '$lib/stores/authStore';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let email = '';
	let password = '';
	let name = '';
	let loading = false;

	async function handleRegister() {
		loading = true;
		try {
			const response = await authApi.register({ email, password, name });
			authStore.login(response.data.user, response.data.access_token);
			toastStore.trigger({
				message: '✓ Account created successfully!',
				background: 'bg-gradient-to-r from-green-500 to-emerald-500',
				classes: 'text-white font-semibold'
			});
			goto('/dashboard');
		} catch (error: any) {
			toastStore.trigger({
				message: error.response?.data?.message || 'Registration failed',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Create Account - FrontierFiles</title>
</svelte:head>

<div class="min-h-screen gradient-bg overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl float-animation"></div>
		<div class="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" style="animation: float 8s ease-in-out infinite;"></div>
	</div>

	<div class="relative min-h-screen flex items-center justify-center p-4">
		<!-- Back to home -->
		<a href="/" class="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
			<svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			<span class="font-medium">Back</span>
		</a>

		<!-- Register card -->
		<div class="glass rounded-2xl p-8 md:p-10 w-full max-w-md shadow-2xl fade-in">
			<!-- Header -->
			<div class="text-center mb-8">
				<div class="inline-flex items-center gap-2 mb-4">
					<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
						</svg>
					</div>
					<h1 class="text-2xl font-bold gradient-text" style="font-family: 'Space Grotesk', sans-serif;">FrontierFiles</h1>
				</div>
				<h2 class="text-3xl font-bold text-slate-100 mb-2">Create your account</h2>
				<p class="text-slate-400">Get started with your free account</p>
			</div>

			<!-- Form -->
			<form on:submit|preventDefault={handleRegister} class="space-y-5">
				<div class="space-y-2">
					<label for="name" class="block text-sm font-medium text-slate-300">
						Name <span class="text-slate-500">(optional)</span>
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="John Doe"
						class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					/>
				</div>

				<div class="space-y-2">
					<label for="email" class="block text-sm font-medium text-slate-300">
						Email address
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					/>
				</div>

				<div class="space-y-2">
					<label for="password" class="block text-sm font-medium text-slate-300">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						required
						minlength="6"
						class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					/>
					<p class="text-xs text-slate-500">Must be at least 6 characters</p>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="modern-btn w-full py-3.5 px-6 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
				>
					{#if loading}
						<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Creating account...
					{:else}
						Create Account
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-8">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-slate-700"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-slate-900/50 text-slate-400">Already have an account?</span>
				</div>
			</div>

			<!-- Login link -->
			<a
				href="/login"
				class="block w-full py-3 px-6 rounded-xl font-semibold text-center border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300 text-slate-200"
			>
				Sign In
			</a>
		</div>
	</div>
</div>
