<script>
	export let pluginStates
	const { pageIndex, pageCount, pageSize, hasPreviousPage, hasNextPage } = pluginStates.page;
</script>
  
<!-- TODO: Beautify PAge Size
<div>
	<label for="page-size">Page size</label>
	<input id="page-size" type="number" min={1} bind:value={$pageSize} />
</div>
-->

<nav class="border-t border-stone-200 dark:border-stone-800 px-4 flex items-center justify-between sm:px-0">
	<div class="-mt-px w-0 flex-1 flex">
	  <button
	  	on:click={() => $pageIndex--} disabled={!$hasPreviousPage}
	  	class="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-700 hover:border-stone-300">
		<!-- Heroicon name: solid/arrow-narrow-left -->
		<svg class="mr-3 h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
		  <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
		</svg>
	  </button>
	</div>
	<div class="hidden md:-mt-px md:flex">
		<span class="border-transparent text-stone-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"> 
			{$pageIndex + 1} of {$pageCount}
		</span>
	  </div>
	<div class="-mt-px w-0 flex-1 flex justify-end">
	  <button 
	  on:click={() => $pageIndex++} disabled={!$hasNextPage}
	  class="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-700 hover:border-stone-300">
		<!-- Heroicon name: solid/arrow-narrow-right -->
		<svg class="ml-3 h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
		  <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
		</svg>
	  </button>
	</div>
</nav>