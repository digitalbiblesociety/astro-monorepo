import ColsAlphabetList from "./ColsAlphabetList";
import ColsBibleList from "./ColsBibleList";
import ColsCountryList from "./ColsCountryList"
import ColsFilmsList from "./ColsFilmsList"
import ColsResourceList from "./ColsResourceList"
import ColsLanguageList from "./ColsLanguageList"
import ColsLanguageBibleList from "./ColsLanguageBibleList"
import ColsCountryLanguage from './ColsCountryLanguage'
import ColsOrganizationList from './ColsOrganizationList.js'

export default function columnTypes(tableType, table, locale) {
	switch (tableType) {
		case "languages":
			return ColsLanguageList(table, locale)
		case "language_bibles":
			return ColsLanguageBibleList(table, locale)
		case "bibles":
			return ColsBibleList(table, locale)
		case "countries":
			return ColsCountryList(table, locale)
		case "alphabets":
			return ColsAlphabetList(table, locale)
		case "films":
			return ColsFilmsList(table, locale)
		case "resources":
			return ColsResourceList(table, locale)
		case "organizations":
			return ColsOrganizationList(table, locale)
		case "country_languages":
			return ColsCountryLanguage(table, locale)
	}
}