import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function countriesColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          icon: `<svg class="mr-1 inline-block h-5 w-5 drop-shadow-md"><use href="/img/flags.svg#${value.id}" xlink:href="#${value.id}"></use></svg>`,
          href: '/' + locale + "/countries/" + value.id,
        }),
    }),
    table.column({
      header: "Population",
      accessor: "po",
      cell: ({ value }) => value.toLocaleString("en-US"),
    }),
    table.column({
      header: "Region",
      accessor: "rn",
    }),
  ];
}