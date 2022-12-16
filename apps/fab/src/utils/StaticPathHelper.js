import { SITE } from '../config.js';
import {scope} from '../utils/env'

export function LocalePath () {
	return Object.keys(SITE.locales).map((locale) => ({
		params: { locale }
	})
)}

export async function MdPathFetch(pages) {
	const locales = Object.keys(SITE.locales)

	const page = pages.filter(mdPage => locales.some(locale => {
		return mdPage.file.includes(locale)
	}))

	return page.map(content => ({
		params: {
			locale: content.frontmatter.locale
		},
		props: {
			content
		},
	}))
}

export async function NestedResourcePath (type, id = 'id') {
	let data = await fetch(`${SITE.apiUrl}/${type}.json`).then((response) => response.json());

	if(scope != 'all') {
		switch (type) {
			case 'bibles':
				data = data.filter(bible => bible.ci == scope)
				break;
			case 'organizations':
			case 'countries':
				data = []
				break;
			case 'languages':
				data = data.filter(language => language.ci == scope)
				break;
			default:
				break;
		}
	}


	let returns = []
	const locales = Object.keys(SITE.locales)
	for (let i = 0; i < locales.length; i++) {
		const locale = locales[i];
		returns.push(data.map((item) => {
			return { params: { id: item[id], locale: locale } }
		}))
	}

	return [].concat.apply([], returns)
}