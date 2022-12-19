import ColsAlphabetList from "./ColsAlphabetList";
import ColsBibleList from "./ColsBibleList";
import ColsCountryList from "./ColsCountryList"
import ColsFilmsList from "./ColsFilmsList"
import ColsResourceList from "./ColsResourceList"
import ColsLanguageResourceList from "./ColsLanguageResourceList"
import ColsLanguageList from "./ColsLanguageList"
import ColsLanguageBibleList from "./ColsLanguageBibleList"
import ColsCountryLanguage from './ColsCountryLanguage'
import ColsOrganizationList from './ColsOrganizationList.js'
import ColsOrganizationResources from './ColsOrganizationResources.js'

export default function columnTypes(tableType, table, locale, t) {
	switch (tableType) {
		case "languages":
			return ColsLanguageList(table, locale, t)
		case "language_bibles":
			return ColsLanguageBibleList(table, locale, t)
		case "bibles":
			return ColsBibleList(table, locale, t)
		case "countries":
			return ColsCountryList(table, locale, t)
		case "alphabets":
			return ColsAlphabetList(table, locale, t)
		case "films":
			return ColsFilmsList(table, locale, t)
		case "language_resources":
			return ColsLanguageResourceList(table, locale, t)
		case "resources":
			return ColsResourceList(table, locale, t)
		case "organizations":
			return ColsOrganizationList(table, locale, t)
		case "organization_resources":
			return ColsOrganizationResources(table, locale, t)
		case "country_languages":
			return ColsCountryLanguage(table, locale, t)
	}
}