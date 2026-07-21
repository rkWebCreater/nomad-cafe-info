export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 💡 modulesに '@nuxt/content' を追加
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content'
  ],

  css: [
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination'
  ],

  //  app内設定
  app: { 
    baseURL: '/nomad-cafe-portfolio/', 
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

  // swiper element webcomponent 読み込み
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => /^(swiper|swiper-slide|swiper-container)$/.test(tag),
    },
  }
})
