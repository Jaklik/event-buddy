export default defineNuxtConfig({
  extends: ['../../packages/ui'],
  compatibilityDate: '2026-10-01',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'cs' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/png', href: '/brand/favicon-48.png' }],
    },
  },
})
