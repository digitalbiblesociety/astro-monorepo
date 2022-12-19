import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function ColsOrganizationResources(table, locale, t) {
  return [
    table.column({
      header: t?.title ?? 'Title',
      id: "title-block",
      accessor: (item) => item,
      plugins: {
        sort: {
          getSortValue: (i) => i.tt + i.tv,
        },
        tableFilter: {
          getFilterValue: (i) => i.tt + i.tv,
        },
      },
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: value.tv ?? '',
          href: value.url,
        }),
    }),

    table.column({
      header: t?.language ?? 'Language',
      id: "language-block",
      accessor: (item) => item,
      plugins: {
        sort: {
          getSortValue: (i) => i.ln + i.iso,
        },
        tableFilter: {
          getFilterValue: (i) => i.ln + i.iso,
        },
      },
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.ln,
          subtitle: value.iso ?? ''
        }),
    }),

    table.column({ header: t?.type ?? 'Type', accessor: "type" }),
    table.column({ header: "iso", accessor: "iso" }),
  ];
}
