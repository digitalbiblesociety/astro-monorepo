import { getLanguageFromPath } from "~/config.mjs";
import {i18n} from "~/translations/i18n.mjs";

export const pluck = (key) => (array) => Array.from(new Set(array.map((obj) => obj[key])))

export const shortcut = (node, params) => {
	let handler
	const removeHandler = () => window.removeEventListener("keydown", handler),
		setHandler = () => {
			removeHandler()
			if (!params) return
			handler = (e) => {
				if (
					!!params.alt != e.altKey ||
					!!params.shift != e.shiftKey ||
					!!params.control != (e.ctrlKey || e.metaKey) ||
					params.code != e.code
				)
					return
				e.preventDefault()
				params.callback ? params.callback() : node.click()
			}
			window.addEventListener("keydown", handler)
		}
	setHandler()
	return {
		update: setHandler,
		destroy: removeHandler,
	}
}

export const t = () => {
	const locale = getLanguageFromPath(Astro.url);
	return i18n[locale]
}

export const locale = () => {
	return getLanguageFromPath(Astro.url);
}