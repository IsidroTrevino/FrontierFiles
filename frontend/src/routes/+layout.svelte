<script lang="ts">
	import '../app.css';
	import { Modal, Toast, initializeStores } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	initializeStores();

	onMount(() => {
		// Initialize auth from localStorage
		authStore.init();
	});
</script>

<Modal />
<Toast />
<slot />
