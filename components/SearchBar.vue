<!-- app/components/SearchBar.vue 検索バーのコンポーネント-->
<script setup>
// Nuxt 3 では route, router, ref は自動インポートされるため import 文は不要です
const route = useRoute()
const router = useRouter()

// 1. URLにすでに keyword があれば、検索窓の初期値としてセットする
const searchQuery = ref(route.query.keyword || '')

// 2. URLの keyword が変わったときに、検索窓の文字も連動させる
watch(() => route.query.keyword, (newKeyword) => {
  searchQuery.value = newKeyword || ''
})

const handleSearch = () => {
  if (!searchQuery.value.trim()) return // 空っぽのときは何もしない

  router.push({
    path: '/search',
    query: { keyword: searchQuery.value.trim() }
  })

}
</script>

<template>
  <!-- 検索フォームの submit イベントを handleSearch メソッドにバインド -->
  <form @submit.prevent="handleSearch" class="search-container c-search-form">
    
   <input type="text" v-model="searchQuery" class="search-input c-search-input placeholder:text-xs md:placeholder:text-sm">
   <button type="submit" class="search-button c-search-button">
    <span class="c-search-button-label">検索</span>
    <span class="c-search-particles" aria-hidden="true">
     <i v-for="particle in 12" :key="particle" class="c-search-particle"></i>
    </span>
   </button>
    
  </form>
</template>

<style scoped>
/* Component: 検索フォーム */
.c-search-form {
  width: 100%;
  max-width: 560px;
  margin: 20px auto;
  display: flex;
  gap: 8px;
}

.c-search-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 16px;
}

.c-search-input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
/* Component: 検索ボタン */
.c-search-button {
  position: relative;
  isolation: isolate; /* 子要素の z-index を独立させるために isolation: isolate を使用 */
  overflow: visible; /* 粒子がボタンの外にはみ出しても表示されるように overflow: visible を使用 */
  flex: 0 0 84px;
  min-height: 42px;
  color: var(--color-surface);
  background: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
}

.c-search-button:hover {
  color: var(--color-surface);
  background: var(--color-accent);
}

.c-search-button-label {
  position: relative;
  z-index: 2;
}

.c-search-particles {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}

.c-search-particle {
  --particle-angle: 0deg;
  --particle-distance: 54px;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}

/* 検索ボタンにマウスオーバーしたときに粒子が飛び出すアニメーションを適用する */
.c-search-button:hover .c-search-particle {
  animation: c-search-particle-burst 650ms cubic-bezier(0.16, 0.8, 0.3, 1) both;
}

/* random() 非対応ブラウザー用の全方向フォールバック */
.c-search-particle:nth-child(1)  { --particle-angle: 0deg; }
.c-search-particle:nth-child(2)  { --particle-angle: 30deg; }
.c-search-particle:nth-child(3)  { --particle-angle: 60deg; }
.c-search-particle:nth-child(4)  { --particle-angle: 90deg; }
.c-search-particle:nth-child(5)  { --particle-angle: 120deg; }
.c-search-particle:nth-child(6)  { --particle-angle: 150deg; }
.c-search-particle:nth-child(7)  { --particle-angle: 180deg; }
.c-search-particle:nth-child(8)  { --particle-angle: 210deg; }
.c-search-particle:nth-child(9)  { --particle-angle: 240deg; }
.c-search-particle:nth-child(10) { --particle-angle: 270deg; }
.c-search-particle:nth-child(11) { --particle-angle: 300deg; }
.c-search-particle:nth-child(12) { --particle-angle: 330deg; }

/* random() 対応ブラウザーでは各粒子の角度と距離を個別に決める */
@supports (width: random(0px, 1px)) {
  .c-search-particle {
    --particle-angle: random(element-scoped, 0deg, 360deg);
    --particle-distance: random(element-scoped, 38px, 72px);
  }
}

/* サイトのテラコッタ・ベージュ系で粒子に色をつける */
.c-search-particle:nth-child(4n + 1) {
  background: var(--color-accent);
}

.c-search-particle:nth-child(4n + 2) {
  background: var(--color-beige);
}

.c-search-particle:nth-child(4n + 3) {
  background: #d59a75;
}

.c-search-particle:nth-child(4n) {
  background: #8f5c4b;
}

@keyframes c-search-particle-burst {
  0% {
    opacity: 0;
    transform:
      translate(-50%, -50%)
      rotate(var(--particle-angle))
      translateX(0)
      scale(0.5);
  }

  15% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate(-50%, -50%)
      rotate(var(--particle-angle))
      translateX(var(--particle-distance))
      scale(0.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-search-button:hover .c-search-particle {
    animation: none;
  }
}

</style>
