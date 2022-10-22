import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import CountryNameCell from "./cells/CountryNameCell";
import PopulationCell from "./cells/PopulationCell";

export default function countriesColumns(table, locale, t) {
  return [
    table.column(CountryNameCell(locale, t)),
    table.column(PopulationCell(locale, t)),
    table.column({
      header: t?.region ?? "Region",
      accessor: "rn",
    }),
  ];
}