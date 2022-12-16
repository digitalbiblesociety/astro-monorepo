export function LocalePath (locales) {
	return Object.keys(locales).map((locale) => ({
		params: { locale }
	})
)}