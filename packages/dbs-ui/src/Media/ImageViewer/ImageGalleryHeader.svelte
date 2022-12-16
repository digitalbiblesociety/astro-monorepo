<script>
	import LoginDropdown from './LoginDropdown.svelte'
	import GalleryModeSwitcher from './GalleryModeSwitcher.svelte'
	import Search from '../../Search/Search.svelte';

	export let t
	export let art
</script>

<div class="relative z-10 flex h-16 w-full flex-shrink-0 border-b border-stone-200 dark:border-stone-700 shadow-sm">
	<div class="flex flex-1 justify-between px-4 sm:px-6">
		<div class="flex flex-1">
			<div class="flex w-full md:ml-0" action="#" method="GET">
				<label for="desktop-search-field" class="sr-only">Search all files</label>
				<label for="mobile-search-field" class="sr-only">Search all files</label>
				<Search let:results={results} search_data={art} keys={['tt','at']} types={[0]} t={t}>
					{#if results.length !== 0}
					<ul class="mt-6 space-y-6">
						{#each results.slice(0, 6) as result}
							<li class="flow-root">
								<a
									on:click="{() => { dropdown_visible = false }}"
									href="/art/{result.item.id}"
									class="-m-3 flex justify-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-stone-100 dark:hover:bg-stone-900">
									<div class="hidden shrink-0 sm:block overflow-hidden">
										<img class="object-cover h-12 w-12 rounded-lg" src={`https://dbs-art.s3.amazonaws.com/picture/thumb/${result.item.fn}`} alt={result.item.tt} />
									</div>
									<div class="min-w-0 flex-1 sm:ml-8">
										<h4 class="truncate text-base font-medium text-stone-900 dark:text-stone-200">{result.item.tt}</h4>
										<p class="mt-1 text-sm text-stone-500 dark:text-stone-300">
											{ result.item.at }
										</p>
									</div>
									<div>
										<p class="truncate text-base font-medium text-stone-900 dark:text-stone-200">{ result.item.dt ?? '' }</p>
										<p class="mt-1 text-sm text-stone-500 dark:text-stone-300">
											{ result.item.rf ?? '' }
										</p>
									</div>
								</a>
							</li>
						{/each}
					</ul>
					{/if}
				</Search>
			</div>
		</div>
	<div class="hidden ml-2 items-center space-x-4 sm:ml-6 sm:space-x-6">
		<div class="relative flex-shrink-0">
			<LoginDropdown />
		</div>
		<button type="button" class="flex items-center justify-center rounded-full bg-stone-600 p-1 text-white hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2">
		<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
		<span class="sr-only">Add file</span>
		</button>
	</div>
	</div>
</div>

<GalleryModeSwitcher {t} />