import rss from "@astrojs/rss";
import { SITE } from "~/config.js";

const sectionResponse = await fetch(`${SITE.apiUrl}/site_index.json`)
const sections = await sectionResponse.json()
const date = new Date()
const locales = Object.keys(SITE.locales)

export const get = () =>
  rss({
    title: `${SITE.name}`,
    description: "",
    site: `${SITE.domain}`,
    items: sections?.countries.map((country) => ({
        link: `/en/countries/${country.id}`,
        title: country.tt,
        description: '',
        pubDate: date,
      })).concat(sections?.languages.map((language) => ({
        link: `/en/languages/${language.id}`,
        title: language.tt,
        description: '',
        pubDate: date,
      }))).concat(sections?.bibles.map((bible) => ({
        link: `/en/bibles/${bible.id}`,
        title: bible.tt,
        description: '',
        pubDate: date,
      })))
  });