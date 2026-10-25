<!-- app/components/CafeCards.vue カフェスライダーのスライドのコンポーネント-->

<script lang="ts" setup>
import { type Cafe } from "../schemas/cafe"

// 1. コンポーネントが受け取る props の型定義（Zod由来の型を使用）
const props = defineProps<{
  cafe: Cafe
}>()

// 2. 画像URLにキャッシュバスティング用のクエリパラメータを自動付与する算出プロパティ
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

</script>

<template>

  <NuxtLink v-if="cafe" :to="`/cafes/${cafe.id}`" class="card-link block text-left flex flex-col flex-1">
    <NuxtImg 
      :src="optimizedImageUrl"
      :key="optimizedImageUrl"
      class="cafe-img object-cover rounded-t-lg" 
      :alt="cafe.name" 
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
