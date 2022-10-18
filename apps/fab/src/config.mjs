export const SITE = {
  name: "Find a Bible",
  domain: "https://find.bible",
  github: "https://github.com/digitalbiblesociety/findabible",
  apiUrl: "https://cdn.jsdelivr.net/gh/digitalbiblesociety/data/",
  locales: {
    en : 'English',
    es: 'Español'
  },
  postsPerPage: 6,
};

export function getLanguageFromPath(URL){
  const lang = URL.pathname.split("/")[1];
  return lang;
}

export const TRANSLATIONS = {
  en: {                                   /* should be defined in this config.ts file                                         */
    'bibles': 'Bibles',
    'countries': 'Countries',
    'languages': 'Languages',
    'about': 'About',
    'faq': 'FAQ',
    'suggestions': 'Suggestions',
    'contact': 'Contact',
  },
  es: {
    'bibles': 'Biblias',
    'countries': 'Países',
    'languages': 'Idiomas',
    'about': 'Sobre',
    'faq': 'Preguntas más frecuentes',
    'suggestions': 'Sugerencias',
    'contact': 'Contacto',
  }
}