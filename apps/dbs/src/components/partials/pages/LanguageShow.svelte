<script>
	import Banner from "./Banner.svelte";
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@rgossiaux/svelte-headlessui';
	import Datatable from "@dbs/datatables";

	export let language
	export let locale

	export let translations = {
		title: language.name ?? '',
		subtitle: language.autonym ?? '',
		breadcrumbs: [],
	};

	let rows


let level_icons = {
	'L': '<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m8.6 20-1.4 1.3V9.5a4.4 4.4 0 0 0 3.9-4.3V0L8.9 2.2 6.7 0 4.5 2.2 2.4 0v5.2c0 2.2 1.7 4.1 3.9 4.3v4.7l-1.4-1.3A4.6 4.6 0 0 0 0 8.7c0 2.6 1.7 4.6 4.2 4.9l2.1 1.9v8c0 .3.2.5.5.5s.5-.2.5-.5v-1l2-1.8a4.7 4.7 0 0 0 4.3-4.9c-2.5 0-4.6 1.7-4.8 4.1Z" /></svg>',
	'N': '<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.4 2.7v-.2a4.5 4.5 0 0 0-4-2.5C11 0 9 2 9 4.4v9.8l-1.4-1.3a4.6 4.6 0 0 0-4.9-4.2c0 2.6 1.7 4.6 4.2 4.9L9 15.5v8c0 .3.2.5.5.5s.5-.2.5-.5v-1l2-1.8a4.7 4.7 0 0 0 4.3-4.9c-2.5 0-4.6 1.7-4.8 4.1l-1.4 1.3V4.4c0-1.9 1.5-3.4 3.4-3.4s2.4.7 3 1.8a4.4 4.4 0 0 0-3.9 4.3v5.2l2.2-2.2 2.2 2.2 2.2-2.2 2.2 2.2V7.1c0-2.2-1.7-4.1-3.9-4.3Z" /></svg>',
	'E': '<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .2a12 12 0 0 0-12 12v6.1C0 19.8 1.2 21 2.7 21H7v1.7c0 .6.5 1 1 1s1-.5 1-1V22c0-.2.1-.3.3-.3s.3.1.3.3v.7c0 .6.5 1 1 1s1-.5 1-1V22c0-.2.1-.3.3-.3s.3.1.3.3v.7c0 .6.5 1 1 1s1-.5 1-1V22c0-.2.1-.3.3-.3s.3.1.3.3v.7c0 .6.5 1 1 1s1-.5 1-1V21h4.3c1.5 0 2.7-1.2 2.7-2.7v-6.1C24 5.6 18.6.2 12 .2Zm-1.5 19 1.2-2c.1-.2.5-.2.6 0l1.2 2c.1.2 0 .5-.3.5h-2.4c-.3 0-.4-.3-.3-.5Zm-7.2-4.7c0-1.8 1.4-3.2 3.2-3.2s3.2 1.4 3.2 3.2-1.4 3.2-3.2 3.2a3.2 3.2 0 0 1-3.2-3.2Zm14.1 3.2c-1.8 0-3.2-1.4-3.2-3.2s1.4-3.2 3.2-3.2 3.2 1.4 3.2 3.2c0 1.8-1.4 3.2-3.2 3.2Z" /></svg>',
}

let stat_block = [
	//{title: 'Coordinates', value: language.latitude + ' ' + language.longitude},
	{title: 'location', value: language.location},
	{title: 'Glotto ID', value: language.glotto_id},
	{title: 'iso', value: language.iso},
	{title: 'level', value: language.level},
	{title: 'macroarea', value: language.macroarea},
	{title: 'population', value: Number(language.population).toLocaleString()},
	{title: 'Status ID', value: language.status_id}
]

const bibles = language.bibles.map(bible => {
	return {
		lc: locale,
		id: bible.id,
		tt: bible.title,
		tv: bible.title_vernacular,
		dt: bible.date,
		ci: bible.country_id,
		cn: bible.country?.name ?? ''
	}
})

</script>

{#if language}
<TabGroup>
<Banner
	translations={translations}>

	<span slot="tabs">
	<TabList>
		<div class="relative z-10 flex flex-row justify-center divide-x divide-stone-200 rounded-tl-lg rounded-tr-lg w-1/2 lg:w-1/3 mx-auto">
		{#if language.bibles.length != 0}
			<Tab class="flex flex-grow justify-center bg-stone-50 bg-opacity-50 text-stone-800 border-transparent hover:border-emerald-600 hover:bg-emerald-600 hover:text-stone-200 whitespace-nowrap py-2 border-b-2 text-sm">
				Bibles
				<span
					class="bg-stone-100 text-stone-900 hidden ml-3 py-0.5 px-2.5 rounded-full text-xs md:inline-block">
					{language.bibles.length}
				</span>
			</Tab>
		{/if}
		{#if language.films.length != 0}
			<Tab class="flex flex-grow justify-center bg-stone-50 bg-opacity-50 text-stone-800 border-transparent hover:border-emerald-600 hover:bg-emerald-600 hover:text-stone-200 whitespace-nowrap py-2 border-b-2 text-sm">
			Films
				<span
					class="bg-stone-100 text-stone-900 hidden ml-3 py-0.5 px-2.5 rounded-full text-xs md:inline-block">
					{language.films.length}
				</span>
			</Tab>
		{/if}
		{#if language.resources.length != 0}
		<Tab class="flex flex-grow justify-center bg-stone-50 bg-opacity-50 text-stone-800 border-transparent hover:border-emerald-600 hover:bg-emerald-600 hover:text-stone-200 whitespace-nowrap py-2 border-b-2 text-sm">
			Resources
				<span
					class="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-sm font-medium text-stone-800">
					{language.resources.length}
				</span>
			</Tab>
		{/if}
	</div>
	</TabList>
	</span>
</Banner>

	<!--
	<StatBlock stat_block={stat_block} />
	-->

<div class="flex">
<div class="flex-grow">

	<TabPanels>
		{#if bibles.length != 0}
			<TabPanel>
				<Datatable inputData="{bibles}" locale={locale} tableType="language_bibles" />
			</TabPanel>
		{/if}
		{#if language.films.length != 0}
			<TabPanel>
				<Datatable inputData="{language.films}" locale={locale} tableType="films" />
			</TabPanel>
		{/if}
		{#if language.resources.length != 0}
			<TabPanel>
				<Datatable inputData="{language.resources}" locale={locale} tableType="resources" />
			</TabPanel>
		{/if}
	</TabPanels>

</div>
</div>
</TabGroup>
{/if}