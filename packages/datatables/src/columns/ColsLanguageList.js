import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function languagesColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: value.iso,
          href: '/' + locale + "/languages/" + value.id,
        }),
      plugins: {
        sort: {
          getSortValue: (i) => i.tt + i.tv,
        },
        tableFilter: {
          getFilterValue: (i) => i.tt + i.tv,
        },
      },
    }),
    table.column({
      header: "Population",
      accessor: "po",
      cell: ({ value }) => value.toLocaleString("en-US"),
    }),
  ];
}