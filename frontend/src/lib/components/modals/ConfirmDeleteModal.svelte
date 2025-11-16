<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let title = 'Delete Item';
	export let message = 'Are you sure you want to delete this item?';
	export let itemName = '';
	export let confirmText = 'Delete';
	export let requireTyping = false;

	const modalStore = getModalStore();

	let confirmInput = '';
	let loading = false;

	function handleConfirm() {
		if (requireTyping && confirmInput !== itemName) {
			return;
		}
		
		if ($modalStore[0]?.response) {
			$modalStore[0].response(true);
		}
		modalStore.close();
	}

	function handleCancel() {
		if ($modalStore[0]?.response) {
			$modalStore[0].response(false);
		}
		modalStore.close();
	}

	$: isValid = !requireTyping || confirmInput === itemName;
</script>

<div class="modern-card p-6 w-full max-w-md">
	<!-- Header -->
	<div class="flex items-start gap-4 mb-6">
		<div class="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
			<svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
		</div>
		<div class="flex-1">
			<h2 class="text-xl font-bold text-slate-100 mb-2" style="font-family: 'Space Grotesk', sans-serif;">
				{title}
			</h2>
			<p class="text-sm text-slate-300">
				{message}
			</p>
			{#if itemName}
				<p class="text-sm font-semibold text-red-400 mt-2">"{itemName}"</p>
			{/if}
		</div>
	</div>

	<!-- Confirmation Input (if required) -->
	{#if requireTyping && itemName}
		<div class="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-900/50">
			<p class="text-sm text-red-200 mb-3">
				This action <strong>cannot be undone</strong>. Type <strong class="text-red-300">{itemName}</strong> to confirm:
			</p>
			<input
				type="text"
				bind:value={confirmInput}
				placeholder={itemName}
				class="w-full px-4 py-3 bg-slate-900/50 border border-red-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
				autofocus
			/>
		</div>
	{/if}

	<!-- Warning Notice -->
	<div class="mb-6 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
		<p class="text-xs text-slate-400">
			<strong class="text-red-400">Warning:</strong> This action cannot be undone. All associated data will be permanently deleted.
		</p>
	</div>

	<!-- Actions -->
	<div class="flex gap-3">
		<button
			on:click={handleCancel}
			class="flex-1 py-3 px-4 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 font-medium transition-all duration-200"
		>
			Cancel
		</button>
		<button
			on:click={handleConfirm}
			disabled={!isValid}
			class="flex-1 py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{confirmText}
		</button>
	</div>
</div>
