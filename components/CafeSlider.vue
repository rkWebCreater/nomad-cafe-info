<template>
  <div class="cafe-slider-wrapper ">
    <!-- Swiperの読み込みやレスポンシブ設定はここ1箇所に集約 -->
    <Swiper
      :modules="modules"
      :breakpoints="swiperBreakpoints"
      :navigation="true"
      :pagination="{ clickable: true }"
      :initial-slide="initialSlide"
      @slideChange="saveSlide"
      class="cafe-cards-slider">

      <!-- 💡 ループ処理とスライドタグをここにまとめる -->
      <SwiperSlide v-for="cafe in allCafes" :key="cafe.id" class="overflow-hidden transition">
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
const props = withDefaults(
  defineProps<{
    allCafes: Cafe[]
    stateKey?: string
  }>(),
  {
    stateKey : 'default'
  }
) 
// useStateで、現在表示中のスライドのカフェIDをページ遷移後も保持する
const savedCafeId = useState<string | null >(
     `cafe-slider-${props.stateKey}`,
     () => null
)
// 保存したカフェIDが一覧の何番目かを探し、Swiperの初期位置にする
// IDが見つからない場合は先頭にする
const initialSlide = computed(()=>{
  const index = props.allCafes.findIndex(
    cafe => String(cafe.id) === savedCafeId.value
  )
  return index >= 0 ? index : 0 
})

// スライド変更時に、表示中のスライドに対応するカフェIDを保存する
const saveSlide = (swiper : {realIndex : number}) => {
const cafe = props.allCafes[swiper.realIndex]
if (cafe)savedCafeId.value = String(cafe.id)
}

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
  max-width: 1000px;
  margin: auto ;
  /* ページネーション用の下部スペースを確保（カードと重ならないように） */
  padding-bottom: 40px ;
  position: relative;
}

/* スマホ表示
   - カード内容を隠さないよう小さめにし、左右端に寄せて配置
   - カードのサムネイル画像付近（top: 36%）に配置して文字と被らない設計
*/ 
  .cafe-cards-slider {
    padding-bottom: 38px;
  }

  .cafe-cards-slider :deep(.swiper-button-prev),
  .cafe-cards-slider :deep(.swiper-button-next) {
    width: 20px;
    height: 20px;
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

/* アクティブなドット */
.cafe-cards-slider :deep(.swiper-pagination-bullet-active) {
  background: var(--color-accent) ;
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
  height: auto;
  align-items: stretch;
}

.cafe-cards-slider :deep(.card-link) {
  width: 100%;
  max-width: 500px;
  height:100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

/* ==========================================
   1. 矢印（Navigation ボタン）
   - サイトに合わせた温かみのあるブラウン＆ベージュ系の丸ボタン
========================================== */
@media (min-width: 768px) {

 .cafe-cards-slider :deep(.swiper-button-prev),
 .cafe-cards-slider :deep(.swiper-button-next) {
  width: 35px;
  height: 35px;
  color: var(--color-text, #3e2b24);      /* サイトの濃いブラウン */
  border: 1px solid var(--color-border, #ddcdbd);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(62, 43, 36, 0.12);
  backdrop-filter: blur(4px);
  transition: all 0.2s ease-in-out;
  z-index: 10;
  top: 50%; /* カード写真と情報の境目付近 */
  transform:translateY(-50%);
}

/* PC表示の左右位置 */
.cafe-cards-slider :deep(.swiper-button-prev) {
  left: 5px;
}
.cafe-cards-slider :deep(.swiper-button-next) {
  right: 5px;
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
  color: var(--color-accent, #c59915);
  border-color: var(--color-accent, #c59915);
  box-shadow: 0 6px 16px rgba(62, 43, 36, 0.18);
}

/* スライダーの端に到達した無効状態 */
.cafe-cards-slider :deep(.swiper-button-disabled) {
  opacity: 0.25 ;
  cursor: not-allowed;
  pointer-events: none;
}

}

</style>
