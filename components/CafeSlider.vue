<template>
  <div class="cafe-slider-wrapper">
    <!-- Swiperの読み込みやレスポンシブ設定はここ1箇所に集約 -->
    <Swiper
      :modules="modules"
      :breakpoints="swiperBreakpoints"
      :navigation="true"
      :pagination="{ clickable: true }"
      class="cafe-cards-slider">

      <!-- 💡 ループ処理とスライドタグをここにまとめる -->
      <SwiperSlide v-for="cafe in allCafes" :key="cafe.id" class="overflow-hidden transition h-auto">
        <!-- slot を使って、中身のデータ（1件分のカフェ）を外に送る -->
        <CafeCards :cafe="cafe" />
      </SwiperSlide>

    </Swiper>

  </div>
</template>

<script setup lang="ts">
// 💡 Web Components ではなく、Vue専用のコンポーネントとモジュールをインポートします
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import { type Cafe } from "../schemas/cafe" 

// 💡 Vue版Swiperに必要なCSSをここで確実に読み込みます
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// ページ側からカフェデータの配列を受け取るプロップス
defineProps<{
  allCafes: Cafe[]
}>()

// スライダーのモジュールを配列化（ページネーションと矢印ナビゲーション）
const modules = [Navigation, Pagination]

// 💡 ブレイクポイントの数値をVueのオブジェクトとして定義
const swiperBreakpoints = {
  0: {
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 15
  },
  768: {
    slidesPerView: 3,
    centeredSlides: false,
    spaceBetween: 20
  }
}
</script>

<style scoped>
/* ==========================================
   Swiper 全体ラッパーと下部余白
========================================== */
.cafe-slider-wrapper {
  position: relative;
  width: 100%;
}

.cafe-cards-slider {
  width: 100%;
  /* ページネーション用の下部スペースを確保（カードと重ならないように） */
  padding-bottom: 44px ;
  position: relative;
}

@media (max-width: 767px) {
  .cafe-cards-slider {
    padding-bottom: 38px;
  }
}

/* ==========================================
   1. 矢印（Navigation ボタン）
   - サイトに合わせた温かみのあるブラウン＆ベージュ系の丸ボタン
========================================== */
.cafe-cards-slider :deep(.swiper-button-prev),
.cafe-cards-slider :deep(.swiper-button-next) {
  width: 42px;
  height: 42px;
  background: rgba(255, 252, 247, 0.92); /* --color-surface */
  color: var(--color-text, #3e2b24);      /* サイトの濃いブラウン */
  border: 1px solid var(--color-border, #ddcdbd);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(62, 43, 36, 0.12);
  backdrop-filter: blur(4px);
  transition: all 0.2s ease-in-out;
  z-index: 10;
  top: 42%; /* カード写真と情報の境目付近 */
}

/* 矢印アイコンのサイズ調整 */
.cafe-cards-slider :deep(.swiper-button-prev)::after,
.cafe-cards-slider :deep(.swiper-button-next)::after {
  font-size: 16px ;
  font-weight: bold;
}

/* ホバー時（PC） */
.cafe-cards-slider :deep(.swiper-button-prev):hover,
.cafe-cards-slider :deep(.swiper-button-next):hover {
  background: #ffffff;
  color: var(--color-accent, #c59915);
  border-color: var(--color-accent, #c59915);
  box-shadow: 0 6px 16px rgba(62, 43, 36, 0.18);
  transform: scale(1.06);
}

/* スライダーの端に到達した無効状態 */
.cafe-cards-slider :deep(.swiper-button-disabled) {
  opacity: 0.25 ;
  cursor: not-allowed;
  pointer-events: none;
}

/* PC表示の左右位置 */
.cafe-cards-slider :deep(.swiper-button-prev) {
  left: 6px;
}
.cafe-cards-slider :deep(.swiper-button-next) {
  right: 6px;
}

/* スマホ表示（767px以下）
   - カード内容を隠さないよう小さめにし、左右端に寄せて配置
   - カードのサムネイル画像付近（top: 36%）に配置して文字と被らない設計
*/
@media (max-width: 767px) {
  .cafe-cards-slider :deep(.swiper-button-prev),
  .cafe-cards-slider :deep(.swiper-button-next) {
    width: 32px;
    height: 32px;
    top: 36%;
  }

  .cafe-cards-slider :deep(.swiper-button-prev)::after,
  .cafe-cards-slider :deep(.swiper-button-next)::after {
    font-size: 12px ;
  }

  .cafe-cards-slider :deep(.swiper-button-prev) {
    left: 4px;
  }
  .cafe-cards-slider :deep(.swiper-button-next) {
    right: 4px;
  }
}

/* ==========================================
   2. ページネーション（Pagination）
   - 位置を下部に配置（カードの直下）
   - 色は設定のまま（アクティブ: --color-accent）
========================================== */
.cafe-cards-slider :deep(.swiper-pagination) {
  bottom: 8px ;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
}

.cafe-cards-slider :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: var(--color-muted, #76675d);
  opacity: 0.35;
  transition: all 0.3s ease;
  margin: 0 3px ;
}

/* アクティブなドット（そのままのアクセントカラー） */
.cafe-cards-slider :deep(.swiper-pagination-bullet-active) {
  background: var(--color-accent, #c59915) ;
  opacity: 1;
  width: 20px;
  border-radius: 4px;
}

/* ==========================================
   3. Swiper 内部要素（カードの高さ揃え）
========================================== */
.cafe-cards-slider :deep(.swiper-wrapper) {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.cafe-cards-slider :deep(.swiper-slide) {
  display: flex;
  align-items: stretch;
}

.cafe-cards-slider :deep(.card-link) {
  width: 100%;
  max-width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
</style>
