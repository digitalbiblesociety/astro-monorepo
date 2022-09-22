import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

const iso_codes = ["en", "es"]
const translations = ["common","about","libraries","store","bible"]

iso_codes.forEach((locale) => {
	translations.forEach((key) => {
		register('en', () => import(`./translations/${locale}/${key}.json`));
	})
})

init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator(),
});