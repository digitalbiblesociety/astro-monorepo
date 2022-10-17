import { createTable } from 'svelte-headless-table'
import { addColumnFilters, addColumnOrder, addSortBy, addTableFilter, addPagination, addSelectedRows } from 'svelte-headless-table/plugins'

export function initTable(data) {

	return createTable(data, {
		filter: addColumnFilters(),
		tableFilter: addTableFilter(),
		sort: addSortBy(),
		select: addSelectedRows({ initialSelectedDataIds: { 1: true } }),
		orderColumns: addColumnOrder(),
		page: addPagination({ initialPageSize: 20 }),
	});

}

