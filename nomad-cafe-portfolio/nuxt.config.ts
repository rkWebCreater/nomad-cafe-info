// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  css: [
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination'
  ],

//google font 読み込み
   app: {
    head: {
      link: [
        // Google Fonts のサーバーに接続する設定
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // 使いたいフォント（Noto Sans JP と Quicksand）の読み込みリンク
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Zen+Kurenaido&display=swap' }
      ]
    }
  },
  //swiper element webcomponent 読み込み
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => /^(swiper|swiper-slide|swiper-container)$/.test(tag),
    },
  }

})

