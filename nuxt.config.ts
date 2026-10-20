// @ts-nocheck 


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Vite 8 と既存 Tailwind CSS v3 の CSS minify 互換性を保つ
  vite: {
    build: {
      cssMinify: 'esbuild'
    }
  },
  
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

  // ルートディレクトリをソースディレクトリにする場合
  srcDir: '.',

  //  app内設定 外部のモジュールをインストール不要
  app: { 
    // Vercelのドメイン直下で配信するため、ベースURLをルートに固定します。
    baseURL: '/',
    head: {
      link: [
        // Google Fonts のサーバーに接続する設定
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // 使いたいフォント（zen kurenaido とStyle Script）の読み込みリンク
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap&family=Style+Script&display=swap' }
      ]
    }
  },

  // swiper element webcomponent 読み込み
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => /^(swiper|swiper-slide|swiper-container)$/.test(tag),
    },
  },
  nitro: {
    prerender: {
      // 検索ページ（クエリパラメータ付き含む）の事前生成を対象外にする
      ignore: [
        '/search',
        '/Search',
        '/nomad-cafe-info/search',
        '/nomad-cafe-info/Search'
      ]
    }
  }

})