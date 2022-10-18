import rss from "@astrojs/rss";
import { SITE } from "~/config.mjs";

const sectionResponse = await fetch(`${SITE.apiUrl}/site_index.json`)
const sections = await sectionResponse.json()
const date = new Date()
const locales = Object(SITE.locales).keys()

export const get = () =>
  rss({
    title: `${SITE.name}`,
    description: "",
    site: import.meta.env.SITE,
    items: locales.map(locale => {
      return sections?.countries.map((country) => ({
        link: `/${locale}/countries/${country.id}`,
        title: country.tt,
        description: '',
        pubDate: date,
      })).concat(sections?.languages.map((language) => ({
        link: `/${locale}/languages/${language.id}`,
        title: language.tt,
        description: '',
        pubDate: date,
      }))).concat(sections?.bibles.map((bible) => ({
        link: `/${locale}/bibles/${bible.id}`,
        title: bible.tt,
        description: '',
        pubDate: date,
      })));
    })
  });