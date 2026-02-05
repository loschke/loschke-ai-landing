// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: "https://loschke.ai",
  integrations: [react(), markdoc(), keystatic(), sitemap()],
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});