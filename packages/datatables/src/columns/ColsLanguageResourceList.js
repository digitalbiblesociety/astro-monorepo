import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";

export default function ColsLanguageResourceList(table, locale, t) {
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
  ];
}
