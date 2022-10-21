import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import BibleNameCell from "./cells/BibleNameCell";

export default function biblesColumns(table, locale) {
	return [
	  table.column(BibleNameCell(locale)),
	  table.column({
		header: "Date",
		accessor: "dt",
	  }),
	  table.column({
		header: "Language",
		accessor: "ln",
	  }),
	];
  }