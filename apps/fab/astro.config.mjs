import { defineConfig } from "astro/config";
import * as dotenv from 'dotenv'
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { currentScope } from "./src/config.js";

dotenv.config()
const SITE = currentScope(process.env.COUNTRY_SCOPE)

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: SITE.domain,
  output: 'static',
  experimental: { integrations: true },
  integrations: [
    tailwind({config: { applyBaseStyles: false } }),
    sitemap(), 
    svelte(),
    compress()
  ]
});