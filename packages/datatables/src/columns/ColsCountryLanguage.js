import LanguageNameCell from "./cells/LanguageNameCell";
import PopulationCell from "./cells/PopulationCell";

export default function countryLanguagesColumns(table, locale, t) {
  return [
    table.column(LanguageNameCell(locale, t)),
    table.column(PopulationCell(locale, t)),
  ];
}