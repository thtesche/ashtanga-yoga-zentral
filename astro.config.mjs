import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          de: 'de-DE',
        },
      },
    }),
  ],
  site: 'https://ashtanga-yoga-zentral.ch',
  base: '',

  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'redirect'
    },
    fallback: {
      de: 'en'
    }
  }

});
