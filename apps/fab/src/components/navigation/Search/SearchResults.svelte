<script>
	import Result from './Result.svelte'

	export let results
	export let result_ordered
	export let locale
	export let t
</script>

{#if results.length}
	<div class="absolute inset-x-0 top-20 z-10 transform shadow-lg max-w-7xl mx-auto">
	  <div class="absolute inset-0 flex" aria-hidden="true">
		<div class="w-1/2 bg-white dark:bg-stone-700"></div>
		<div class="w-1/2 bg-stone-50 dark:bg-stone-800"></div>
	  </div>
	  <div class="relative mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
		<nav>
		<div class="px-4 pt-8 sm:pt-12 sm:px-6 lg:px-8 xl:pr-12">
		  {#if result_ordered["languages"]}
		  <div>
			<h3 class="text-base text-stone-500 dark:text-stone-100">{t?.languages ?? 'Languages'}</h3>
			<ul class="grid px-4 pt-8 grid-cols-2 sm:grid-cols-2 sm:gap-x-8 gap-y-4">
				{#each result_ordered["languages"].slice(0,6) as language}
					<div class="py-3">
						<Result item={language.item} path={`/${locale}/languages/${language.item.id}`} />
					</div>
			  	{/each}
			</ul>
		  </div>
		  {/if}
		  <div class="mt-6 text-sm">
			<a href={`/${locale}/languages`} class="text-primary-600 transition duration-150 ease-in-out hover:text-primary-500">
			  {t?.languages ?? 'Languages'}
			  <span aria-hidden="true"> &rarr;</span>
			</a>
		  </div>
		</div>
		<div class="py-6">
		  {#if result_ordered["organizations"]}
		  <span>
			<ul class="flex flex-row items-center justify-around border-t-2 mt-4 pt-4 border-stone-200">
				{#each result_ordered["organizations"].slice(0,2) as organization}
					<Result item={organization.item} path={`/${locale}/organizations/${organization.item.id}`} />
				{/each}
			</ul>
		  </span>
		  {/if}
		</div>
		</nav>
		<div class="px-4 py-8 sm:py-12 sm:px-6 lg:px-8 xl:pl-12">
		{#if result_ordered["bibles"]}
		  <div>
			<h3 class="text-base text-stone-500 dark:text-stone-100">{t?.bibles ?? 'Bibles'}</h3>
			<ul class="mt-6 space-y-6">
				{#each result_ordered["bibles"].slice(0,5) as bible}
					<Result item={bible.item} path={`/${locale}/bibles/${bible.item.id}`} />
				{/each}
			</ul>
		  </div>
		{/if}
		  <div class="mt-6 text-sm">
			<a href={`/${locale}/bibles`} class="text-primary-600 transition duration-150 ease-in-out hover:text-primary-500">
			  {t?.bibles ?? 'Bibles'}
			  <span aria-hidden="true"> &rarr;</span>
			</a>
		  </div>
		</div>
	  </div>
	</div>
{/if}