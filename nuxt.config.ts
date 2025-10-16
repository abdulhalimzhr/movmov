// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    theme: {
      defaultTheme: 'light'
    },
    defaults: {
      VCard: {
        elevation: 2
      }
    }
  },
  css: ['~/assets/scss/main.scss'],
  typescript: {
    strict: true,
    typeCheck: true
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "~/assets/scss/variables.scss";`
        }
      }
    }
  }
})