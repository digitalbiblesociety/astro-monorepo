import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import AlphabetNameCell from './cells/AlphabetNameCell.js'

export default function alphabetsColumns(table, locale, t) {
	return [
		table.column({header: "id",accessor: 'script'}),
		table.column(AlphabetNameCell(locale, t)),
		table.column({header: "Family",accessor:'family'}),
		table.column({header: "Type",accessor: 'type'}),
];
}