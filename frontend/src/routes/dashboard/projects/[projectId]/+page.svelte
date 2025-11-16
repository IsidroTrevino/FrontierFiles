<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { projectsApi, categoriesApi, pokemonApi } from '$lib/api';
	import {
		selectedProjectStore,
		categoriesStore,
		pokemonStore,
		selectedCategoryStore,
		selectedPokemonStore
	} from '$lib/stores/dataStore';
	import { getToastStore, getModalStore, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import type { Project, Category, Pokemon } from '$lib/types';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import PokemonGrid from '$lib/components/pokemon/PokemonGrid.svelte';
	import PokemonDrawer from '$lib/components/pokemon/PokemonDrawer.svelte';

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	let project: Project | null = null;
	let categories: Category[] = [];
	let pokemon: Pokemon[] = [];
	let selectedCategory: string | null = null;
	let selectedPokemon: Pokemon | null = null;
	let loading = true;

	$: projectId = $page.params.projectId;

	onMount(() => {
		loadProjectData();
	});

	selectedCategoryStore.subscribe((cat) => {
		selectedCategory = cat;
		if (projectId) loadPokemon();
	});

	selectedPokemonStore.subscribe((poke) => {
		selectedPokemon = poke;
	});

	async function loadProjectData() {
		loading = true;
		try {
			const [projectRes, categoriesRes, pokemonRes] = await Promise.all([
				projectsApi.getOne(projectId),
				categoriesApi.getAll(projectId),
				pokemonApi.getAll(projectId)
			]);

			project = projectRes.data;
			categories = categoriesRes.data;
			pokemon = pokemonRes.data;

			selectedProjectStore.set(project);
			categoriesStore.set(categories);
			pokemonStore.set(pokemon);
		} catch (error: any) {
			toastStore.trigger({
				message: 'Failed to load project',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			loading = false;
		}
	}

	async function loadPokemon() {
		try {
			const response = await pokemonApi.getAll(projectId, selectedCategory || undefined);
			pokemon = response.data;
			pokemonStore.set(pokemon);
		} catch (error) {
			toastStore.trigger({
				message: 'Failed to load items',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		}
	}

	function handlePokemonClick(poke: Pokemon) {
		selectedPokemonStore.set(poke);
		drawerStore.open({});
	}
</script>

<svelte:head>
	<title>{project?.name || 'Project'} - FrontierFiles</title>
</svelte:head>

<div class="flex h-[calc(100vh-64px)]" style="background: var(--bg-secondary);">
	<Sidebar {categories} on:refresh={loadProjectData} />

	<div class="flex-1 overflow-y-auto p-6 lg:p-8">
		{#if loading}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each Array(8) as _, i}
					<div class="modern-card p-6 animate-pulse" style="animation-delay: {i * 0.05}s;">
						<div class="aspect-square bg-slate-700/50 rounded-lg mb-4" />
						<div class="h-4 bg-slate-700/50 rounded w-3/4" />
					</div>
				{/each}
			</div>
		{:else}
			<PokemonGrid {pokemon} on:pokemonClick={(e) => handlePokemonClick(e.detail)} />
		{/if}
	</div>
</div>

<Drawer position="right">
	{#if selectedPokemon}
		<PokemonDrawer pokemon={selectedPokemon} {categories} on:updated={loadProjectData} />
	{/if}
</Drawer>
