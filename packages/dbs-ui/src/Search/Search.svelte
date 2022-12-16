<script>
	import { onMount } from "svelte"
	import Fuse from "fuse.js"

	export let search_data = []
	export let url = undefined
	export let keys
	export let types
	export let t

	let query = ''
	let results = []
	let search_input

	let engine
	let dropdown_visible = false
	
	// Mount and load the site index
	onMount(async () => {

		if(!search_data) {
			const response = await fetch(url)
			search_data = await response.json()
		}
	
		engine = new Fuse(search_data, {
			shouldSort: true,
			includeMatches: true,
			threshold: 0.3, // At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
			location: 0, // Determines approximately where in the text is the pattern expected to be found
			distance: 50, // Determines how close the match must be to the fuzzy location (specified by location). An exact letter match which is distance characters away from the fuzzy location would score as a complete mismatch. A distance of 0 requires the match be at the exact location specified. A distance of 1000 would require a perfect match to be within 800 characters of the location to be found using a threshold of 0.8
			maxPatternLength: 12,
			minMatchCharLength: 1,
			keys: keys,
		})
	})
	
	let instantSearch = function () {
		results = engine.search(query).slice(0, 100)
		console.log('query', query)
		console.log(results)
		results.forEach((resultItem) => {
			resultItem = highlighter(resultItem)
		})

		dropdown_visible = (results.length > 0) ? true : false
	}
	
	let highlighter = function (resultItem) {
		resultItem.matches.forEach((matchItem) => {
			let text = resultItem.item[matchItem.key]
			let result = []
			let matches = [].concat(matchItem.indices)
			let pair = matches.shift()
	
			for (let i = 0; i < text.length; i++) {
				let char = text.charAt(i)
				if (pair && i == pair[0]) {
					result.push("<b>")
				}
				result.push(char)
				if (pair && i == pair[1]) {
					result.push("</b>")
					pair = matches.shift()
				}
			}
			resultItem.highlight = result.join("")
			resultItem.highlight_key = matchItem.key
	
			if (resultItem.children && resultItem.children.length > 0) {
				resultItem.children.forEach((child) => {
					highlighter(child)
				})
			}
		})
	}
</script>

<div class="relative z-0 flex flex-1 items-center justify-center px-2">
	<div class="w-full max-w-md">
		<div class="relative">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"  class="h-5 w-5 text-stone-600 dark:text-stone-100">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
				</svg>
			</div>
			<input
				type="search"
				placeholder="Search"
				bind:this="{search_input}"
				bind:value="{query}"
				on:input="{instantSearch}"
				aria-label="Search"
				autocomplete="off"
				class="block w-full rounded-md border border-stone-100 bg-stone-200 py-1 pl-10 pr-3 text-sm text-stone-700
						placeholder-stone-700 dark:border-stone-700 dark:bg-stone-700 dark:text-stone-100 dark:placeholder-stone-100" />
		</div>
	</div>
</div>


	<div class="search-results absolute top-20 bottom-0 right-0 left-0 z-50">
		<div class="mx-auto mt-3 flex w-5/6 flex-row flex-wrap">
			<div class="absolute inset-x-0 z-10 transform shadow-lg">
				{#if results.length != 0}
				<div class="relative mx-auto max-w-4xl border-2 rounded-2xl bg-white px-4 py-8 dark:bg-stone-800 dark:border-stone-700 sm:py-12 sm:px-6 lg:px-8 xl:pl-12">
					<slot results={results} />
				</div>
				{/if}
			</div>
		</div>
	</div>
