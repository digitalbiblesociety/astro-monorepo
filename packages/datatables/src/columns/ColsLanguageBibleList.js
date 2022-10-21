import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import BibleNameCell from "./cells/BibleNameCell";

export default function LanguageBiblesColumns(table, locale) {
  return [
    table.column(BibleNameCell(locale)),
    table.column({
      header: "Date",
      accessor: "dt",
    }),
  ];
}