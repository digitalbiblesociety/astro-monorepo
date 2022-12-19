<script>
import { onMount } from "svelte"
import { shortcut } from "../../utils.js"
import Fuse from "fuse.js"

let query = ''
let results = []
let result_ordered = []
let search_input
let search_data = []
let engine
let dropdown_visible = false

// Mount and load the site index
onMount(async () => {
	const api_base_url = import.meta.env.BASE_API
	const response = await fetch(`https://cdn.jsdelivr.net/gh/digitalbiblesociety/data/bibles_dbs.json`)
	search_data = await response.json()

	let search_input = []
	//for (const section_type in search_data) {
	//	search_data[section_type].map((item) => {
	//		item.type = section_type
	//		search_input.push(item)
	//	})
	//}

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

	results.forEach((resultItem) => {
		resultItem = highlighter(resultItem)
	})
	if (results.length > 0) {
		dropdown_visible = true
	} else {
		dropdown_visible = false
	}

	result_ordered = results.reduce(function (r, a) {
		r[a.item.type] = r[a.item.type] || []
		r[a.item.type].push(a)
		return r
	}, Object.create(null))
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
			<div
				class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">

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
				use:shortcut="{{
					control: true,
					code: 'KeyG',
					callback: () => {
						search_input.focus()
					},
				}}"
				autocomplete="off"
				class="block w-full rounded-md border border-stone-100 bg-stone-200 py-1 pl-10 pr-3 text-sm text-stone-700
						placeholder-stone-700 dark:border-stone-700 dark:bg-stone-700 dark:text-stone-100 dark:placeholder-stone-100" />
		</div>
	</div>
</div>

{#if results.length && dropdown_visible}
	<div class="search-results absolute top-20 bottom-0 right-0 left-0 z-50">
		<div class="mx-auto mt-3 flex w-5/6 flex-row flex-wrap">
			<div class="absolute inset-x-0 z-10 transform shadow-lg">
				<div class="relative mx-auto max-w-4xl text-center">
					<div
						class="rounded-2xl bg-white px-4 py-8 dark:bg-stone-800 sm:py-12 sm:px-6 lg:px-8 xl:pl-12">
						<div>
							<h3
								class="text-sm font-medium uppercase tracking-wide text-stone-500">
								"common.Bibles"
							</h3>
							<ul class="mt-6 space-y-6">
								{#if result_ordered["bibles"]}
									{#each result_ordered["bibles"].slice(0, 10) as bible}
										<li class="flow-root">
											<a
												on:click="{() => {
													dropdown_visible = false
												}}"
												href="/bibles/{bible.item.id}"
												class="-m-3 flex justify-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-stone-100 dark:hover:bg-stone-900">
												<div class="hidden shrink-0 sm:block"></div>
												<div class="min-w-0 flex-1 sm:ml-8">
													<h4
														class="truncate text-base font-medium text-stone-900 dark:text-stone-200">
														{bible.item.tt}
													</h4>
													<p
														class="mt-1 text-sm text-stone-500 dark:text-stone-300">
														{bible.item.tv}
													</p>
												</div>
											</a>
										</li>
									{/each}
								{/if}
							</ul>
						</div>
						<div class="mt-6 text-sm font-medium">
							<a
								on:click="{() => {
									dropdown_visible = false
								}}"
								href="/bibles/"
								class="text-blue-600 transition duration-150 ease-in-out hover:text-blue-500">
								common.search_view_all_bibles
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
