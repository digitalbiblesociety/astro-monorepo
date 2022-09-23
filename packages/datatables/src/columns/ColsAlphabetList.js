import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function alphabetsColumns(table) {
	return [
		table.column({
			header: "Title",
			id: "name",
			accessor: (item) => item,
			cell: ({ value }) => createRender(Cell, {
				title: value.name,
				subtitle: value.family,
				href: '/' + locale + "/alphabets/" + value.script,
			}),
			plugins: {
				sort: {
					getSortValue: (i) => i.name + i.family,
				},
				tableFilter: {
					getFilterValue: (i) => i.name + i.family,
				},
			},
		}),
		table.column({
			header: "Type",
			accessor: 'type',
		}),
];
}