<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Pokemon } from '$lib/types';

	export let pokemon: Pokemon[];

	const dispatch = createEventDispatcher();

	function handleClick(poke: Pokemon) {
		dispatch('pokemonClick', poke);
	}

	function getCategoryName(poke: Pokemon): string {
		if (typeof poke.categoryId === 'object' && poke.categoryId) {
			return poke.categoryId.name;
		}
		return '';
	}

	function getCategoryColor(poke: Pokemon): string {
		if (typeof poke.categoryId === 'object' && poke.categoryId) {
			return poke.categoryId.color || '#888';
		}
		return '#888';
	}
</script>

{#if pokemon.length === 0}
	<div class="modern-card p-12 lg:p-16 text-center max-w-2xl mx-auto">
		<div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center">
			<svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
			</svg>
		</div>
		<h2 class="text-2xl font-bold text-slate-200 mb-3">No items yet</h2>
		<p class="text-slate-400 mb-8 max-w-md mx-auto">
			Create your first item to get started
		</p>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each pokemon as poke (poke._id)}
			<div
				class="modern-card cursor-pointer overflow-hidden group"
				on:click={() => handleClick(poke)}
				on:keydown={() => handleClick(poke)}
				role="button"
				tabindex="0"
			>
				<!-- Gradient accent -->
				<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				
				<!-- Image -->
				<div class="aspect-square bg-slate-800/50 flex items-center justify-center overflow-hidden relative">
					{#if poke.mainImage?.url}
						<img src={poke.mainImage.url} alt={poke.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
					{:else}
						<div class="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
							</svg>
						</div>
					{/if}
				</div>

				<!-- Content -->
				<div class="p-4">
					<h3 class="text-lg font-bold text-slate-100 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-green-400 transition-all duration-300">
						{poke.name}
					</h3>

					{#if getCategoryName(poke)}
						<div class="flex items-center gap-2">
							<span
								class="w-2 h-2 rounded-full"
								style="background-color: {getCategoryColor(poke)}"
							/>
							<span class="text-sm text-slate-400">{getCategoryName(poke)}</span>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
