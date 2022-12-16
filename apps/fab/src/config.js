
export const currentScope = (scope) => {
  const scopes = {
    all: {
      title: "find.bible",
      domain: "https://find.bible",
      apiUrl: "http://data.test/",
      locales: {
        en: 'English',
        am: 'አማርኛ',
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
        hn: 'Hindi',
        ta: 'தமிழ்',
        te: 'తెలుగు',
        bn: 'বাংলা',
        mr: 'मराठी'
      }
    },
    ET: {
      title: "Ethiopia",
      domain: "https://et.bible.cloud",
      apiUrl: "http://data.test/",
      locales: {
        am: 'አማርኛ',
        en: 'English'
      }
    },
    KE: {
      title: "Kenya",
      domain: "https://ke.bible.cloud",
      apiUrl: "http://data.test/",
      locales: {
        sw: 'Kiswahili',
        en: 'English'
      }
    },
    UG: {
      title: "Uganda",
      domain: "https://ug.bible.cloud",
      apiUrl: "http://data.test/",
      locales: {
        sw: 'Kiswahili',
        en: 'English'
      }
    },
    TD: {
      title: "Chad",
      domain: "https://td.bible.cloud",
      apiUrl: "http://data.test/",
      locales: {
        sw: 'Kiswahili',
        en: 'English'
      }
    },
  }

  return scopes[scope]
};

export const SITE = currentScope(import.meta.env.COUNTRY_SCOPE)

export function getLanguageFromPath(URL){
  const lang = URL.pathname.split("/")[1];
  return lang;
}