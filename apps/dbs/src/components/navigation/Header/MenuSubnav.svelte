<script>
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let selected;
	$: current_url = ``;

	onMount(() => {
		current_url = window.location.pathname;
	});

	export let links
</script>

	<div class="sm:hidden mx-auto w-2/3 justify-center mt-1">
	  <label for="tabs" class="sr-only">Select a tab</label>
	  <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
	  <select id="tabs" name="tabs" 
	  	class="flex w-full mb-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-900 dark:text-gray-200 dark:bg-gray-800 rounded-md"
		bind:value={selected}
		on:change={(el) => {goto(selected)}}>
		{#each links as link}
		<option selected={link.url == current_url} value={link.url}>
		  {link.title}
		</option>
		{/each}
	  </select>
	</div>

	  <nav class="hidden sm:flex border-b dark:border-gray-500 w-full mx-8 md:mx-24 lg:mx-36  space-x-8 justify-center" aria-label="Tabs">

		{#each links as link, i}
		<a href={link.url}
		on:click={() => current_url = link.url}
		class={
			"whitespace-nowrap pb-1 px-1 border-b-2  font-medium text-sm md:text-base " +
			(link.selected ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400" :
			"border-transparent text-gray-700 dark:text-gray-200 hover:text-gray-700 hover:border-gray-400")
		}>
		  {link.title}
		</a>
		{/each}
	  </nav>

