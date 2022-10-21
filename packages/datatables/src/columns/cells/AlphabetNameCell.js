import { createRender } from "svelte-headless-table";
import Cell from "../../partials/Cell.svelte";

export default function (locale) {
	return {
		header: "Alphabet",
		id: "alphabet-name",
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
	}
}



