<script>
	import { readable } from 'svelte/store'
	import { Render, Subscribe, createTable } from 'svelte-headless-table'
	import { addColumnFilters, addColumnOrder, addSortBy, addTableFilter, addPagination, addSelectedRows } from 'svelte-headless-table/plugins'
	import {
		alphabetsColumns,
		biblesColumns,
		countriesColumns,
		filmsColumns,
		resourcesColumns,
		organizationsColumns,
		languagesColumns,
		languagebiblesColumns,
		countryLanguagesColumns } from './DatatableColumns.js'
	import DtPagination from './partials/DataTablePagination.svelte'
	import DtHeader from './partials/DataTableHeader.svelte'
	import DtSearch from './partials/DataTableSearch.svelte'
  
	export let tableType
	export let inputData
	export let locale

	const data = readable(inputData);
	const table = createTable(data, {
		filter: addColumnFilters(),
		tableFilter: addTableFilter(),
		sort: addSortBy(),
		select: addSelectedRows({ initialSelectedDataIds: { 1: true } }),
		orderColumns: addColumnOrder(),
		page: addPagination({ initialPageSize: 200 }),
	});

	const tHead = (table) => {
		switch (tableType) {
			case "languages":
				return languagesColumns(table, locale)
			case "language_bibles":
				return languagebiblesColumns(table, locale)
			case "bibles":
				return biblesColumns(table, locale)
			case "countries":
				return countriesColumns(table, locale)
			case "alphabets":
				return alphabetsColumns(table, locale)
			case "films":
				return filmsColumns(table, locale)
			case "resources":
				return resourcesColumns(table, locale)
			case "organizations":
				return organizationsColumns(table, locale)
			case "country_languages":
				return countryLanguagesColumns(table, locale)
		}
	}

	const columns = table.createColumns(tHead(table));
	const { flatColumns, headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates} = table.createViewModel(columns);
	const ids = flatColumns.map((c) => c.id);
	const { columnIdOrder } = pluginStates.orderColumns;
	$columnIdOrder = ids;
</script>

<DtSearch pluginStates={pluginStates} />

<table class="min-w-full divide-y divide-gray-300 dark:divide-gray-900 rounded-t-lg" {...$tableAttrs}>
	<DtHeader headerRows={$headerRows} />
	  <tbody class="divide-y divide-gray-200 dark:divide-gray-900 bg-white dark:bg-stone-700" {...$tableBodyAttrs}>
		{#each $pageRows as row (row.id)}
		  <Subscribe attrs={row.attrs()} let:attrs rowProps={row.props()} let:rowProps>
			<tr {...attrs} class:selected={rowProps.select.selected}>
			  {#each row.cells as cell (cell.id)}
				<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
				  <td
					class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
					{...attrs}
					class:sorted={props.sort.order !== undefined}
					class:matches={props.tableFilter.matches}
				  >
					  <Render of={cell.render()} />
				  </td>
				</Subscribe>
			  {/each}
			</tr>
		  </Subscribe>
		{/each}
	  </tbody>
</table>

<DtPagination {pluginStates} />
