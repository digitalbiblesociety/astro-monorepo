
import { createRender } from "svelte-headless-table";
import Cell from "./partials/Cell.svelte";

export function filmsColumns(table) {
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

export function resourcesColumns(table) {
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
      header: "Author",
      accessor: "author",
    }),
  ];
}

export function languagesColumns(table) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: value.iso,
          href: "/languages/" + value.id,
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

export function languagebiblesColumns(table) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: value.tv,
          href: "/bibles/" + value.id,
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

export function alphabetsColumns(table) {
  return [
    table.column({
      header: "Title",
      id: "name",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.name,
          subtitle: value.family,
          href: "/alphabets/" + value.script,
        }),
    }),
  ];
}
