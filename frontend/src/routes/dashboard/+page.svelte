<script lang="ts">
	import { onMount } from 'svelte';
	import { projectsApi } from '$lib/api';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import type { Project } from '$lib/types';
	import ProjectCard from '$lib/components/project/ProjectCard.svelte';
	import CreateProjectModal from '$lib/components/project/CreateProjectModal.svelte';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let projects: Project[] = [];
	let loading = true;

	onMount(() => {
		loadProjects();
	});

	async function loadProjects() {
		loading = true;
		try {
			const response = await projectsApi.getAll();
			projects = response.data;
		} catch (error: any) {
			toastStore.trigger({
				message: 'Failed to load projects',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		modalStore.trigger({
			type: 'component',
			component: { ref: CreateProjectModal },
			response: (r: any) => {
				if (r) loadProjects();
			}
		});
	}
</script>

<svelte:head>
	<title>Dashboard - FrontierFiles</title>
</svelte:head>

<div class="min-h-screen" style="background: var(--bg-primary);">
	<div class="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
			<div>
				<h1 class="text-3xl lg:text-4xl font-bold text-slate-100 mb-2" style="font-family: 'Space Grotesk', sans-serif;">
					My Projects
				</h1>
				<p class="text-slate-400">Manage and organize your digital assets</p>
			</div>
			<button
				on:click={openCreateModal}
				class="modern-btn px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-2"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				New Project
			</button>
		</div>

		<!-- Content -->
		{#if loading}
			<!-- Loading skeleton -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each Array(6) as _, i}
					<div class="modern-card p-6 animate-pulse" style="animation-delay: {i * 0.1}s;">
						<div class="h-6 bg-slate-700/50 rounded-lg mb-4" />
						<div class="h-4 bg-slate-700/50 rounded-lg w-3/4 mb-3" />
						<div class="h-4 bg-slate-700/50 rounded-lg w-1/2" />
					</div>
				{/each}
			</div>
		{:else if projects.length === 0}
			<!-- Empty state -->
			<div class="modern-card p-12 lg:p-16 text-center max-w-2xl mx-auto">
				<div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center">
					<svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-slate-200 mb-3">No projects yet</h2>
				<p class="text-slate-400 mb-8 max-w-md mx-auto">
					Create your first project to start organizing your digital assets and files
				</p>
				<button
					on:click={openCreateModal}
					class="modern-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					Create Your First Project
				</button>
			</div>
		{:else}
			<!-- Projects grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
				{#each projects as project (project._id)}
					<ProjectCard {project} on:deleted={loadProjects} on:updated={loadProjects} />
				{/each}
			</div>

			<!-- Stats footer -->
			<div class="mt-12 p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
				<div class="flex items-center justify-center gap-8 text-center">
					<div>
						<p class="text-3xl font-bold gradient-text">{projects.length}</p>
						<p class="text-sm text-slate-400 mt-1">
							{projects.length === 1 ? 'Project' : 'Projects'}
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
