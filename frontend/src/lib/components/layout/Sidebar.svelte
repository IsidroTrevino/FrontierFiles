<script lang="ts">
	import { selectedProjectStore, selectedCategoryStore } from '$lib/stores/dataStore';
	import { categoriesApi, pokemonApi } from '$lib/api';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { Category } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import CreateCategoryModal from '$lib/components/category/CreateCategoryModal.svelte';
	import CreatePokemonModal from '$lib/components/pokemon/CreatePokemonModal.svelte';

	export let categories: Category[];

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const dispatch = createEventDispatcher();

	let project: any = null;
	let selectedCategory: string | null = null;
	let pokemonCounts: Record<string, number> = {};

	selectedProjectStore.subscribe((p) => {
		project = p;
		if (p) loadPokemonCounts();
	});

	selectedCategoryStore.subscribe((c) => {
		selectedCategory = c;
	});

	async function loadPokemonCounts() {
		if (!project) return;
		try {
			const response = await pokemonApi.getAll(project._id);
			const allPokemon = response.data;

			pokemonCounts = { all: allPokemon.length };

			categories.forEach((cat) => {
				pokemonCounts[cat._id] = allPokemon.filter(
					(p: any) => p.categoryId?._id === cat._id || p.categoryId === cat._id
				).length;
			});
		} catch (error) {
			console.error('Failed to load pokemon counts', error);
		}
	}

	function selectCategory(categoryId: string | null) {
		selectedCategoryStore.set(categoryId);
	}

	function openCreateCategory() {
		modalStore.trigger({
			type: 'component',
			component: { ref: CreateCategoryModal },
			response: (r: any) => {
				if (r) dispatch('refresh');
			}
		});
	}

	function openCreatePokemon() {
		modalStore.trigger({
			type: 'component',
			component: { ref: CreatePokemonModal },
			meta: { categories },
			response: (r: any) => {
				if (r) dispatch('refresh');
			}
		});
	}

	$: if (categories) {
		loadPokemonCounts();
	}
</script>

<aside class="w-56 glass border-r border-slate-800/50 p-3 overflow-y-auto">
	<div class="mb-4">
		<h2 class="text-lg font-bold text-slate-100 mb-2 truncate" style="font-family: 'Space Grotesk', sans-serif;" title="{project?.name || 'Project'}">{project?.name || 'Project'}</h2>
		<button
			class="modern-btn w-full py-2 px-3 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-1.5 text-sm"
			on:click={openCreatePokemon}
		>
			<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			New Item
		</button>
	</div>

	<div class="space-y-1.5">
		<button
			class="w-full text-left px-2.5 py-2 rounded-lg transition-all duration-200 {selectedCategory === null
				? 'bg-gradient-to-r from-red-500/20 to-green-500/20 border border-green-500/30 text-green-400'
				: 'hover:bg-slate-800/50 text-slate-300 hover:text-slate-100'}"
			on:click={() => selectCategory(null)}
		>
			<span class="flex justify-between items-center">
				<span class="flex items-center gap-1.5 font-medium text-sm">
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
					</svg>
					All
				</span>
				<span class="text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center {selectedCategory === null ? 'bg-green-500/20 text-green-300' : 'bg-slate-700 text-slate-400'}">
					{pokemonCounts.all || 0}
				</span>
			</span>
		</button>

		<div class="border-t border-slate-700/50 pt-2 mt-2">
			<div class="flex justify-between items-center mb-2 px-1">
				<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Categories</span>
				<button
					class="w-5 h-5 rounded bg-slate-800 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-green-500/20 border border-slate-600 hover:border-green-500/50 text-slate-400 hover:text-green-400 transition-all duration-200 flex items-center justify-center"
					on:click={openCreateCategory}
					title="Add category"
				>
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>

			{#each categories as category (category._id)}
				<button
					class="w-full text-left px-2.5 py-2 rounded-lg transition-all duration-200 {selectedCategory === category._id
						? 'bg-gradient-to-r from-red-500/20 to-green-500/20 border border-green-500/30 text-green-400'
						: 'hover:bg-slate-800/50 text-slate-300 hover:text-slate-100'}"
					on:click={() => selectCategory(category._id)}
				>
					<span class="flex justify-between items-center">
						<span class="flex items-center gap-1.5 min-w-0">
							<span
								class="w-2 h-2 rounded-full ring-1 flex-shrink-0 {selectedCategory === category._id ? 'ring-green-400/30' : 'ring-slate-700'}"
								style="background-color: {category.color || '#888'}"
							/>
							<span class="font-medium text-sm truncate">{category.name}</span>
						</span>
						<span class="text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0 {selectedCategory === category._id ? 'bg-green-500/20 text-green-300' : 'bg-slate-700 text-slate-400'}">
							{pokemonCounts[category._id] || 0}
						</span>
					</span>
				</button>
			{/each}
		</div>
	</div>
</aside>
