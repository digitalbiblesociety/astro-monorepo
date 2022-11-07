import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import CountryNameCell from "./cells/CountryNameCell";

export default function resourcesColumns(table, locale, t) {
  return [
    table.column({
      header: t?.title ?? 'Title',
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: value.tv ?? '',
          href: value.url,
        }),
    }),
    table.column(CountryNameCell(locale, t)),
    table.column({ header: "iso", accessor: "iso" }),
  ];
}
