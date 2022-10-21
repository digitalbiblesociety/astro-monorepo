import { createRender } from "svelte-headless-table";
import Cell from "../../partials/Cell.svelte";

export default function (locale) {
	return {
		header: "Title",
		id: "title-block",
		accessor: (item) => item,
		plugins: {
		  sort: {
			getSortValue: (i) => i.tt,
		  },
		  tableFilter: {
			getFilterValue: (i) => i.tt,
		  },
		},
		cell: ({ value }) =>
		  createRender(Cell, {
			title: value.tt,
			subtitle: '',
			href: '/' + locale + "/organizations/" + value.id,
		  }),
	  }
}