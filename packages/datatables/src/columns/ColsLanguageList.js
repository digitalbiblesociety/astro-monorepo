import LanguageNameCell from "./cells/LanguageNameCell";
import PopulationCell from "./cells/PopulationCell";

export default function languagesColumns(table, locale) {
  return [
    table.column(LanguageNameCell(locale)),
    table.column({header:'iso',accessor:'id'}),
    table.column(PopulationCell(locale)),
  ];
}