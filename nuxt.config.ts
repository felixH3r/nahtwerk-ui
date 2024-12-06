// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Nahtwerk - Mit Liebe gemacht!',
      htmlAttrs: {
        lang: 'de'
      },
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {
          hid: 'description',
          name: 'description',
          content: 'Babykleidung, die auf Regionalität und Nachhaltigkeit setzt. Stoffe von regionalen Händlern, liebevoll von Hand verarbeitet.'
        },
        {name: 'format-detection', content: 'telephone=no'},
      ],
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: {enabled: true},
  modules: ['nuxt-medusa', '@nuxtjs/tailwindcss', '@pinia/nuxt', "@nuxt/image", '@nuxtjs/seo'],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },

  // ISR configuration
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    }
  },
});
