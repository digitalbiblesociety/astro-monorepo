export function getLanguageFromPath(URL){
	const lang = URL.pathname.split("/")[1];
	return lang;
}


export const SITE = {
	name: "",
	domain: "https://dbs.org",
	github: "https://github.com/digitalbiblesociety/findabible",
	apiUrl: "http://data.test",
	locales: {
		en: 'English',
		es: 'Español'
	}
  };
  