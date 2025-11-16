<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { authStore } from '$lib/stores/authStore';
	import { authApi } from '$lib/api';
	import axios from 'axios';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let user: any = null;
	let loading = false;
	let editedUser = {
		name: '',
		email: '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	};

	authStore.subscribe((state) => {
		user = state.user;
		if (user) {
			editedUser.name = user.name || '';
			editedUser.email = user.email || '';
		}
	});

	async function handleUpdateProfile() {
		loading = true;
		try {
			// Update profile information
			const response = await axios.patch(
				`${import.meta.env.VITE_API_URL}/auth/profile`,
				{
					name: editedUser.name,
					email: editedUser.email
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			);

			// Update local auth store
			authStore.updateUser(response.data);

			toastStore.trigger({
				message: '✓ Profile updated successfully',
				background: 'bg-gradient-to-r from-green-500 to-emerald-500',
				classes: 'text-white font-semibold'
			});
		} catch (error: any) {
			toastStore.trigger({
				message: error.response?.data?.message || 'Failed to update profile',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			loading = false;
		}
	}

	async function handleChangePassword() {
		if (editedUser.newPassword !== editedUser.confirmPassword) {
			toastStore.trigger({
				message: 'Passwords do not match',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
			return;
		}

		if (editedUser.newPassword.length < 6) {
			toastStore.trigger({
				message: 'Password must be at least 6 characters',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
			return;
		}

		loading = true;
		try {
			await axios.patch(
				`${import.meta.env.VITE_API_URL}/auth/password`,
				{
					currentPassword: editedUser.currentPassword,
					newPassword: editedUser.newPassword
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			);

			// Clear password fields
			editedUser.currentPassword = '';
			editedUser.newPassword = '';
			editedUser.confirmPassword = '';

			toastStore.trigger({
				message: '✓ Password changed successfully',
				background: 'bg-gradient-to-r from-green-500 to-emerald-500',
				classes: 'text-white font-semibold'
			});
		} catch (error: any) {
			toastStore.trigger({
				message: error.response?.data?.message || 'Failed to change password',
				background: 'bg-gradient-to-r from-red-500 to-rose-500',
				classes: 'text-white font-semibold'
			});
		} finally {
			loading = false;
		}
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
			Profile Settings
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

	<!-- Avatar Section -->
	<div class="flex flex-col items-center mb-8 pb-6 border-b border-slate-700/50">
		<div class="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white text-3xl font-bold mb-4 ring-4 ring-slate-800">
			{editedUser.name?.charAt(0).toUpperCase() || editedUser.email?.charAt(0).toUpperCase() || 'U'}
		</div>
		<h3 class="text-xl font-semibold text-slate-100">{editedUser.name || 'User'}</h3>
		<p class="text-sm text-slate-400">{editedUser.email}</p>
	</div>

	<!-- Profile Information -->
	<div class="space-y-6 mb-6">
		<div>
			<h3 class="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
				<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				Profile Information
			</h3>
			<div class="space-y-4">
				<div>
					<label for="name" class="block text-sm font-medium text-slate-300 mb-2">Name</label>
					<input
						id="name"
						type="text"
						bind:value={editedUser.name}
						placeholder="Your name"
						class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					/>
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-slate-300 mb-2">Email</label>
					<input
						id="email"
						type="email"
						bind:value={editedUser.email}
						placeholder="your@email.com"
						class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					/>
				</div>
				<button
					on:click={handleUpdateProfile}
					disabled={loading}
					class="modern-btn w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Updating...' : 'Update Profile'}
				</button>
			</div>
		</div>

		<!-- Change Password -->
		<div class="pt-6 border-t border-slate-700/50">
			<h3 class="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
				<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
				</svg>
				Change Password
			</h3>
			<div class="space-y-4">
				<div>
					<label for="currentPassword" class="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
					<input
						id="currentPassword"
						type="password"
						bind:value={editedUser.currentPassword}
						placeholder="Enter current password"
						class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					/>
				</div>
				<div>
					<label for="newPassword" class="block text-sm font-medium text-slate-300 mb-2">New Password</label>
					<input
						id="newPassword"
						type="password"
						bind:value={editedUser.newPassword}
						placeholder="Enter new password"
						class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					/>
				</div>
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={editedUser.confirmPassword}
						placeholder="Confirm new password"
						class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
					/>
				</div>
				<button
					on:click={handleChangePassword}
					disabled={loading || !editedUser.currentPassword || !editedUser.newPassword}
					class="modern-btn w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Changing...' : 'Change Password'}
				</button>
			</div>
		</div>
	</div>

	<!-- Close Button -->
	<div class="pt-4 border-t border-slate-700/50">
		<button
			on:click={close}
			class="w-full py-3 px-4 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 font-medium transition-all duration-200"
		>
			Close
		</button>
	</div>
</div>
