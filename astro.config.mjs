// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://frnq.es',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !['/404', '/404/'].includes(pathname)
          && pathname !== '/legal'
          && !pathname.startsWith('/legal/');
      },
    }),
  ],
});
