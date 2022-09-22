<script>
	export let pluginStates;
	const { filterValue } = pluginStates.tableFilter;
</script>

<div class="mx-auto max-w-xl my-8">
	<div class="mt-1 relative flex items-center">
	  <input type="text" name="search" id="search" 
	  bind:value={$filterValue} 
	  placeholder="Filter the table rows..."
	  class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full pr-12 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900">
	  <div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
		<kbd class="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded px-2 text-sm font-sans font-medium text-gray-400"> ⌘K </kbd>
	  </div>
	</div>
</div>