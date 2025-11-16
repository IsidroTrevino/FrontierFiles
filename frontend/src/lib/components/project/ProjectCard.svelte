<script lang="ts">
	import { goto } from '$app/navigation';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { projectsApi } from '$lib/api';
	import type { Project } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import ConfirmDeleteModal from '$lib/components/modals/ConfirmDeleteModal.svelte';

	export let project: Project;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const dispatch = createEventDispatcher();

	function openProject() {
		goto(`/dashboard/projects/${project._id}`);
	}

	async function handleDelete() {
		modalStore.trigger({
			type: 'component',
			component: { ref: ConfirmDeleteModal },
			meta: {
				title: 'Delete Project',
				message: 'Are you sure you want to delete this project?',
				itemName: project.name,
				confirmText: 'Delete Project'
			},
			response: async (confirmed: boolean) => {
				if (!confirmed) return;

				try {
					await projectsApi.delete(project._id);
					toastStore.trigger({
						message: '✓ Project deleted',
						background: 'bg-gradient-to-r from-green-500 to-emerald-500',
						classes: 'text-white font-semibold'
					});
					dispatch('deleted');
				} catch (error) {
					toastStore.trigger({
						message: 'Failed to delete project',
						background: 'bg-gradient-to-r from-red-500 to-rose-500',
						classes: 'text-white font-semibold'
					});
				}
			}
		});
	}
</script>

<div
	class="modern-card p-6 cursor-pointer group relative overflow-hidden"
	on:click={openProject}
	on:keydown={openProject}
	role="button"
	tabindex="0"
>
	<!-- Gradient accent -->
	<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
	
	<!-- Icon -->
	<div class="flex items-start justify-between mb-4">
		<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
			<svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
			</svg>
		</div>
		
		<!-- Delete button -->
		<button
			on:click|stopPropagation={handleDelete}
			class="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-200"
			title="Delete project"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
			</svg>
		</button>
	</div>

	<!-- Content -->
	<h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-green-400 transition-all duration-300">
		{project.name}
	</h3>
	
	{#if project.description}
		<p class="text-slate-400 text-sm line-clamp-2 mb-4">
			{project.description}
		</p>
	{:else}
		<p class="text-slate-500 text-sm italic mb-4">No description</p>
	{/if}

	<!-- Footer -->
	<div class="flex items-center justify-between pt-4 border-t border-slate-700/50">
		<span class="text-xs text-slate-500">
			{new Date(project.createdAt).toLocaleDateString()}
		</span>
		<div class="flex items-center gap-1 text-green-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
			Open
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</div>
	</div>
</div>
