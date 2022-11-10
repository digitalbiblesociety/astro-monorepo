import { SITE } from "~/config.js";
import { scope } from "~/utils/env"

const biblesResponse = await fetch(`${SITE.apiUrl}/bibles.json`);
let bibles = await biblesResponse.json();

const countriesResponse = await fetch(`${SITE.apiUrl}/countries.json`);
let countries = await countriesResponse.json();

//const filmsResponse = await fetch(`${SITE.apiUrl}/films.json`);
//let films = await filmsResponse.json();

const languagesResponse = await fetch(`${SITE.apiUrl}/languages.json`);
let languages = await languagesResponse.json();

const organizationsResponse = await fetch(`${SITE.apiUrl}/organizations.json`);
let organizations = await organizationsResponse.json();

if(scope !== 'all') {
  bibles = bibles.filter(bible => {return bible.ci == scope})
  //films = films.filter(film => {return film.ci == scope})
  languages = languages.filter(language => {return language.ci == scope})
  organizations = organizations.filter(organization => {return organization.ci == scope})
  countries = []
}


export async function get({params, request}) {
	return {
	  body: JSON.stringify({
		name: 'Astro',
		data: {
			bibles: bibles,
			languages: languages,
			organizations: organizations,
			countries: countries,
		},
	  }),
	};
}