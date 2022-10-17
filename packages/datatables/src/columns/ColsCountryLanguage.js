import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function countryLanguagesColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.name,
          subtitle: value.autonym,
          href: '/' + locale + "/languages/" + value.iso,
        }),
    }),
    table.column({
      header: "Population",
      cell: ({ value }) => value.toLocaleString("en-US"),
      accessor: "population",
    }),
  ];
}