<!-- app/components/CafeCards.vue カフェスライダーのスライドのコンポーネント-->
<template>
  <ClientOnly>
    <!-- 💡 <Swiper> コンポーネントを使用。これにより遷移時のバグが100%消滅します -->
    <Swiper
      :modules="modules"
      :breakpoints="swiperBreakpoints"
      :navigation="true"
      :pagination="{ clickable: true }"
      :scrollbar="{ draggable: true }"
      class="cafe-cards-slider">
 
      <!-- 💡 <SwiperSlide> タグを使用 -->
      <SwiperSlide v-for="cafe in cafes" :key="cafe.id" class="w-full bg-white rounded-[5%_5%_5%_5%] shadow-md overflow-hidden hover:shadow-lg transition">
          
        <NuxtLink :to="`/cafes/${cafe.id}`" class="block text-left flex flex-col flex-1 card-link">

          <img :src="cafe.imageUrl" :alt="cafe.name" class="w-full h-48 object-cover" />
          <div class="p-5 grid grid-rows-[auto_1fr_auto] gap-2 content-between card-body-height flex-1">
            <div>
              <span class="area-name bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded inline-block">{{ cafe.areaNameJa }}</span>
              <h3 class="cafe-name font-bold text-gray-900 mt-2 mb-1 min-h-[2rem] line-clamp-2">{{ cafe.name }}</h3>
            </div>
            <div class="flex flex-col justify-center">
              <p class="text-gray-800 text-sm min-h-[2rem] line-clamp-2">📍 {{ cafe.address }}</p>
              <p class="text-gray-600 text-sm mt-1">🕒 {{ cafe.businessHours }}</p>
            </div>
            <div class="mt-2 flex gap-2 text-xs text-gray-500">
              <span class="bg-gray-100 px-2 py-1 rounded">🛜 {{ cafe.features?.wifi?.available ? 'あり' : 'なし' }}</span>
              <span class="bg-gray-100 px-2 py-1 rounded">🔌 {{ cafe.features?.power?.available ? 'あり' : 'なし' }}</span>
            </div>
          </div>

        </NuxtLink>

      </SwiperSlide>

    </Swiper>
  </ClientOnly>
</template>

<style scoped>
/* ==========================================
   1. Swiper全体のデザイン・カラー設定（Vue版用にクラス名調整）
========================================== */

.cafe-cards-slider {
  width: 100%;
  background: rgb(106 106 106 / 50%);
  padding: 20px 20px 45px 20px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;

  /* 💡 茶色系のカラー設定をVue版のクラスに適用します */
  --swiper-navigation-color: rgba(53, 32, 16, 1);
  --swiper-navigation-size: 30px;
  --swiper-theme-color: rgba(53, 32, 16, 1);
  --swiper-pagination-color: rgb(133, 71, 23);
  --swiper-pagination-bullet-inactive-color: #cccccc;
  --swiper-pagination-bullet-inactive-opacity: 0.5;
  --swiper-pagination-bullet-size: 12px;
}

/* 💡 Vue版では ::part ではなく .swiper-wrapper クラスを直接指定して高さを同期します */
.cafe-cards-slider :deep(.swiper-wrapper) {
  display: flex !important;
  flex-direction: row !important;
  align-items: stretch !important;
}

/* ==========================================
   2. 各スライドカードの共通ベース
========================================== */
.swiper-slide {
  height: auto !important; 
  display: flex !important;
  flex-direction: column;
  flex-shrink: 0;
}
.card-link, .card-body-height {
  flex-grow: 1;
}

/* ==========================================
   3. スマホ・タブレット表示（767px以下）
========================================== */
@media (max-width: 767px) {
  
  .swiper-slide .area-name {
    text-align: center;
  }
  
  .swiper-slide .cafe-name {
    font-size: 16px;
  }
}

/* ==========================================
   4. PC表示（768px以上〜）
========================================== */
@media (min-width: 768px) {
  
  .swiper-slide .area-name {
    width: 40%;
    text-align: center;
  }

  .swiper-slide .cafe-name {
    font-size: 20px;
    line-height: 25px;
  }
}
</style>
<script setup>

// 💡 Web Components ではなく、Vue専用のコンポーネントとモジュールをインポートします
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar } from 'swiper/modules'

// 💡 Vue版Swiperに必要なCSSをここで確実に読み込みます
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

defineProps({ //cafeのデータを取り出す
  cafes: {
    type: Array,
    required: true
  }
})

// スライダーのモジュールを配列化
const modules = [Navigation, Pagination, Scrollbar]

// 💡 ブレイクポイントの数値をVueのオブジェクトとして定義（JSON.stringifyは不要になります）
const swiperBreakpoints = {
  0: {
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 15
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 20
  }
}
</script>
<!-- スライドをクリックしてページ遷移しスライダーが固まるバグ解消法
------------------------------
## 【Nuxt 3 × Swiper】ページ遷移時にスライダーが崩れる（ただ並ぶだけになる）バグの解説## 1. 以前の書き方（Web Components版）が壊れていた理由
以前のコードで使用していた <swiper-container> は、「Web Components（ウェブコンポーネント）」と呼ばれるブラウザ標準の機能です。これがNuxt 3の仕様と衝突していました。

* 最初の読み込み（F5）で動く理由:
ブラウザが最初から真っさらにHTMLを解析するため、タグを見つけて正常にスライダーの初期化が走ります。
* ページ遷移（往復）でただの画像が並ぶ状態になる理由:
Nuxt 3はアプリのように超高速で画面を切り替えるため、ブラウザ自体の再読み込み（リフレッシュ）を行いません。画面が戻ってきた際、ブラウザは「その <swiper-container> はさっき読み込んだから知っている」と勘違いし、二度目の初期化処理をサボってしまいます。
結果として、スライダーとしての命（JavaScript）が吹き込まれず、ただの四角いHTML要素（divタグと同じ状態）として縦や横に並んでしまうバグが発生していました。

------------------------------
## 2. 新しい書き方（Vue版コンポーネント）がいつでも100%動く理由
新しく書き換えたコードでは、ブラウザの機能（Web Components）に頼るのをやめて、Vue / Nuxt 3 の仕組みそのもので動く 「Vue版のSwiper」 に切り替えました。
## ① フレームワークとの完全な同期

import { Swiper, SwiperSlide } from 'swiper/vue'

スライダーの枠組み（<Swiper>）とスライドの箱（<SwiperSlide>）を、「Nuxt（Vue）の部品」として直接システムに合体させました。これにより、Nuxtが画面を描画・切り替えるタイミングと100%完全にシンクロして、ページ遷移のたびに自動でスライダーが正しく組み立てられます。
## ② 必要最低限の機能を「後付け」で合体させる設計

import { Navigation, Pagination, Scrollbar } from 'swiper/modules'const modules = [Navigation, Pagination, Scrollbar]

Vue版のSwiperは、初期状態では「ただ横に滑るだけ」の超軽量な機能しか持っていません。そこに、左右の矢印（Navigation）、下のドット（Pagination）、スクロールバー（Scrollbar）という個別の頭脳（モジュール）を、必要に応じて後からカチッと装着しています。これにより無駄なコードを減らし、読み込みを速くしています。
## ③ 影の壁（Shadow DOM）を壊して、直接CSSを届ける

.cafe-cards-slider :deep(.swiper-wrapper) {
  display: flex !important;
  align-items: stretch !important;
}

以前の Web Components版は「Shadow DOM」という特殊な隠し部屋の中にHTMLが隠れていたため、外からのCSS（高さ揃えなど）を届けるために ::part(wrapper) という特殊な記述が必要でした。
Vue版に切り替えたことで、通常のHTMLと同じように :deep() セレクタを使って、内側の .swiper-wrapper クラスへ直接「高さを一番背の高いカードに強制的に合わせなさい（stretch）」という命令が届くようになり、1枚だけ巨大化するバグもCSSの力で完全に封じ込めることができるようになりました。
------------------------------
## 💡 モダンフロントエンド開発での教訓

   1. ブラウザ専用の都合で動く機能は避ける:
   Nuxt 3（モダンフロントエンド）のようなSPA環境では、ブラウザのJavaScriptだけに依存する要素はページ遷移時に高確率でバグの温床になります。
   2. 迷ったらフレームワーク専用の部品（パッケージ）を使う:
   Vue/Nuxt用に最適化して作られた swiper/vue を使うのが、最もバグが起きにくく、最も安全で、最もクリーンな正攻法アプローチになります。

------------------------------
 -->
