import { createRender } from "svelte-headless-table";
import Cell from "../../partials/Cell.svelte";

export default function (locale, t) {
	return {
		header: t?.language ?? 'Language',
		id: "language-block",
		accessor: (item) => item,
		cell: ({ value }) =>
		  createRender(Cell, {
			title: value.tt,
			subtitle: value.tv,
			href: '/' + locale + "/languages/" + value.id,
		}),
		plugins: {
			sort: {
				getSortValue: (i) => i.tt + i.tv + i.iso,
			},
			tableFilter: {
				getFilterValue: (i) => i.tt + i.tv + i.iso,
			},
		},
	}
}