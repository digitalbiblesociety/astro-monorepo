import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import AlphabetNameCell from './cells/AlphabetNameCell.js'

export default function alphabetsColumns(table, locale) {
	return [
		table.column({header: "id",accessor: 'script'}),
		table.column(AlphabetNameCell(locale)),
		table.column({header: "Type",accessor: 'type'}),
];
}