import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function resourcesColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.title,
          subtitle: value.title_vernacular ?? '',
          href: value.url,
        }),
    }),
    table.column({
      header: "Type",
      accessor: "type",
    }),
    table.column({
      header: "Date",
      accessor: "date",
    }),
  ];
}
