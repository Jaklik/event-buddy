import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))

// Nuxt layer: design tokens, base styles and Sp* components.
export default defineNuxtConfig({
  modules: ['@nuxt/fonts', '@nuxt/icon'],
  css: [
    join(dir, 'app/assets/css/tokens.css'),
    join(dir, 'app/assets/css/base.css'),
    join(dir, 'app/assets/css/utilities.css'),
  ],
  components: [{ path: join(dir, 'app/components'), pathPrefix: false }],
  fonts: {
    // Self-hosted at build time (GDPR, performance) instead of fonts.googleapis.com.
    families: [
      { name: 'Public Sans', provider: 'google', global: true, weights: [300, 400, 500, 600, 700], styles: ['normal', 'italic'] },
      // Sentient (accent headings, brand manual p.16) from Fontshare, self-hosted at build. Verify the license before launch.
      { name: 'Sentient', provider: 'fontshare', global: true, weights: [400, 500, 700], styles: ['normal', 'italic'] },
    ],
  },
  icon: {
    // Same glyphs as the old Font Awesome Kit, bundled locally (no external kit script).
    serverBundle: 'local',
    clientBundle: { scan: true },
  },
})
