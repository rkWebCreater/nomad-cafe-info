<!-- app/components/CafeCards.vue カフェスライダーのスライドのコンポーネント-->

<script lang="ts" setup>
import { type Cafe } from "../schemas/cafe"

// 1. コンポーネントが受け取る props の型定義（Zod由来の型を使用）
const props = defineProps<{
  cafe: Cafe
}>()

/* 2. 画像URLにキャッシュバスティング用のクエリパラメータを自動付与する算出プロパティ
const optimizedImageUrl = computed(() => {
  const url = props.cafe.imageUrl
  if (!url) return ''

  // すでにクエリパラメータが含まれている場合は '&'、なければ '?' で連結する
  const separator = url.includes('?') ? '&' : '?'

  // 3. Vercelのデプロイ環境ごとに自動で変わるGitコミットハッシュを取得
  // ※ ローカル開発時（環境変数がない場合）は現在のタイムスタンプ（Date.now()）にフォールバック
  const commitSha = import.meta.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString()
  
  // 4. ハッシュが長すぎるため、先頭の8文字にスライスしてスッキリさせる
  const version = commitSha.slice(0, 8)

  // 5. 元のURLの末尾に '?v=xxxxx'（または '&v=xxxxx'）を結合した新しいURLを返す
  return `${url}${separator}v=${version}`
})
*/
</script>

<template>

  <NuxtLink v-if="cafe" :to="`/cafes/${cafe.id}`" class="card-link block text-left flex flex-col flex-1">
    <img 
      :src="cafe.imageUrl"
      :key="cafe.id"
      class="cafe-img object-cover rounded-t-lg" 
      :alt="cafe.name"
      width="500"
　　  height="300" 
  　　loading="lazy" 
    />
    <div class="p-5 grid grid-rows-[auto_1fr_auto] gap-1 content-between card-body-height flex-1 bg-white rounded-b-lg">
      <div>
        <span class="c-cafe-area text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded inline-block">{{ cafe.areaNameJa }}</span>
        <h3 class="c-cafe-title font-bold mt-2 min-h-[1.5rem] px-1 py-0.5 line-clamp-2">{{ cafe.name }}</h3>
      </div>
      <div class="flex flex-col justify-start">
        <ClientOnly>
          <p class="c-cafe-meta text-sm mt-1">🕒 {{ cafe.businessHours }}</p>
          <p class="c-cafe-meta text-sm mt-1">📍 {{ cafe.address }}</p>
        </ClientOnly>
      </div>
      <div class="tags mt-2 flex gap-2 text-xs text-gray-500">
        <span class="c-cafe-tag px-2 py-1 rounded">
          <img src="/images/icon/wifi_icon.png" alt="wifiのアイコン" width="16" height="16" class="w-4 inline-block"/> 
          {{ cafe.features?.wifi?.available ? '◎' : '✖' }}
        </span>
        <span class="c-cafe-tag px-2 py-1 rounded">
          <img src="/images/icon/power_icon.png" alt="電源のアイコン" width="16" height="16" class="w-4 inline-block"/> 
          {{ cafe.features?.power?.available ? '◎' : '✖' }}
        </span>
      </div>
    </div>
  </NuxtLink>

</template>

<style scoped>
.card-link {
   width: 100%;
   max-width: 500px;
   align-items: stretch;
}

.cafe-img {
  width: 100%;
  height: 200px;          /* 画像の高さ */
  object-fit: cover;
  flex-shrink: 0;         /* 画像が縮小されないようにする */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.c-cafe-title {
  color: var(--color-text);
}

.c-cafe-meta {
  color: var(--color-muted);
}

.tags {
  & span {
     color: var(--color-muted);
     background: var(--color-base);
     display: flex;
     gap: 4px;
     flex-wrap: wrap;
     justify-content: space-around;
     align-content: center;
  }
}

@media (max-width: 767px) {
  .card-link .cafe-name {
    font-size: 16px;
  }
}

@media (min-width: 768px) {
  .card-link .cafe-name {
    font-size: 20px;
    line-height: 25px;
  }
}
</style>

<!-- 
現象:
アプリ内のスライダー（CafeCards / CafeSlider）において、時間判定によるリストの切り替えを行った際、「前の夜営業のときに表示されていた別のカフェの画像がそのまま残留してしまう」という表示上のバグが発生

ユーザーの確認環境:
Vercelの本番・プレビュー環境およびブラウザの検証ツール上で確認

2. 試したアプローチと検証プロセス
初期の疑い（キャッシュバスティングの調整）:
画像URLに動的なクエリパラメータ（Gitのコミットハッシュやタイムスタンプ）を付与してキャッシュを回避しようと試みるも、Vercel上ではビルド時のハッシュが固定化されるなどの理由から根本解決に至らず。

Vue・スライダー側の :key の見直し:
リストやスライド（SwiperSlide）、コンポーネント（<NuxtImg>）に対して、カフェのIDや営業状態、配列の長さを組み合わせたキーを付与し、強制的な再描画・再マウントを試みました。

根本原因の特定（<NuxtImg> の内部キャッシュ・IPXの仕様）:
リストやスライダー（Swiper）が動的に切り替わる際、Nuxt公式の画像最適化コンポーネントである <NuxtImg> が内部のキャッシュやプレースホルダー・描画ステートを強く保持し続けてしまい、データ（cafe.imageUrl）が変わっても古い画像が表示され続けることが判明しました。

3. 最終的な解決策
通常の <img> タグへの置き換え:CafeCards.vue 内で使用していた <NuxtImg> を、ブラウザが素直に描画・更新してくれる通常の <img> タグ に戻しました。

結果:
ブラウザ標準の挙動により、データ（URL）の切り替えやスライダーの再描画に画像がしっかりと追従するようになり、残留バグが完全に解消されました。 -->
