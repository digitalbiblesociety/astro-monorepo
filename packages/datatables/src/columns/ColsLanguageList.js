import LanguageNameCell from "./cells/LanguageNameCell";
import PopulationCell from "./cells/PopulationCell";

export default function languagesColumns(table, locale, t) {
  return [
    table.column(LanguageNameCell(locale, t)),
    table.column({header:'iso',accessor:'id'}),
    table.column(PopulationCell(locale, t)),
  ];
}