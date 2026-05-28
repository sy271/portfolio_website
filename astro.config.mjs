// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',        // ← must be 'server' or 'hybrid'
  adapter: vercel(),
  integrations: [react(), svelte()],

  vite: {
    plugins: [tailwindcss()],
    assetsInclude: ['**/*.glb']
  }
});