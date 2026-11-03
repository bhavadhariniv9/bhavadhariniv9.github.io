import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import { remarkBlocks } from './src/plugins/remark-blocks.mjs';

// For https://bhavadhariniv9.github.io the repo must be named "bhavadhariniv9.github.io"
// and `base` stays '/'. For a project repo (user.github.io/my-repo) set base: '/my-repo'.
const site = 'https://bhavadhariniv9.github.io';
const base = '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkDirective, [remarkBlocks, { base }]],
  },
});
