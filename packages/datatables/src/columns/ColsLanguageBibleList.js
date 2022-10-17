import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function LanguageBiblesColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: value.tv,
          href: '/' + value.lc + "/bibles/" + value.id,
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
      header: "Date",
      accessor: "dt",
    }),
  ];
}