<script>
	import { readable } from 'svelte/store'
	import { initTable } from './BaseTable.js';
	import { alphabetsColumns, biblesColumns, countriesColumns, filmsColumns, resourcesColumns, languagesColumns, languagebiblesColumns, countryLanguagesColumns} from './DatatableColumns.js'
	import DataTableBody from './partials/DataTableBody.svelte';
  
	export let inputData
	export let tableType

	const tHead = (table) => {
		switch (tableType) {
			case "languages":
				return languagesColumns(table)
			case "language_bibles":
				return languagebiblesColumns(table)
			case "bibles":
				return biblesColumns(table)
			case "countries":
				return countriesColumns(table)
			case "alphabets":
				return alphabetsColumns(table)
			case "films":
				return filmsColumns(table)
			case "resources":
				return resourcesColumns(table)
			case "country_languages":
				return countryLanguagesColumns(table)
		}
	}

	
	const table = initTable(readable(inputData))
	const columns = table.createColumns(tHead(table));
</script>


<DataTableBody table={table} columns={columns} />


