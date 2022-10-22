import { createRender } from "svelte-headless-table";
import Cell from "../../partials/Cell.svelte";

export default function (locale, t) {
	return {
		header: t?.country ?? 'Country',
		id: "country-name-cell",
		accessor: (item) => item,
		plugins: {
		  sort: {
			getSortValue: (i) => i.cn + i.ci,
		  },
		  tableFilter: {
			getFilterValue: (i) => i.cn + i.ci,
		  },
		},
		cell: ({ value }) =>
		createRender(Cell, {
			title: value.cn,
			href: '/' + locale + "/countries/" + value.id,
			icon: `<svg class="mr-1 inline-block h-5 w-5 drop-shadow-md"><use href="/img/flags.svg#${value.ci}" xlink:href="#${value.ci}"></use></svg>`,
		}),
	}
}