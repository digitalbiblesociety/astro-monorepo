
export const currentScope = (scope) => {
  const scopes = {
    all: {
      title: "find.bible",
      domain: "https://find.bible",
      apiUrl: "http://data.test/",
      locales: {
        en: 'English',
        es: 'Español'
      }
    },
    MX: {
      title: "Biblicos",
      domain: "https://mx.bible.cloud",
      apiUrl: "http://data.test/",
      locales: {
        en: 'English',
        es: 'Español'
      }
    },
    IN: {
      title: "Anusaran",
      domain: "https://in.bible.cloud",
      apiUrl: "http://data.test/",
      locales: {
        en: 'English',
        hn: 'Hindi'
      }
    }
  }

  return scopes[scope]
};

export const SITE = currentScope(import.meta.env.COUNTRY_SCOPE)

export function getLanguageFromPath(URL){
  const lang = URL.pathname.split("/")[1];
  return lang;
}