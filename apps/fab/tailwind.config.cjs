const colors = require("tailwindcss/colors");
require("dotenv").config();

module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,svelte}",
    "../../packages/**/*.{astro,html,js,jsx,md,svelte}"
  ],
  theme: {
    extend: {
      colors: {
        primary: colors[process.env.COLOR_PRIMARY],
        secondary: colors[process.env.COLOR_SECONDARY],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
  darkMode: "class",
};
