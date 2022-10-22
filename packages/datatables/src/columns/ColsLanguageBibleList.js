import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import BibleNameCell from "./cells/BibleNameCell";

export default function LanguageBiblesColumns(table, locale, t) {
  return [
    table.column(BibleNameCell(locale, t)),
    table.column({
      header: t?.date ?? "Date",
      accessor: "dt",
    }),
  ];
}