// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'node:fs/promises';
import path from 'node:path';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// Dev-only Review-Endpoint: nimmt die Annotationen des ReviewLayer (?review=true)
// entgegen und schreibt sie nach .reviews/<slug>.json (gitignored), wo Claude sie
// direkt liest. apply: 'serve' — existiert nur im Dev-Server, nie im Build/Deployment.
function reviewEndpoint() {
  let root = process.cwd();
  return {
    name: 'review-endpoint',
    apply: 'serve',
    configResolved(/** @type {{ root: string }} */ config) {
      root = config.root;
    },
    configureServer(/** @type {any} */ server) {
      server.middlewares.use('/__review', (/** @type {any} */ req, /** @type {any} */ res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('POST only');
          return;
        }
        let body = '';
        req.on('data', (/** @type {any} */ chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const slug = String(data.post ?? data.lesson ?? '').replace(/[^a-zA-Z0-9-]/g, '');
            if (!slug) throw new Error('kein Slug im Payload');
            const dir = path.join(root, '.reviews');
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(path.join(dir, `${slug}.json`), JSON.stringify(data, null, 2), 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ saved: `.reviews/${slug}.json` }));
          } catch (err) {
            res.statusCode = 400;
            res.end(String(err));
          }
        });
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://loschke.ai",
  integrations: [react(), markdoc(), sitemap()],
  output: 'static',

  vite: {
    plugins: [tailwindcss(), reviewEndpoint()],
  },

  adapter: vercel(),
});