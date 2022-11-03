import { createRender } from "svelte-headless-table";
import Cell from "../../partials/Cell.svelte";

export default function (locale, t) {
	return {
		header: t.title ?? 'Title',
		id: "bible-title-block",
		accessor: (item) => item,
		cell: ({ value }) =>
		  createRender(Cell, {
			title: value.tt,
			subtitle: value.tv,
			className: 'max-w-xl truncate',
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

