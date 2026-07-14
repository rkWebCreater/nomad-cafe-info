<!-- pages/cafes/[id].vue -->

<template>
  <Drawer />
  <div class=" mx-auto p-4 text-left">
    
    <!-- クリックしたカフェ一軒の表示部分 -->
    <div v-if="cafe" class="detail rounded-2xl shadow-md overflow-hidden ml-auto mr-auto mb-10">
      <img :src="cafe.imageUrl" :alt="cafe.name" class="mainImg object-cover w-96 h-64" />
      <div class="p-5">
       <span class="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded">{{ cafe.areaNameJa }}</span>
       <h1 class="cafe-name font-bold text-gray-900 text-2xl mt-2 mb-3">{{ cafe.name }}</h1>
       <div class="description">
        <p class="text-gray-800 text-sm mt-1">📍 住所: {{ cafe.address }}</p>
        <p class="text-gray-600 text-sm mt-1">🕒 営業時間: {{ cafe.businessHours }}</p>
        <p class="text-gray-600 text-sm mt-1">💰予算: {{ cafe.budget }}</p>
       </div>
       <p class="text-gray-600 text-m m-2">HP: {{ cafe.website }}</p>
       <div class="mt-2 flex gap-2 text-xs text-gray-500">
        <span class="bg-gray-100 px-2 py-1 rounded">🛜 {{ cafe.features?.wifi?.available ? 'あり' : 'なし' }}</span>
        <span class="bg-gray-100 px-2 py-1 rounded">🔌 {{ cafe.features?.power?.available ? 'あり' : 'なし' }}</span>
       </div>
    </div>
      
    </div>

    <!-- 💡 【フリーズ解決の最重要エリア】他のおすすめカフェセクション -->
    <!-- :key="cafeId" をセクション全体に指定し、URLが変わるたびにスライダーごと新しく作り直します -->
    <div v-if="othersCafes && othersCafes.length > 0" :key="cafeId" class="cafe-cards-section  ml-auto mr-auto mt-10">
      <h2 class="cafe-cards-ttl font-bold text-white text-xl mb-2">他のおすすめカフェ</h2>
      <p class="canSlide text-gray-300 text-xs mb-4">＜ーー スライドできます ーー＞</p>
      <!-- 💡 除外済みの正しいリスト（otherCafes）」を、:cafes で渡します -->
      <CafeCards :cafes="othersCafes" />
    </div>

  </div>
</template>

<style>

.detail{
        max-width: 1100px;
        background: rgb(255, 250, 244);
        display: grid;
        grid-auto-flow: row;

}
.cafe-cards-section{
        max-width: 1100px;
}
.cafe-cards-ttl{
              text-align :center;
}
.canSlide{
          text-align : center;
}

@media (min-width:1024px){
    .detail{
           grid-auto-flow: column;
           margin-bottom:120px;
    }

}
</style>
<script setup>
// pages/cafes/[id].vue の script setup 部分

import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import cafeData from '../../../cafes.json'

const route = useRoute()
const cafeId = computed(() => route.params.id) //URLの末尾cafe.idの部分を24時間監視してリアルタイムで検知する

const {data : cafe } = await useAsyncData(
    ()  =>  `cafe-${cafeId.value}`, //データの識別スタンプ
    () => {
        const found = cafeData.find(item => item.id === cafeId.value)
        return Promise.resolve(found || null)
    },
    {
        watch:[cafeId] //URLが変わったら自動でデータをリフレッシュ（更新）
    }
)
//営業中かどうかの判定 スライダーのカードをコンポーネント化しているのでCafeCards.vue側にもcheckIfOpen関数を記述する
const checkIfOpen = (businessHours) => {

  const now = new Date();//今の日付
  const currentHours = String(now.getHours()).padStart(2,'0');//String()で文字データに変換し.padStart(2,'0')で1桁の数字（例：9）を、2桁のきれいな文字列（例：09）に強制的に変換する .padStart( , '')は文字列にしか使えない
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const nowTimeNum = Number(currentHours + currentMinutes); //Number()で数値化する
  
  const times = businessHours.split('-');
  if (times.length !== 2) return false //もしデータが未入力だったり形式が違ったりした場合に、エラーを起こさず安全に「営業外（false）」として弾く。
  
  const openTimeNum = Number(times[0].trim().replace(':', ''))//Number(...) で、文字列から純粋な数値の 800 に変換する。times[0].trim() 文字のまわりにある余分なスペース（半角・全角）をキレイに消去して "08:00" にする。 replace(':', '') で、コロンを消し去って "0800" というただの数字の並びにする。
  const closeTimeNum = Number(times[1].trim().replace(':', ''))

  if(closeTimeNum < openTimeNum){
    // 終了時間が開店時間より小さい＝深夜営業の店の場合

    // 「開始時刻以降（18時〜24時）」または「終了時刻まで（0時〜3時）」なら営業中
     return nowTimeNum >= openTimeNum || nowTimeNum <= closeTimeNum
  
  }else{
    // 終了時間が開店時間より大きい＝通常営業の店の場合
     return nowTimeNum >= openTimeNum && nowTimeNum <= closeTimeNum
  }
}

// 他の営業中のカフェ（今見ている店は除外）
const othersCafes = computed(() => {
  return cafeData.filter(item => item.id !== cafeId.value && item.isOpen === true)
})
</script>

