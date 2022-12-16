<script>
	import { onMount } from "svelte"
	import Fuse from "fuse.js"
	import SearchResults from "./Search/SearchResults.svelte"

	export let t;
	export let locale;
	
	let query = ''
	let results = []
	let result_ordered = []
	let search_input
	let search_data = []
	let search_items = []
	let engine
	let dropdown_visible = false
	let searchTypes
	
	// Mount and load the site index
	onMount(async () => {
		const response = await fetch(`/site.json`)
		const searchResponse = await response.json()
		search_data = searchResponse.data

		searchTypes = Object.keys(search_data)
		for (let i = 0; i < searchTypes.length; i++) {
			const type = searchTypes[i];
			for (let item_index = 0; item_index < search_data[type].length; item_index++) {
				search_data[type][item_index].type = type;
				search_items.push(search_data[type][item_index])
			}
		}
		search_data = search_items
	
		let search_input = []
	
		engine = new Fuse(search_data, {
			shouldSort: true,
			includeMatches: true,
			threshold: 0.3, // At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
			location: 0, // Determines approximately where in the text is the pattern expected to be found
			distance: 50, // Determines how close the match must be to the fuzzy location (specified by location). An exact letter match which is distance characters away from the fuzzy location would score as a complete mismatch. A distance of 0 requires the match be at the exact location specified. A distance of 1000 would require a perfect match to be within 800 characters of the location to be found using a threshold of 0.8
			maxPatternLength: 12,
			minMatchCharLength: 1,
			keys: ["tt", "tv", "id"],
		})
	})
	
	let instantSearch = function () {
		results = engine.search(query).slice(0, 100)
	
		result_ordered = results.reduce(function (r, a) {
			r[a.item.type] = r[a.item.type] || []
			r[a.item.type].push(a)
			return r
		}, Object.create(null))

		results.forEach((resultItem) => {
			resultItem = highlighter(resultItem)
		})
		if (results.length > 0) {
			dropdown_visible = true
		} else {
			dropdown_visible = false
		}
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

		<div class="block w-3/4 mx-auto lg:w-full max-w-lg mt-1 md:py-4 lg:py-0">
			<div class="relative mx-4">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
					</svg>
				</div>
				<input
					type="search"
					placeholder={t?.search ?? "Search"}
					bind:this="{search_input}"
					bind:value="{query}"
					on:input="{instantSearch}"
					aria-label="Search"
					autocomplete="off"
					class="block w-full rounded-md border border-stone-200 py-2 pl-10 text-sm text-stone-700 shadow
							placeholder-stone-700 dark:border-stone-700 dark:bg-stone-700 dark:text-stone-100 dark:placeholder-stone-100" />
			</div>
		</div>
	<SearchResults {t} {locale} {results} {result_ordered} />