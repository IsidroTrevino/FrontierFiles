<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { projectsApi } from '$lib/api';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let name = '';
	let description = '';
	let loading = false;

	async function handleSubmit() {
		loading = true;
		try {
			await projectsApi.create({ name, description });
			toastStore.trigger({
				message: '✓ Project created successfully',
				background: 'bg-gradient-to-r from-green-500 to-emerald-500',
				classes: 'text-white font-semibold'
			});
			
			// Close modal and notify parent to reload
			if ($modalStore[0]?.response) {
				$modalStore[0].response(true);
			}
			modalStore.close();
		} catch (error: any) {
			toastStore.trigger({
				message: error.response?.data?.message || 'Failed to create project',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		modalStore.close();
	}
</script>

<div class="modern-card p-8 w-modal max-w-lg">
	<div class="flex items-center gap-3 mb-6">
		<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center">
			<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</div>
		<h2 class="text-2xl font-bold text-slate-100">Create New Project</h2>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-5">
		<div class="space-y-2">
			<label for="project-name" class="block text-sm font-medium text-slate-300">
				Project Name <span class="text-red-400">*</span>
			</label>
			<input
				id="project-name"
				type="text"
				bind:value={name}
				placeholder="My Awesome Project"
				required
				class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
			/>
		</div>

		<div class="space-y-2">
			<label for="project-description" class="block text-sm font-medium text-slate-300">
				Description <span class="text-slate-500">(optional)</span>
			</label>
			<textarea
				id="project-description"
				bind:value={description}
				placeholder="What's this project about?"
				rows="3"
				class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 resize-none"
			/>
		</div>

		<div class="flex gap-3 pt-2">
			<button
				type="button"
				on:click={handleCancel}
				class="flex-1 px-4 py-3 rounded-xl border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 font-medium transition-all duration-200"
			>
				Cancel
			</button>
			<button
				type="submit"
				disabled={loading || !name.trim()}
				class="flex-1 modern-btn px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
			>
				{#if loading}
					<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Creating...
				{:else}
					Create Project
				{/if}
			</button>
		</div>
	</form>
</div>
