import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function organizationsColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      plugins: {
        sort: {
          getSortValue: (i) => i.tt,
        },
        tableFilter: {
          getFilterValue: (i) => i.tt,
        },
      },
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: '',
          href: '/' + locale + "/organizations/" + value.id,
        }),
    }),
    table.column({
      header: "Country",
      id: "country-block",
      accessor: (item) => item,
      plugins: {
        sort: {
          getSortValue: (i) => i.cn + i.ci,
        },
        tableFilter: {
          getFilterValue: (i) => i.cn + i.ci,
        },
      },
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.cn,
          icon: `<svg class="mr-1 inline-block h-5 w-5 drop-shadow-md"><use href="/img/flags.svg#${value.ci}" xlink:href="#${value.ci}"></use></svg>`,
        }),
    }),
  ];
}