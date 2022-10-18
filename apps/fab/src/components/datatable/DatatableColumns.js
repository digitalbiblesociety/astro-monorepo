import { createRender } from "svelte-headless-table";
import Cell from "./partials/Cell.svelte";

export function countriesColumns(table, locale) {
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

export function filmsColumns(table, locale) {
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

export function resourcesColumns(table, locale) {
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

export function biblesColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: value.tv,
          href: '/' + locale + "/bibles/" + value.id,
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
    table.column({
      header: "Language",
      accessor: "ln",
    }),
    table.column({
      header: "Country",
      id: "cn",
      accessor: (item) => item.cn,
    }),
  ];
}

export function languagesColumns(table, locale) {
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
    table.column({
      header: "Country",
      id: "country-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.cn,
          icon: "",
          href: '/' + locale + "/countries/" + value.ci,
        }),
    }),
  ];
}

export function languagebiblesColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.tt,
          subtitle: value.tv,
          href: '/' + locale + "/bibles/" + value.id,
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

export function countryLanguagesColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "title-block",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.name,
          subtitle: value.autonym,
          href: '/' + locale + "/languages/" + value.iso,
        }),
    }),
    table.column({
      header: "Population",
      cell: ({ value }) => value.toLocaleString("en-US"),
      accessor: "population",
    }),
  ];
}

export function alphabetsColumns(table, locale) {
  return [
    table.column({
      header: "Title",
      id: "name",
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Cell, {
          title: value.name,
          subtitle: value.family,
          href: '/' + locale + "/alphabets/" + value.script,
        }),
    }),
  ];
}
