<script>
	import { readable } from 'svelte/store'
	import { Render, Subscribe, createTable } from 'svelte-headless-table'
	import { addColumnFilters, addColumnOrder, addSortBy, addTableFilter, addPagination, addSelectedRows } from 'svelte-headless-table/plugins'
	import DtPagination from './partials/DataTablePagination.svelte'
	import DtHeader from './partials/DataTableHeader.svelte'
	import DtSearch from './partials/DataTableSearch.svelte'
	import ColumnTypes from './columns/ColumnTypes'
  
	export let defaultSort
	export let inputData
	export let tableType
	export let locale
	export let t
	
	const data = readable(inputData)
	const table = createTable(data, {
		filter: addColumnFilters(),
		tableFilter: addTableFilter(),
		sort: addSortBy(defaultSort),
		select: addSelectedRows({ initialSelectedDataIds: { 1: true } }),
		orderColumns: addColumnOrder(),
		page: addPagination({ initialPageSize: 200 }),
	});

	const columns = table.createColumns(ColumnTypes(tableType, table, locale, t));
	const { flatColumns, headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates} = table.createViewModel(columns);
	const ids = flatColumns.map((c) => c.id);
	const { columnIdOrder } = pluginStates.orderColumns;
	$columnIdOrder = ids;
</script>

<div class="dt-table">
<DtSearch t={t} pluginStates={pluginStates} />

<table class="w-full mx-auto divide-y divide-stone-300 dark:divide-stone-900 rounded-t-lg" {...$tableAttrs}>
	<DtHeader headerRows={$headerRows} />
	  <tbody class="divide-y divide-stone-200 dark:divide-stone-900 bg-white dark:bg-stone-700" {...$tableBodyAttrs}>
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
</div>