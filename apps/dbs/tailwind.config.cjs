const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}','../../packages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					100: "#c5e5f8",
					200: "#cbddee",
					300: "#aaccdd",
					400: "#4488bb",
					500: "#2266bb",
					600: "#0044bb",
					700: "#053083",
					800: "#03215a",
					900: "#021231",
				},
				secondary: colors.emerald
			}
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/line-clamp")
	],
}
