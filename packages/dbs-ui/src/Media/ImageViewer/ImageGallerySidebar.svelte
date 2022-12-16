<script>
	import { selectedArtwork } from './ImageStore.js'
</script>

{#if $selectedArtwork}
<aside class="max-w-1/3 border-l border-stone-200 dark:border-stone-700 p-8">
	<button on:click={() => selectedArtwork.set(undefined)}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>		  
	</button>
	<div class="space-y-6 pb-16">
	  <div>
		{#if $selectedArtwork?.filename}
		<div class="w-1/2 mx-auto block overflow-hidden rounded-lg">
		  <img src={'https://dbs-art.s3.amazonaws.com/picture/medium/' + $selectedArtwork.filename} class="object-cover" alt={ $selectedArtwork.title } />
		</div>
		<div class="mt-4 flex items-center">

			<h2 class="text-lg text-center text-stone-900 dark:text-stone-200">
				{ $selectedArtwork.title }
			</h2>

		  <!--
		  <button type="button" class="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
			<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
			  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
			</svg>
			<span class="sr-only">Favorite</span>
		  </button>
		  -->
		</div>
		{/if}
	  </div>
	  <div>
		{#if $selectedArtwork?.filename}
		<h3 class="font-medium text-stone-900 dark:text-stone-200">Information</h3>
		{/if}
		<dl class="mt-2 mx-6 divide-y divide-stone-200 border-t border-b border-stone-200">
			{#if Array.isArray($selectedArtwork.tags)}
				{#each $selectedArtwork.tags as tag}
					<div class="flex justify-between py-3 text-sm font-medium">
						<dt class="text-stone-500 dark:text-stone-300">{tag.tag}</dt>
						<dd class="whitespace-nowrap text-stone-900 dark:text-stone-200">{tag.description}</dd>
					</div>
				{/each}
			{/if}
		</dl>
	  </div>
	  <div>
		
		<div class="mt-2 flex items-center justify-between">
			{#if $selectedArtwork?.description}
				<h3 class="font-medium text-stone-900 dark:text-stone-200">Description</h3>
				<p class="text-sm italic text-stone-500">{ $selectedArtwork?.description }</p>
			{:else if ($selectedArtwork?.filename && !$selectedArtwork?.description)}
			<p class="text-sm italic text-stone-500">Add a description to this image.</p>
				<button type="button" class="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
				<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
				</svg>
				<span class="sr-only">Add description</span>
			</button>
		  {/if}
		</div>
	  </div>
	  {#if $selectedArtwork?.filename}
	  <div class="flex">
		<button type="button" class="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Download</button>
		<button type="button" class="ml-3 flex-1 rounded-md border border-stone-300 dark:border-stone-900 py-2 px-4 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Delete</button>
	  </div>
	  {/if}
	</div>
</aside>
{/if}