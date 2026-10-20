<!-- app/components/SearchBar.vue 検索バーのコンポーネント-->
<script setup>
// Nuxt 3 では useRoute、useRouter、ref、watch は自動インポート
const route = useRoute()
const router = useRouter()

// keyword は URL によって string、string[]、null のいずれかになる
// 検索窓では文字列を扱うため、常に string にそろえる
const normalizeKeyword = (keyword) => {
  if (Array.isArray(keyword)) {
    // ?keyword=foo&keyword=bar のような URL では、最初の値を使う
    return typeof keyword[0] === 'string' ? keyword[0] : ''
  }

  // null など文字列以外の値は、空文字列にする
  return typeof keyword === 'string' ? keyword : ''
}

// URL に keyword があれば、検索窓の初期値に設定
const searchQuery = ref(normalizeKeyword(route.query.keyword))

// URL の keyword が変わったときも、検索窓の表示を同期
watch(
  () => route.query.keyword,
  (newKeyword) => {
    searchQuery.value = normalizeKeyword(newKeyword)
  }
)

const handleSearch = () => {
  // 前後の空白を除いてから検索
  const keyword = searchQuery.value.trim()

  // 空文字列では検索ページへ移動しない
  if (!keyword) return

  // 検索キーワードを URL のクエリに設定して検索ページへ移動
  router.push({
    path: '/search',
    query: { keyword }
  })
}
</script>

<template>
  <!-- submit 時のページ再読み込みを防ぎ、handleSearch を実行 -->
  <form
    class="search-container c-search-form"
    @submit.prevent="handleSearch"
  >
    <input
      v-model="searchQuery"
      type="text"
      class="search-input c-search-input placeholder:text-xs md:placeholder:text-sm"
      aria-label="検索キーワード"
    >

    <button
      type="submit"
      class="search-button c-search-button"
    >
      <span class="c-search-button-label">検索</span>

      <span class="c-search-particles" aria-hidden="true">
        <i
          v-for="particle in 12"
          :key="particle"
          class="c-search-particle"
        ></i>
      </span>
    </button>
  </form>
</template>

<style>
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
