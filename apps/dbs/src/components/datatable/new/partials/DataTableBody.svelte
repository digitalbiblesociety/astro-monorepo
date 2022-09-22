<script>
import { Render, Subscribe } from 'svelte-headless-table'
import DtHeader from './DataTableHeader.svelte'
import DtPagination from './DataTablePagination.svelte'
import DtSearch from './DataTableSearch.svelte'

export let table;
export let columns;

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