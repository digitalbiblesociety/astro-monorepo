import LanguageNameCell from "./cells/LanguageNameCell";
import PopulationCell from "./cells/PopulationCell";

export default function languagesColumns(table, locale, t) {
  return [
    table.column(LanguageNameCell(locale, t)),
    table.column({header:'iso',accessor:'id'}),
    table.column(PopulationCell(locale, t)),
    table.column({header:t?.resources ?? 'resources',accessor:'rc'}),
    table.column({header:t?.films ?? 'films',accessor:'fc'}),
    table.column({header:t?.bibles ?? 'bibles',accessor:'bc'}),
  ];
}