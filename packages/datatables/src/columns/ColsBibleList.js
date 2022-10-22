import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import BibleNameCell from "./cells/BibleNameCell";

export default function biblesColumns(table, locale, t) {
	return [
	  table.column(BibleNameCell(locale, t)),
	  table.column({
		header: t?.date ?? 'datez',
		accessor: "dt",
	  }),
	  table.column({
		header: t?.language ?? 'languagez',
		accessor: "ln",
	  }),
	];
  }