import rss from "@astrojs/rss";
import { SITE } from "~/config";

const sectionResponse = await fetch(`${SITE.apiUrl}/site_index.json`)
const sections = await sectionResponse.json()
const date = new Date().getUTCDate

export const get = () =>
  rss({
    title: `${SITE.name}`,
    description: "",
    site: import.meta.env.SITE,
    items: sections?.countries.map((country) => ({
      link: `countries/${country.id}`,
      title: country.tt,
      description: '',
      //pubDate: date,
    })).concat(sections?.languages.map((language) => ({
      link: `languages/${language.id}`,
      title: language.tt,
      description: '',
      //pubDate: date,
    }))).concat(sections?.bibles.map((bible) => ({
      link: `bibles/${bible.id}`,
      title: bible.tt,
      description: '',
      //pubDate: date,
    })))
  });