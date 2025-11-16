<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let loading = false;

	// Theme settings
	let theme = 'dark';
	let accentColor = 'green';
	let compactMode = false;
	let animations = true;

	// Load settings from localStorage
	if (typeof window !== 'undefined') {
		theme = localStorage.getItem('theme') || 'dark';
		accentColor = localStorage.getItem('accentColor') || 'green';
		compactMode = localStorage.getItem('compactMode') === 'true';
		animations = localStorage.getItem('animations') !== 'false';
	}

	function saveSettings() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', theme);
			localStorage.setItem('accentColor', accentColor);
			localStorage.setItem('compactMode', String(compactMode));
			localStorage.setItem('animations', String(animations));
		}

		toastStore.trigger({
			message: '✓ Settings saved',
			background: 'bg-gradient-to-r from-green-500 to-emerald-500',
			classes: 'text-white font-semibold'
		});
	}

	function exportData() {
		toastStore.trigger({
			message: 'Export feature coming soon',
			background: 'bg-gradient-to-r from-blue-500 to-cyan-500',
			classes: 'text-white font-semibold'
		});
	}

	function close() {
		if ($modalStore[0]?.response) {
			$modalStore[0].response(false);
		}
		modalStore.close();
	}
</script>

<div class="modern-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
	<div class="flex justify-between items-center mb-6">
		<h2 class="text-2xl font-bold gradient-text" style="font-family: 'Space Grotesk', sans-serif;">
			Settings
		</h2>
		<button
			class="w-8 h-8 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center"
			on:click={close}
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<div class="space-y-6">
		<!-- Appearance Settings -->
		<div>
			<h3 class="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
				<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
				</svg>
				Appearance
			</h3>
			<div class="space-y-4">
				<!-- Theme -->
				<div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
					<div>
						<p class="text-sm font-medium text-slate-200">Theme</p>
						<p class="text-xs text-slate-400">Choose your preferred theme</p>
					</div>
					<select
						bind:value={theme}
						on:change={saveSettings}
						class="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					>
						<option value="dark">Dark</option>
						<option value="light" disabled>Light (Coming Soon)</option>
					</select>
				</div>

				<!-- Accent Color -->
				<div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
					<div>
						<p class="text-sm font-medium text-slate-200">Accent Color</p>
						<p class="text-xs text-slate-400">Primary accent color</p>
					</div>
					<select
						bind:value={accentColor}
						on:change={saveSettings}
						class="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					>
						<option value="green">Green</option>
						<option value="blue" disabled>Blue (Coming Soon)</option>
						<option value="purple" disabled>Purple (Coming Soon)</option>
					</select>
				</div>

				<!-- Compact Mode -->
				<div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
					<div>
						<p class="text-sm font-medium text-slate-200">Compact Mode</p>
						<p class="text-xs text-slate-400">Reduce spacing and padding</p>
					</div>
					<label class="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							bind:checked={compactMode}
							on:change={saveSettings}
							class="sr-only peer"
						/>
						<div class="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-green-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500"></div>
					</label>
				</div>

				<!-- Animations -->
				<div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
					<div>
						<p class="text-sm font-medium text-slate-200">Animations</p>
						<p class="text-xs text-slate-400">Enable UI animations</p>
					</div>
					<label class="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							bind:checked={animations}
							on:change={saveSettings}
							class="sr-only peer"
						/>
						<div class="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-green-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500"></div>
					</label>
				</div>
			</div>
		</div>

		<!-- Data & Storage -->
		<div class="pt-6 border-t border-slate-700/50">
			<h3 class="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
				<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
				</svg>
				Data & Storage
			</h3>
			<div class="space-y-3">
				<button
					on:click={exportData}
					class="w-full p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-green-500/50 hover:bg-green-500/10 text-slate-200 hover:text-green-400 transition-all duration-200 flex items-center justify-between"
				>
					<div class="text-left">
						<p class="text-sm font-medium">Export Data</p>
						<p class="text-xs text-slate-400">Download your data as JSON</p>
					</div>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Close Button -->
	<div class="pt-6 mt-6 border-t border-slate-700/50">
		<button
			on:click={close}
			class="w-full py-3 px-4 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 font-medium transition-all duration-200"
		>
			Close
		</button>
	</div>
</div>
