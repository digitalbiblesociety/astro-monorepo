import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import CountryNameCell from './cells/CountryNameCell'
import OrganizationNameCell from './cells/OrganizationNameCell'

export default function organizationsColumns(table, locale, t) {
  return [
    table.column(OrganizationNameCell(locale, t)),
    table.column(CountryNameCell(locale, t)),
  ];
}