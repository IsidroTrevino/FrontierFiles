<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import Navbar from '$lib/components/layout/Navbar.svelte';

	let isAuthenticated = false;

	authStore.subscribe((state) => {
		isAuthenticated = state.isAuthenticated;
	});

	onMount(() => {
		if (!isAuthenticated) {
			goto('/');
		}
	});
</script>

{#if isAuthenticated}
	<div class="min-h-screen flex flex-col">
		<Navbar />
		<main class="flex-1">
			<slot />
		</main>
	</div>
{/if}
