// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {enabled: true},
  modules: ['nuxt-medusa', '@nuxtjs/tailwindcss', '@pinia/nuxt', "@nuxt/image"],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  // @ts-ignore
  isr: true
});
