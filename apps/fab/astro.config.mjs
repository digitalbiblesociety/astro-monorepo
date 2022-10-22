import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import image from "@astrojs/image";
import { SITE } from "./src/config.mjs";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: SITE.domain,
  experimental: {
    integrations: true
  },
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), sitemap(), image(), svelte()] // , compress()
});