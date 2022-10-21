import { createRender } from "svelte-headless-table";
import Cell from "../partials/Cell.svelte";
import CountryNameCell from './cells/CountryNameCell'
import OrganizationNameCell from './cells/OrganizationNameCell'

export default function organizationsColumns(table, locale) {
  return [
    table.column(OrganizationNameCell(locale)),
    table.column(CountryNameCell(locale)),
  ];
}