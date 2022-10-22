import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function filmsColumns(table, locale, t) {
  return [
    table.column({
      header: t?.title ?? "Title",
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