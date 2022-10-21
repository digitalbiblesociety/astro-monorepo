import { createRender } from "svelte-headless-table";
import Cell from "../../partials/Cell.svelte";

export default function (locale) {
	return {
		header: "Alphabet",
		id: "alphabet-name",
		accessor: (item) => item,
		cell: ({ value }) => createRender(Cell, {
			title: value.name,
			href: '/' + locale + "/alphabets/" + value.script,
		})
	}
}