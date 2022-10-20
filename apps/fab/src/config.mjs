export const SITE = {
  name: "Find a Bible",
  domain: "https://find.bible",
  github: "https://github.com/digitalbiblesociety/findabible",
  apiUrl: "http://data.test/",
  locales: {
    en : 'English',
    es: 'Español'
  }
};

export function getLanguageFromPath(URL){
  const lang = URL.pathname.split("/")[1];
  return lang;
}