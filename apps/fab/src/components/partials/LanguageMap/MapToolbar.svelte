<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let eye = true;
	function clickEye() {
		eye = !eye;
		dispatch('click-eye', eye);
	}
</script>

<style>
	.selected {
		background-opacity: 25%;
	}
	
	button {
		width: 2rem;
		height: 2rem;
		border: 0;
		background-color: transparent;
		transition-property: background-color, background-opacity; 
		transition-duration: 250ms;
		border-radius: 0.375rem;
	}
</style>

<button type="button" on:click={clickEye} class:selected={eye} title="Show Markers">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="{eye ? 2 : 1}" viewBox="0 0 24 24" stroke="currentColor">
	{#if eye}
	<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
	{:else}
		<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
	{/if}
	</svg>
</button>