// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://frnq.es',
  
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/404'),
    }),
  ],
  
  build: {
    inlineStylesheets: 'auto',
  },
  
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
    },
  },
});
