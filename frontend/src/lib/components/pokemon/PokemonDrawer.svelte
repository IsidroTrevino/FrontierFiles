<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getDrawerStore, getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import { pokemonApi } from '$lib/api';
	import type { Pokemon, Category } from '$lib/types';
	import FileManager from './FileManager.svelte';
	import ConfirmDeleteModal from '$lib/components/modals/ConfirmDeleteModal.svelte';

	export let pokemon: Pokemon;
	export let categories: Category[];

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const dispatch = createEventDispatcher();

	let editedPokemon = { ...pokemon };
	let saving = false;
	let uploadingMain = false;
	
	// Initialize selected category from pokemon prop
	let selectedCategoryId = pokemon.categoryId 
		? (typeof pokemon.categoryId === 'object' ? pokemon.categoryId._id : pokemon.categoryId)
		: '';


	function close() {
		drawerStore.close();
	}

	async function handleSave() {
		saving = true;
		try {
			const response = await pokemonApi.update(pokemon._id, {
				name: editedPokemon.name,
				categoryId: selectedCategoryId,
				notes: editedPokemon.notes
			});
			// Update local state with fresh data from server
			pokemon = response.data;
			editedPokemon = { ...response.data };
			toastStore.trigger({
				message: '✓ Item updated successfully',
				background: 'bg-gradient-to-r from-green-500 to-emerald-500',
				classes: 'text-white font-semibold'
			});
			dispatch('updated');
			close();
		} catch (error: any) {
			toastStore.trigger({
				message: error.response?.data?.message || 'Failed to update',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			saving = false;
		}
	}

	async function handleMainImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files?.[0]) return;

		uploadingMain = true;
		try {
			const response = await pokemonApi.uploadMainImage(pokemon._id, input.files[0]);
			editedPokemon = response.data;
			pokemon = response.data;
			toastStore.trigger({
				message: '✓ Image uploaded successfully',
				background: 'bg-gradient-to-r from-green-500 to-emerald-500',
				classes: 'text-white font-semibold'
			});
		} catch (error: any) {
			toastStore.trigger({
				message: 'Failed to upload image',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			uploadingMain = false;
		}
	}

	async function handleDelete() {
		modalStore.trigger({
			type: 'component',
			component: { ref: ConfirmDeleteModal },
			meta: {
				title: 'Delete Item',
				message: 'Are you sure you want to delete this item?',
				itemName: pokemon.name,
				confirmText: 'Delete'
			},
			response: async (confirmed: boolean) => {
				if (!confirmed) return;

				try {
					await pokemonApi.delete(pokemon._id);
					toastStore.trigger({
						message: '✓ Item deleted',
						background: 'bg-gradient-to-r from-green-500 to-emerald-500',
						classes: 'text-white font-semibold'
					});
					dispatch('updated');
					close();
				} catch (error) {
					toastStore.trigger({
						message: 'Failed to delete',
						background: 'bg-gradient-to-r from-red-500 to-rose-500',
						classes: 'text-white font-semibold'
					});
				}
			}
		});
	}

	// Remove the old reactive statement
</script>

<div class="h-full flex flex-col p-4 overflow-y-auto" style="background: var(--bg-secondary);">
	<!-- Header -->
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-xl font-bold text-slate-100" style="font-family: 'Space Groteł', sans-serif;">Item Details</h2>
		<button
			class="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all duration-200 flex items-center justify-center"
			on:click={close}
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<!-- Main Content: Image + Form -->
	<div class="flex gap-4 mb-4">
		<!-- Left: Image -->
		<div class="w-48 flex-shrink-0">
			<div class="aspect-square bg-slate-800/50 rounded-lg flex items-center justify-center overflow-hidden mb-2 border border-slate-700">
				{#if editedPokemon.mainImage?.url}
					<img src={editedPokemon.mainImage.url} alt={editedPokemon.name} class="w-full h-full object-cover" />
				{:else}
					<div class="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center">
						<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
				{/if}
			</div>

			<label class="modern-btn w-full py-2 px-2 rounded-lg font-medium border border-slate-600 hover:border-green-500 hover:bg-green-500/10 text-slate-200 hover:text-green-400 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-xs">
				<input type="file" accept="image/*" class="hidden" on:change={handleMainImageUpload} disabled={uploadingMain} />
				<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
				</svg>
				{uploadingMain ? 'Uploading...' : 'Change'}
			</label>
		</div>

		<!-- Right: Form Fields -->
		<div class="flex-1 space-y-3">
			<div class="space-y-1.5">
				<label for="item-name" class="block text-xs font-medium text-slate-300">Name</label>
				<input
					id="item-name"
					type="text"
					bind:value={editedPokemon.name}
					class="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
				/>
			</div>

			<div class="space-y-1.5">
				<label for="item-category" class="block text-xs font-medium text-slate-300">Category</label>
				<select
					id="item-category"
					bind:value={selectedCategoryId}
					class="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
				>
					<option value="" selected={selectedCategoryId === ''}>No category</option>
					{#each categories as category}
						<option value={category._id} selected={selectedCategoryId === category._id}>{category.name}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1.5">
				<label for="item-notes" class="block text-xs font-medium text-slate-300">Notes</label>
				<textarea
					id="item-notes"
					bind:value={editedPokemon.notes}
					rows="3"
					class="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 resize-none"
				/>
			</div>
		</div>
	</div>

	<!-- File Manager -->
	<div class="border-t border-slate-700 pt-4 mb-4">
		<FileManager {pokemon} on:filesUpdated={() => dispatch('updated')} />
	</div>

	<!-- Actions -->
	<div class="flex gap-2 mt-auto pt-3">
		<button
			class="px-3 py-2 text-sm rounded-lg border border-slate-600 hover:border-red-500 hover:bg-red-500/10 text-slate-300 hover:text-red-400 font-medium transition-all duration-200"
			on:click={handleDelete}
		>
			Delete
		</button>
		<button
			class="px-3 py-2 text-sm rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 font-medium transition-all duration-200"
			on:click={close}
		>
			Cancel
		</button>
		<button
			class="flex-1 modern-btn px-3 py-2 text-sm rounded-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
			on:click={handleSave}
			disabled={saving}
		>
			{#if saving}
				<svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Saving...
			{:else}
				Save Changes
			{/if}
		</button>
	</div>
</div>

<style>
	:global(.drawer) {
		width: 600px;
		max-width: 90vw;
		z-index: 100 !important;
	}
	:global(.drawer-backdrop) {
		background: rgba(0, 0, 0, 0.5);
		z-index: 99 !important;
	}
</style>
