<script context="module">
	export async function load({ session }) {
		const { authenticated } = session;

		if (authenticated) {
			return { status: 302, redirect: '/dashboard' };
		}
		return {};
	}
</script>
<script>
	import { goto } from '$app/navigation';
	import { authClient } from '~/components/Auth/axios';
	import AuthSessionStatus from '~/components/Auth/SessionStatus.svelte';
	import AuthValidationErrors from '~/components/Auth/ValidationErrors.svelte';
	import { user } from '~/components/store.js';

	let email = '';
	let password = '';
	let status = null;
	let errors = [];

	async function submitForm(event) {
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);
		const loginResponse = await authClient.post('/api/login', formData).catch((e) => {
			console.log('LOGIN ERROR', e.response);
			errors = e.response.data.errors;
		});
		user.set(loginResponse.data);
		if (errors.length === 0) {
			goto('/dashboard'); // Does not trigger hook
		}
	}
</script>

<!-- Session Status -->
<AuthSessionStatus class="mb-4" {status} />
<AuthValidationErrors class="mb-4" {errors} />
<form on:submit|preventDefault={submitForm}>
	<!-- Email Address -->
	<div>
		<label for="email">Email</label>
		<input id="email" type="email" class="block mt-1 w-full" bind:value={email} required />
	</div>
	<!-- Password -->
	<div class="mt-4">
		<label for="password">Password</label>
		<input id="password" type="password" bind:value={password} class="block mt-1 w-full" required autoComplete="current-password" />
	</div>
	<!-- Remember Me -->
	<div class="block mt-4">
		<label for="remember_me" class="inline-flex items-center">
			<input id="remember_me" type="checkbox" name="remember" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
			<span class="ml-2 text-sm text-gray-600"> Remember me </span>
		</label>
	</div>
	<div class="flex items-center justify-end mt-4">
		<a href="/forgot-password" class="underline text-sm text-gray-600 hover:text-gray-900">
			Forgot your password?
		</a>
		<button class="ml-3">Login</button>
	</div>
</form>