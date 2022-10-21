import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import CountryNameCell from "./cells/CountryNameCell";
import PopulationCell from "./cells/PopulationCell";

export default function countriesColumns(table, locale) {
  return [
    table.column(CountryNameCell(locale)),
    table.column(PopulationCell(locale)),
    table.column({
      header: "Region",
      accessor: "rn",
    }),
  ];
}