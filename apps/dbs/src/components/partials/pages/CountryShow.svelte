<script>
	import { onMount } from 'svelte'
	let infobox;
	export let locale;
	export let country;
	export let translations = {
		'population': 'Population',
		'languages': 'Languages',
		'official_language': 'Official Language',
		'religion_primary': 'Primary Religion',
		'world_watch_list': 'World Watch List',
		'persecution_type': 'Persecution Type',
		'overview': 'Overview',
	}

	const table_row = (row, locale) =>  `
	<tr class="py-4 text-sm">
		<td class="whitespace-nowrap px-6 text-stone-900 dark:text-stone-200">
			<a href=/${locale}/languages/${row.iso}>
				<div>${row.name}</div>
				<div class="text-xs italic text-stone-500 dark:text-stone-300">${row.autonym ?? ''}</div>
			</a>
		</td>
		<td class="hidden whitespace-nowrap px-6 sm:table-cell">${row.iso}</td>
	</tr>`

	let rows;
</script>


				{#if country}
				<div class="prose dark:prose-invert px-4 py-8">
					{country.overview}
					<a class="block mt-2 text-center" href={country.url_wiki}> Wikipedia </a>
				</div>

				<dl class="mx-4">
					<div class="flex justify-between py-1 text-sm">
						<dt>{translations.population}</dt>
						<dd>
							{new Intl.NumberFormat(country.population, {
								maximumSignificantDigits: 8
							}).format(country.population)}
						</dd>
					</div>
					<div class="flex justify-between py-1 text-sm">
						<dt>{translations.official_language}</dt>
						<dd>
							<a class="underline" href="/{locale}/languages/{country.official_language_iso}">
								{country.official_language}
							</a>
						</dd>
					</div>
					<div class="flex justify-between py-1 text-sm">
						<dt>{translations.languages}</dt>
						<dd>
							{country.languages.length}
						</dd>
					</div>
					<div class="flex justify-between py-1 text-sm">
						<dt>{translations.religion_primary}</dt>
						<dd>
							{country.religion_primary}
						</dd>
					</div>
					{#if country.persecution}
						<div class="mt-2 border-t border-b border-stone-200">
							<div class="flex justify-between py-1 text-sm">
								<dt>{translations.world_watch_list}</dt>
								<dd>
									{country.persecution.rank}
									<small class="align-top text-xs">
										({country.persecution.score})
									</small>
								</dd>
							</div>
							<div class="flex flex-col py-1 text-sm">
								<dt>{translations.persecution_type}</dt>
								<dd>
									{country.persecution.persecution_type}
								</dd>
							</div>
						</div>
					{/if}
				</dl>
				{/if}
				{#if infobox}
				<table class="infobox">
					{@html infobox}
				</table>
				{/if}