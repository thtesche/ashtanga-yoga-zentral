import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
// import markdown from '@astrojs/mdx'; // Commented out redundant import

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  site: 'https://thtesche.github.io',
  base: '/ashtanga-yoga-zentral/',
});
