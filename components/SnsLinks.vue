<script setup lang="ts">
import type { SnsLinksSchema } from '~/schemas/cafe'

defineProps<{
  sns?: SnsLinksSchema
}>()

// アコーディオンの開閉状態（スマホ用）
const isOpen = ref(false)
// 画面幅がPCサイズかどうかを判定するフラグ
const isPc = ref(false)

const checkWindowSize = () => {
  if (typeof window !== 'undefined') {
    // 例: 769px以上をPCとする
    isPc.value = window.innerWidth >= 769
  }
}

// 初期表示時とリサイズ時に画面幅をチェック
onMounted(() => {
  checkWindowSize()
  window.addEventListener('resize', checkWindowSize)
})

// コンポーネントが破棄されるときにリスナーを削除
onUnmounted(() => {
  window.removeEventListener('resize', checkWindowSize)
})

// アコーディオンのトグル（PCのときは何もしない）
const toggleAccordion = () => {
  if (isPc.value) return // PCのときはアコーディオンをオフ
  isOpen.value = !isOpen.value
}

// Composition API (setup) の場合、または methods 内に作成
const getIconPath = (key: string) => {
  // キー名を小文字にして、assetsフォルダ内の画像を動的に取得
  const lowerKey = key.toLowerCase();
  return new URL(`/images/icon/${lowerKey}.webp`, import.meta.url).href;
};
</script>

<template>
  <div v-if="sns?.instagram || sns?.LINE" class="sns-accordion-wrapper">
    <!-- スマホ用のアコーディオンヘッダー（PCではクリックしても開閉しない等、見た目を調整） -->
    <button 
      class="accordion-header" 
      :class="{ 'is-pc': isPc }"
      @click="toggleAccordion"
    >
      <span>私たちのSNS</span>
      <!-- スマホのときだけ矢印アイコンなどを出す -->
      <span v-if="!isPc" class="arrow" :class="{ 'open': isOpen }">▼</span>
    </button>

    <!-- リンクを格納するコンテンツ部分 -->
    <!-- PC (isPc = true) または スマホで開いているとき (isOpen = true) に表示 -->
    <div v-show="isPc || isOpen" class="sns-content">
      <!-- ① まずv-forでループを回す（画面には何も出力されない） -->
    <template v-for="(url, key) in sns" :key="key">
  
     <!-- ② 中のaタグで「URLがある時だけ」表示する -->
     <a 
       v-if="url"
      :href="url" 
      target="_blank" 
      rel="noopener noreferrer" 
      :class="['sns-link', key.toLowerCase()]"
     >
      <img 
          :src="`/images/icon/${key.toLowerCase()}.webp`" 
          :alt="key" 
          class="sns-icon"
      />
     </a>
     
     
    </template>
 
    </div>
    
  </div>
  <span v-else class="text-[#efe5d5]-400 bg-[#ebe4d8] p-2">申し訳ありませんが、現在SNSはやっておりません。</span>
</template>

<style scoped>
/* ==========================================
   共通のリンクスタイル
   ========================================== */
.sns-content {
  display: flex;
  gap: 10px;
  margin-top: 8px;

  @media(min-width: 769px){
   gap:40px;
  }
}

.sns-link {
  width:80px;
  height:80px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #334155;
  text-decoration: none;
}

/* ==========================================
   スマホ表示（アコーディオン）
   ========================================== */
.accordion-header {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 8px 12px;
    color: #ebe4d8;
    background: #826246;
    border: 1px solid #efe5d5;
    border-radius: 50px;
    cursor: pointer;
    font-size: 0.875rem;
    letter-spacing: 2px;
}

.arrow {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(300deg);
}

/* ==========================================
   PC表示時のスタイル上書き（アコーディオンオフ）
   ========================================== */
@media (min-width: 769px) {
  /* PCのときはアコーディオンのヘッダー自体を非表示にして、中身を直接並べる */
  .accordion-header {
    display: none;
  }

  .sns-content {
    margin-top: 0;
  }
}
</style>