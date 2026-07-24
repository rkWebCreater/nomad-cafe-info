<!-- pages/cafes/[id].vue カフェの詳細ページ-->

<template>
  <div class="max-w-6xl mx-auto p-4 text-left">
    
    <!-- クリックしたカフェ一軒の表示部分 -->
    <div v-if="cafe" class="detail rounded-2xl shadow-md overflow-hidden ml-auto mr-auto mb-10">
      <img :src="cafe.imageUrl" :alt="cafe.name" class="mainImg object-cover w-full h-64 max-w-xl" />
      <div class="p-5">
       <span class="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded">{{ cafe.areaNameJa }}</span>
       <h1 class="cafe-name font-bold text-gray-900 text-2xl mt-2 ml-1 mb-2">{{ cafe.name }}</h1>
       <div class="description">
        <p class="text-gray-800 text-sm mt-1">📍 住所: {{ cafe.address }}</p>
        <p class="text-gray-600 text-sm mt-1">🕒 営業: {{ cafe.businessHours }}</p>
        <p class="text-gray-600 text-sm mt-1">💰 予算: {{ cafe.budget }}</p>
       </div>
       <p class="text-gray-600 text-m mt-2 mr-2 mb-2">💻HP: {{ cafe.website }}</p>
       <div class="tag mt-2 flex gap-2 text-xs text-gray-500">
        <span class="px-2 py-1 rounded">🛜 {{ cafe.features?.wifi?.available? 'あり' : 'なし' }}</span>
        <span class="px-2 py-1 rounded">🔌 {{ cafe.features?.power?.available ? 'あり' : 'なし' }}</span>
       </div>
    </div>
      
    </div>

    <!-- 💡 【フリーズ解決の最重要エリア】他のおすすめカフェセクション -->
    <!-- :key="cafeId" をセクション全体に指定し、URLが変わるたびにスライダーごと新しく作り直します -->
    <div v-if="othersCafes && othersCafes.length > 0" :key="cafeId" class="cafe-cards-section  ml-auto mr-auto mt-10">
      <h2 class="cafe-cards-ttl font-bold text-xl mb-2">他のおすすめカフェ</h2>
      <p class="canSlide text-gray-300 text-xs mb-4">＜ーー スライドできます ーー＞</p>
      <!-- 💡 除外済みの正しいリスト（otherCafes）」を、:cafes で渡します -->
      <CafeCards :cafes="othersCafes" :key ="cafe.id" />
    </div>

  </div>
</template>

<style>

.detail{
        background: rgb(255, 255, 255);
        display: grid;
        grid-auto-flow: row;
}
.cafe-cards-ttl{
               text-align:center;
}
.canSlide{
       text-align: center;
}
.tag{
  span{
    background:rgb(243, 238, 231);
  }
}
@media (max-width:768px){
    .detail{
             max-width: 380px;
    }
}
@media (min-width:769px){
    .detail{
           grid-auto-flow: column;
           margin-bottom:120px;
           gap:20px;
    }

}
</style>
<script setup>
// pages/cafes/[id].vue の script setup 部分

import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import cafeData from '../../cafes.json'

const route = useRoute()
const cafeId = computed(() => route.params.id) //URLの末尾cafe.idの部分を24時間監視してリアルタイムで検知する
const { checkIfOpen } = useCafe()

//---------Nuxt 3において「現在開いている詳細ページのカフェのデータをJSONから探し出し、URL（ID）が切り替わったときも自動でデータを最新に更新する」という、極めてスマートな非同期データ取得（データ一本釣り）の処理
const {data : cafe } = await useAsyncData(
    ()  =>  `cafe-${cafeId.value}`, //データの識別スタンプ
    () => {
        const found = cafeData.find(cafe => cafe.id === cafeId.value)
        return Promise.resolve(found || null)
    },
    {
        watch:[cafeId] //URLが変わったら自動でデータをリフレッシュ（更新）
    }
)//-------------

// 他の営業中のカフェ（今見ている店は除外）
const othersCafes = computed(() => {
  return cafeData.filter(cafe => cafe.id !== cafeId.value && checkIfOpen(cafe.businessHours)=== true)
})
</script>

