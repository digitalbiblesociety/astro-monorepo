<script>
  import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";

	export let films
	export let langId

	let currentFilm

	async function playFilm(filmId, langId) {
		const filmsResponse = await fetch(`https://api.arclight.org/v2/media-components/${filmId}/languages/${langId}?apiKey=52b06248a3c6e8.12980089`);
		currentFilm = await filmsResponse.json();
		console.log(currentFilm)
		isOpen = !isOpen
	}

	function humanReadable(timeInMilliseconds) {
		var date = new Date(timeInMilliseconds);
		var str = '';
		str += date.getUTCHours() + ' Hours, ';
		str += date.getUTCMinutes() + ' Minutes';
		return str;
	}

	function getSize(size) {
	        var sizes = [' Bytes', ' KB', ' MB', ' GB', 
	                     ' TB', ' PB', ' EB', ' ZB', ' YB'];
	        
	        for (var i = 1; i < sizes.length; i++) {
	            if (size < Math.pow(1024, i)) 
	              return (Math.round((size / Math.pow(
	                1024, i - 1)) * 100) / 100) + sizes[i - 1];
	        }
	        return size;
	}

  let isOpen = false;
</script>

<Dialog class="relative z-30" open={isOpen} on:close={() => (isOpen = false)}>
  <DialogOverlay class="fixed inset-0 bg-stone-500 bg-opacity-75 transition-opacity" />

  <div class="fixed inset-0 z-40 overflow-y-auto">
	<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
	  <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-stone-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

		<div class="flex justify-center w-full aspect-video pt-8 pl-2">{@html currentFilm?.webEmbedPlayer ?? ''}</div>

		<!-- Close -->
		<div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
			<button type="button" on:click={() => (isOpen = !isOpen)} class="rounded-md bg-white dark:bg-stone-900 text-stone-400 hover:text-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
			  <span class="sr-only">Close</span>
			  <!-- Heroicon name: outline/x-mark -->
			  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			  </svg>
			</button>
		  </div>


		<div class="bg-stone-50 dark:bg-stone-900 px-4 py-3 flex flex-col sm:px-6">
			<h2 class="w-full text-md text-center py-2">Downloads</h2>
			<div class="flex flex-row justify-center">
		  {#if currentFilm?.downloadUrls?.high}
		  <a class="mt-3 inline-flex w-full justify-center rounded-md dark:text-stone-200 border border-stone-300 dark:border-stone-900 bg-white dark:bg-stone-800 px-4 py-2 text-base font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" href="{currentFilm.downloadUrls.high.url}">High Quality ({ getSize(currentFilm?.downloadUrls?.high?.sizeInBytes) })</a>
		  {/if}
		  {#if currentFilm.downloadUrls?.low}
			  <a class="mt-3 inline-flex w-full justify-center rounded-md dark:text-stone-200 border border-stone-300 dark:border-stone-900 bg-white dark:bg-stone-800 px-4 py-2 text-base font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" href="{currentFilm.downloadUrls.low.url}">Mobile Ready ({  getSize(currentFilm?.downloadUrls?.low?.sizeInBytes) })</a>
		  {/if}
			</div>
		</div>
	  </div>
	</div>
  </div>

</Dialog>


{#each films['_embedded']['mediaComponents'] as film}
<div>
	{#if film.subType == 'featureFilm'}
		<button class="relative overflow-hidden rounded" on:click={() => playFilm(film.mediaComponentId, langId)}>
			<figure>
				{#if film.imageUrls.mobileCinematicHigh}
					<img class="block w-full" alt={film.title} src={film.imageUrls.mobileCinematicHigh} />
				{/if}
				<figcaption class="absolute bottom-0 top-0 flex w-full flex-col place-items-center justify-center bg-black/40 text-center text-white hover:bg-black/80">
					<div class="text-lg lg:text-xl">{film.title}</div>
					<div class="mt-1 text-sm opacity-70 lg:mt-1.5 lg:text-base">
						{ humanReadable(film.lengthInMilliseconds) }
					</div>
				</figcaption>
			</figure>
		</button>
	{/if}
</div>
{/each}
