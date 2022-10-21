import LanguageNameCell from "./cells/LanguageNameCell";
import PopulationCell from "./cells/PopulationCell";

export default function countryLanguagesColumns(table, locale) {
  return [
    table.column(LanguageNameCell(locale)),
    table.column(PopulationCell(locale)),
  ];
}