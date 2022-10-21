import { createRender } from "svelte-headless-table";
import Cell from "../../partials/Cell.svelte";

export default function (locale) {
	return {
		header: "Title",
		id: "title-block",
		accessor: (item) => item,
		cell: ({ value }) =>
		  createRender(Cell, {
			title: value.tt,
			subtitle: value.tv,
			href: '/' + locale + "/bibles/" + value.id,
		  }),
		plugins: {
		  sort: {
			getSortValue: (i) => i.tt + i.tv,
		  },
		  tableFilter: {
			getFilterValue: (i) => i.tt + i.tv,
		  },
		},
	}
}

