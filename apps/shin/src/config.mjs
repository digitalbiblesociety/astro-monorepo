export const SITE = {
  name: "",
  domain: "https://mxa.bible.cloud",
  github: "https://github.com/digitalbiblesociety/findabible",
  apiUrl: "http://data.test",
  MX: {
    name: "Biblicos",
    locales: {
      en : 'English',
      es: 'Español'
    }
  },
  IN: {
    name: "Anusaran",
    locales: {
      en: 'English',
      hn: 'हिन्दी'
    }
  },
  EC: {
    name: "Ecuador",
    locales: {
      en: 'English',
      es: 'Español'
    }
  }
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
  },
  hn: {                                   /* should be defined in this config.ts file                                         */
    'bibles': 'बाइबल',
    'countries': 'देशों',
    'languages': 'बोली',
    'about': 'के बारे में',
    'faq': 'सामान्य प्रश्न',
    'suggestions': 'सुझाव',
    'contact': 'संपर्क करना',
  },
}