// @ts-nocheck 

import type { n } from "vue-router/dist/options-B1Pk0SIa.mjs";


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
  },
  // Vite 8 と既存 Tailwind CSS v3 の CSS minify 互換性を保つ
  vite: {
      build: {
           // Vite 8 でデフォルトになった lightningcss を避け、
           // 従来（Vite 7以前）の esbuild による CSS ミニファイに固定して互換性を維持
           cssMinify: 'esbuild'
      },
      optimizeDeps: {
      include: [
        '@vue/devtools-core',
        'swiper/modules',
        'swiper/vue',
        'zod',
      ]
    }
  },
  // 実験的機能やnitroの最適化（必要に応じて）
  experimental: {
    inlineSSRStyles: true // SSR時のCSSをインライン化してレンダリングブロックを軽減
  },

  runtimeConfig:{
    // サーバーサイドでのみアクセス可能（ブラウザには露出しない）
    geminiApiKey: process.env.GEMINI_API_KEY
  },

 // モジュールのインストール
  modules: [ 
    '@nuxtjs/tailwindcss' ,
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/google-fonts'
  ],
  // Google Fonts の最適化設定（Zen Kurenaido のみ＆ローカルホスト配信）
  googleFonts: {
    families: {
      'Zen+Kurenaido': [400],
    },
    display: 'swap',
    download: true, // 自動でプロジェクト内にダウンロードして配信（これが重要）
    inject: true,
  },
  // 静的に配信できるページ（トップページなど）をあらかじめビルド時に生成する
  routeRules: {
    '/': { prerender: true },
    '/search': { swr: 3600 },
  },
  image: {
    // 外部CDNやUnsplashのドメインを許可
    domains: [
      'images.unsplash.com'
    ],
    // クオリティやデフォルト設定
    quality: 80,
    format: ['avif', 'webp']
  },
  // tailwindcssの設定をNuxtに渡す
  tailwindcss: {
    exposeConfig: true,
    viewer: false
  },

  // 3. Nuxt本体のPostCSS設定（これがモジュールの自動生成を上書きします）
  postcss: {
    plugins: {
      'tailwindcss/nesting': false // 👈 tailwindcssの「中」ではなく「外」に書きます
    }
  },

  css: [
    '@/app/assets/css/main.css',
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
      title: 'nomad-cafe-info', 
      htmlAttrs:{
        lang : 'ja'
      },
      meta: [
        { name: 'description', content: 'カフェ検索webアプリをvue nuxt typescriptで開発' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' }, //favicon設定
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      // 万が一JSがオフの環境向けのフォールバック（推奨）
      noscript: [
        {
          children: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Kurenaido&family=Style+Script&display=swap">'
        }
      ]
    }
  },

  

})