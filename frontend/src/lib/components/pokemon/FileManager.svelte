<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getToastStore, getModalStore, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { pokemonApi } from '$lib/api';
	import type { Pokemon, PokemonFile } from '$lib/types';
	import ConfirmDeleteModal from '$lib/components/modals/ConfirmDeleteModal.svelte';

	export let pokemon: Pokemon;

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const dispatch = createEventDispatcher();

	let tabSet = 0;
	let uploading = false;
	let selectedFiles: FileList | null = null;

	$: skinFiles = pokemon.files.filter((f) => f.type === 'skin' || f.folder === 'skins');
	$: photoFiles = pokemon.files.filter((f) => f.type === 'photo' || f.folder === 'photos');
	$: modelFiles = pokemon.files.filter((f) => f.type === 'model' || f.folder === 'models');
	$: otherFiles = pokemon.files.filter(
		(f) => !['skin', 'photo', 'model'].includes(f.type) && !f.folder
	);

	async function handleUpload() {
		if (!selectedFiles || selectedFiles.length === 0) return;

		const typeMap = ['skin', 'photo', 'model', 'other'];
		const type = typeMap[tabSet] as any;

		uploading = true;
		try {
			const files = Array.from(selectedFiles);
			const response = await pokemonApi.uploadFiles(pokemon._id, files, type);
			toastStore.trigger({
				message: `✓ ${files.length} file(s) uploaded`,
				background: 'bg-gradient-to-r from-green-500 to-emerald-500',
				classes: 'text-white font-semibold'
			});
			// Update pokemon data with new files
			pokemon = response.data;
			dispatch('filesUpdated');
			selectedFiles = null;
		} catch (error: any) {
			toastStore.trigger({
				message: error.response?.data?.message || 'Failed to upload files',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			uploading = false;
		}
	}

	async function handleDelete(fileId: string, fileName: string) {
		modalStore.trigger({
			type: 'component',
			component: { ref: ConfirmDeleteModal },
			meta: {
				title: 'Delete File',
				message: 'Are you sure you want to delete this file?',
				itemName: fileName,
				confirmText: 'Delete File'
			},
			response: async (confirmed: boolean) => {
				if (!confirmed) return;

				try {
					const response = await pokemonApi.deleteFile(pokemon._id, fileId);
					toastStore.trigger({
						message: '✓ File deleted',
						background: 'bg-gradient-to-r from-green-500 to-emerald-500',
						classes: 'text-white font-semibold'
					});
					// Update pokemon data with removed file
					pokemon = response.data;
					dispatch('filesUpdated');
				} catch (error) {
					toastStore.trigger({
						message: 'Failed to delete file',
						background: 'bg-gradient-to-r from-red-500 to-rose-500',
						classes: 'text-white font-semibold'
					});
				}
			}
		});
	}

	function downloadFile(url: string, name: string) {
		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		a.target = '_blank';
		a.click();
	}

	function renderFileList(files: PokemonFile[]) {
		return files;
	}
</script>

<div class="space-y-3">
	<h3 class="text-base font-bold text-slate-200 mb-2">Files</h3>

	<TabGroup>
		<Tab bind:group={tabSet} name="skins" value={0}>
			<span class="text-sm">Skins <span class="text-slate-500">({skinFiles.length})</span></span>
		</Tab>
		<Tab bind:group={tabSet} name="photos" value={1}>
			<span class="text-sm">Photos <span class="text-slate-500">({photoFiles.length})</span></span>
		</Tab>
		<Tab bind:group={tabSet} name="models" value={2}>
			<span class="text-sm">Models <span class="text-slate-500">({modelFiles.length})</span></span>
		</Tab>
		<Tab bind:group={tabSet} name="other" value={3}>
			<span class="text-sm">Other <span class="text-slate-500">({otherFiles.length})</span></span>
		</Tab>

		<svelte:fragment slot="panel">
			<div class="space-y-3 mt-3">
				<!-- Upload Area -->
				<div class="relative">
					<label class="block cursor-pointer group">
						<div class="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center transition-all duration-200 hover:border-green-500 hover:bg-green-500/5 {selectedFiles && selectedFiles.length > 0 ? 'border-green-500 bg-green-500/10' : ''}">
							<svg class="w-8 h-8 mx-auto mb-2 text-slate-500 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
							{#if selectedFiles && selectedFiles.length > 0}
								<p class="text-green-400 font-medium mb-0.5 text-sm">{selectedFiles.length} file(s) selected</p>
								<p class="text-xs text-slate-500">Click to change</p>
							{:else}
								<p class="text-slate-300 font-medium mb-0.5 text-sm">Click to upload</p>
								<p class="text-xs text-slate-500">or drag and drop</p>
							{/if}
						</div>
						<input
							type="file"
							multiple
							class="hidden"
							bind:files={selectedFiles}
							disabled={uploading}
						/>
					</label>

					{#if selectedFiles && selectedFiles.length > 0}
						<button
							class="modern-btn w-full mt-2 py-2 px-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
							on:click={handleUpload}
							disabled={uploading}
						>
							{#if uploading}
								<svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Uploading...
							{:else}
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								</svg>
								Upload {selectedFiles.length} file(s)
							{/if}
						</button>
					{/if}
				</div>

				<!-- File List -->
				{#if tabSet === 0}
					{@const files = renderFileList(skinFiles)}
					{#if files.length === 0}
						<div class="text-center py-12">
							<svg class="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
							</svg>
							<p class="text-slate-400">No skin files yet</p>
						</div>
					{:else}
						<div class="space-y-2">
							{#each files as file (file._id)}
								<div class="modern-card p-3">
									<div class="flex items-start gap-3">
										<div class="flex-1 min-w-0">
											<p class="font-medium text-slate-200 truncate" title="{file.name}">{file.name}</p>
											<p class="text-xs text-slate-400 mt-1">
												{new Date(file.uploadedAt).toLocaleDateString()}
											</p>
										</div>
										<div class="flex gap-2 flex-shrink-0">
											<button
												class="px-3 py-1.5 text-xs rounded-lg border border-slate-600 hover:border-green-500 hover:bg-green-500/10 text-slate-300 hover:text-green-400 transition-all duration-200"
												on:click={() => downloadFile(file.url, file.name)}
											>
												Download
											</button>
											<button
												class="px-3 py-1.5 text-xs rounded-lg border border-slate-600 hover:border-red-500 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all duration-200"
												on:click={() => handleDelete(file._id, file.name)}
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{:else if tabSet === 1}
					{@const files = renderFileList(photoFiles)}
					{#if files.length === 0}
						<div class="text-center py-12">
							<svg class="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p class="text-slate-400">No photo files yet</p>
						</div>
					{:else}
						<div class="grid grid-cols-2 gap-3">
							{#each files as file (file._id)}
								<div class="modern-card overflow-hidden group">
									<div class="aspect-video bg-slate-800/50 overflow-hidden">
										<img src={file.url} alt={file.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
									</div>
									<div class="p-2.5">
										<p class="text-xs text-slate-300 truncate mb-2" title="{file.name}">{file.name}</p>
										<div class="flex gap-1.5">
											<button
												class="flex-1 px-2 py-1.5 text-xs rounded-lg border border-slate-600 hover:border-green-500 hover:bg-green-500/10 text-slate-300 hover:text-green-400 transition-all duration-200"
												on:click={() => downloadFile(file.url, file.name)}
											>
												Download
											</button>
											<button
												class="w-8 h-8 rounded-lg border border-slate-600 hover:border-red-500 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all duration-200 flex items-center justify-center"
												on:click={() => handleDelete(file._id, file.name)}
												title="Delete"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{:else if tabSet === 2}
					{@const files = renderFileList(modelFiles)}
					{#if files.length === 0}
						<div class="text-center py-12">
							<svg class="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
							<p class="text-slate-400">No model files yet</p>
						</div>
					{:else}
						<div class="space-y-2">
							{#each files as file (file._id)}
								<div class="modern-card p-3">
									<div class="flex items-start gap-3">
										<div class="flex-1 min-w-0">
											<p class="font-medium text-slate-200 truncate" title="{file.name}">{file.name}</p>
											<p class="text-xs text-slate-400 mt-1">
												{new Date(file.uploadedAt).toLocaleDateString()}
											</p>
										</div>
										<div class="flex gap-2 flex-shrink-0">
											<button
												class="px-3 py-1.5 text-xs rounded-lg border border-slate-600 hover:border-green-500 hover:bg-green-500/10 text-slate-300 hover:text-green-400 transition-all duration-200"
												on:click={() => downloadFile(file.url, file.name)}
											>
												Download
											</button>
											<button
												class="px-3 py-1.5 text-xs rounded-lg border border-slate-600 hover:border-red-500 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all duration-200"
												on:click={() => handleDelete(file._id, file.name)}
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{:else}
					{@const files = renderFileList(otherFiles)}
					{#if files.length === 0}
						<div class="text-center py-12">
							<svg class="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
							</svg>
							<p class="text-slate-400">No other files yet</p>
						</div>
					{:else}
						<div class="space-y-2">
							{#each files as file (file._id)}
								<div class="modern-card p-3">
									<div class="flex items-start gap-3">
										<div class="flex-1 min-w-0">
											<p class="font-medium text-slate-200 truncate" title="{file.name}">{file.name}</p>
											<p class="text-xs text-slate-400 mt-1">
												{new Date(file.uploadedAt).toLocaleDateString()}
											</p>
										</div>
										<div class="flex gap-2 flex-shrink-0">
											<button
												class="px-3 py-1.5 text-xs rounded-lg border border-slate-600 hover:border-green-500 hover:bg-green-500/10 text-slate-300 hover:text-green-400 transition-all duration-200"
												on:click={() => downloadFile(file.url, file.name)}
											>
												Download
											</button>
											<button
												class="px-3 py-1.5 text-xs rounded-lg border border-slate-600 hover:border-red-500 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all duration-200"
												on:click={() => handleDelete(file._id, file.name)}
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		</svelte:fragment>
	</TabGroup>
</div>
