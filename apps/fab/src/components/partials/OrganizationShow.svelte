<script>
	import { onMount } from "svelte"
	import { browser } from '$app/env'
	import { Datatable } from "@dbs/svelte-datatables"
	import Breadcrumbs from "../../lib/Breadcrumbs.svelte"


	export let locale
	export let organization
	let rows

	const table_row = (row, locale) =>  `
	<tr>
		<td class="hidden whitespace-nowrap px-6 py-4 text-gray-900">${row.id}</td>
		<td class="whitespace-nowrap px-6 py-4 text-gray-900">
			<a href="/${locale}/languages/${row.id}">
				<div class="text-sm text-gray-900 dark:text-gray-300">${row.language ? row.language.name : ""}</div>
				<div class="text-xs italic text-gray-500">${row.iso}</div>
			</a>
		</td>
		<td class="px-6 py-4">
			<a class="max-w-sm overflow-hidden text-ellipsis text-sm" href="/${locale}/bibles/${row.id}">
				<div class="text-gray-900 dark:text-gray-300">${row.title}</div>
				<div class="text-gray-500">${row.title_vernacular ?? ""}</div>
			</a>
		</td>
		<td class="hidden whitespace-nowrap px-6 py-4 text-gray-900 md:table-cell">${row.date}</td>
	</tr>`

</script>
	
{#if organization}

<div class="relative flex flex-col -mb-9 pb-5 xl:rounded-tl-xl xl:rounded-tr-xl text-gray-100 text-2xl text-center h-32"
	style="background-image: linear-gradient(to bottom right, {organization.colors.primary}, {organization.colors.secondary});">
	<div class="start">
		<Breadcrumbs
			breadcrumbs="{[
				{ link: '/${locale}/wiki/', title: "Wiki" },
				{ link: '/${locale}/wiki/organizations', title: "Agencies" },
				{ link: '#', title: organization.name },
			]}" />
	</div>
	<h1 class="text-center text-3xl font-extrabold leading-8 tracking-wider text-white-900 xl:text-4xl">{organization.name}</h1>
	<div class="absolute top-0 right-4 sm:right-0 flex">
		<a class="p-1" href={organization.url_website}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
			  </svg>
		</a>
		<a class="p-1" href={organization.url_facebook}>
			
		</a>
		<a class="p-1" href={organization.url_donate}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
			</svg>
		</a>
		<a class="p-1" href={organization.url_twitter}>
		
		</a>
	</div>
</div>

	<div>
		<div>
			{#if organization.bibles || organization.resources}
			{#if browser}
			<Datatable classList="relative" data={organization.bibles} bind:dataRows="{rows}">
				<thead>
					<th data-name="id" data-key="id" class="hidden">id</th>
					<th data-name="file_set" data-key="fs" class="hidden">file_set</th>
					<th data-name="language" data-key="(row) => row.language.name + ' ' + row.iso" class="sortable">Language</th>
					<th data-name="title" data-key="(row) => row.tt + ' ' + row.tv" class="sortable">title</th>
					<th data-name="date" data-key="dt" class="sortable hidden md:table-cell">date</th>
				</thead>
				<tbody>
					{#if rows}
						{#each $rows as row}
							{@html table_row(row, locale)}
						{/each}
					{/if}
				</tbody>
			</Datatable>
			{/if}
			<noscript>
				<table>
				<thead>
					<th>Language</th>
					<th>title</th>
					<th class="hidden md:table-cell">Date</th>
				</thead>
				<tbody>
						{#each organization.bibles as row}
							{@html table_row(row, locale)}
						{/each}
				</tbody>
			</table>
			</noscript>
			{/if}
		</div>
	</div>
{/if}