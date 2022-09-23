import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export function filmsColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.title,
          href: value.url,
        }),
    }),
  ];
}