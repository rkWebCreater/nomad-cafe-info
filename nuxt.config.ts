// @ts-nocheck 


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  runtimeConfig:{
    // サーバーサイドでのみアクセス可能（ブラウザには露出しない）
    geminiApiKey: process.env.GEMINI_API_KEY
  },

 //tailwind 設定
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination'
  ],

  //  app内設定
  app: { 
    baseURL: '/nomad-cafe-info/',
    head: {
      link: [
        // Google Fonts のサーバーに接続する設定
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // 使いたいフォント（zen kurenaido）の読み込みリンク
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap' }
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
