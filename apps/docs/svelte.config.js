import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter({ fallback: null }),
    prerender: {
      handleHttpError: 'fail',
      // content/ is empty until Task 9, so [...slug] legitimately produces zero
      // prerendered pages (its EntryGenerator yields no entries). Only ignore
      // that specific expected case; still fail on any other unseen route.
      handleUnseenRoutes: ({ routes }) => {
        if (routes.every((route) => route === '/[...slug]')) return;
        throw new Error(`Unseen prerenderable routes: ${routes.join(', ')}`);
      }
    }
  }
};
