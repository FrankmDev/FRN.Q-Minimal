// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://frnq.es',
  output: 'static',
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/legal/'),
    }),
  ],
});
