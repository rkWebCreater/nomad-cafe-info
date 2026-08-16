<!-- 検索結果ページ -->

<script setup>
/* import {computed} from 'vue'  vueのimport ref,computedなどの記述はNuxtでは不要
import {useRoute} from 'vue-router' */
import { AREA_MAP } from '../constants/areas'
import { TAG_MAP } from '../constants/tags'
import cafeData from '@@/cafes.json'

// ① 読み込んだJSONデータをリアクティブ（Ref）に変換する
const allCafes = ref(cafeData)

// ② 裏方の useCafe.ts にデータを渡して、画面で使いたい道具を受け取る
const {
  isLoading,
  noticeMessage,
  aiConditions,
  searchResults,
  searchKeyword,   //画面に検索キーワードを表示する用
  searchArea,      //画面にエリアを表示する用
  searchTag,       //画面にタグを表示する用
} = useCafe(allCafes)

// ③ タグの英名（例: "power"）を日本語（例: "電源あり"）に変換する計算
const searchTagName = computed(() => {
  if(!searchTag.value) return ''
  //TAG_MAP にデータがあればその日本語名を返し、なければそのままの文字列を返す
  return TAG_MAP[searchTag.value] || searchTag.value
})

// ④ エリアの英名（例: "nagoya"）を日本語（例: "名古屋"）に変換する計算
const searchAreaName = computed(() => {
  if (!searchArea.value) return ''
  // もしエリアの対応表があれば変換し、なければURLの文字をそのまま返す
  return AREA_MAP[searchArea.value] || searchArea.value
})

</script>

<template>
  <!-- 1. AIローディング中の表示（検索時にふわっと出す） -->
  <div v-if="isLoading" class="text-center py-8 text-amber-800 bg-amber-50 rounded-lg mb-6">
    <p class="text-lg font-bold animate-pulse">🤖 AIが条件を解析して最適なカフェを探しています...</p>
  </div>

  <!-- 2. フォールバック・通知メッセージ（条件に合うものがなく別候補を出した時など） -->
  <div v-if="noticeMessage" class="mb-6 p-4 bg-orange-100 text-orange-800 rounded-lg text-sm border border-orange-200 text-center">
    {{ noticeMessage }}
  </div>

  <!-- 3. AIが解析した検索条件のボックス（Geminiが動いている証拠） -->
  <div v-if="aiConditions" class="mb-6 p-4 border rounded-lg text-sm">
    <p class="font-bold text-slate-700 mb-1 text-center">🤖 AIが以下の条件を読み取りました：</p>
    <div class="flex flex-wrap justify-center gap-2 text-slate-600">
      <span v-if="aiConditions.area" class="bg-white px-2 py-1 rounded border border-slate-200">
       📍 エリア: <strong>{{ aiConditions.area }}</strong>
      </span>
      <span v-if="Boolean(aiConditions.features) && aiConditions.features.length > 0" class="bg-white px-2 py-1 rounded border border-slate-200">
        ✨ 設備・特徴: <strong>{{ aiConditions.features.join(', ') }}</strong>
      </span>
    </div>
  </div>

  <!-- 検索結果のヘッダー情報 -->
  <div class="search_result" id="search-header">
    <h1>
      <!-- エリア・キーワード・タグの組み合わせ表示 -->
      <span v-if="searchArea">エリア「{{ searchAreaName }}」</span>
      <span v-if="searchArea && (searchKeyword || searchTag)">と</span>
      
      <span v-if="searchKeyword">キーワード「{{ searchKeyword }}」</span>
      <span v-if="searchKeyword && searchTag">と</span>
      
      <span v-if="searchTag">タグ「{{ searchTagName }}」</span>
      
      <!-- いずれも指定がない場合 -->
      <span v-if="!searchArea && !searchKeyword && !searchTag">すべてのカフェ</span>
    </h1>
    <p><span>{{ searchResults.length }}件</span>のカフェが見つかりました</p>
  </div>

  <!-- 検索結果一覧 -->
  <!-- 1件以上ある場合 （※ filteredCafes から searchResults に変更）-->
  <ul v-if="searchResults.length > 0" class="cafe_filter_list ml-auto mr-auto">
    <li v-for="filteredCafe in searchResults" :key="filteredCafe.id">
      <NuxtLink :to="`/cafes/${filteredCafe.id}`" class="block h-full">
        <img :src="filteredCafe.imageUrl" :alt="filteredCafe.name" class="w-full h-48 object-cover"/>
        
        <div class="p-5 grid grid-rows-[auto_1fr_auto] gap-2 content-between card-body-height flex-1">
          <div>
            <span class="area-name bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded inline-block">
              {{ filteredCafe.areaNameJa }}
            </span>
            <h3 class="cafe-name font-bold text-gray-900 mt-2 mb-1 min-h-[2rem] line-clamp-1.5 py-0 px-[5px]">
              {{ filteredCafe.name }}
            </h3>
            <p class="text-gray-800 text-sm min-h-[2rem] line-clamp-1.5">
              📍{{ filteredCafe.address }}
            </p>
            <p class="text-gray-600 text-sm mt-1">
              🕒{{ filteredCafe.businessHours }}
            </p>
          </div>
          
          <div class="tags mt-2 flex gap-2 text-xs text-gray-500">
            <span class="bg-gray-100 px-2 py-1 rounded">
              <img src="/images/icon/wifi_icon.png" alt="wifiのアイコン" class="w-4">{{ filteredCafe.features?.wifi?.available ? 'あり' : 'なし' }}
            </span>
            <span class="bg-gray-100 px-2 py-1 rounded">
              <img src="/images/icon/power_icon.png" alt="powerのアイコン" class="w-4">{{ filteredCafe.features?.power?.available ? 'あり' : 'なし' }}
            </span>
          </div>

        </div>
      </NuxtLink>
    </li>
  </ul>

  <!-- 0件の場合のメッセージ （ローディング中でない時だけ表示）-->
  <div v-else-if="!isLoading" class="text-center py-12 text-gray-500">
    <p class="text-lg font-medium">条件に一致するカフェが見つかりませんでした。</p>
    <p class="text-sm mt-2">検索キーワードやエリアを変更して再度お試しください。</p>
    <p v-if="searchTag === 'meeting'" class="text-xs text-amber-700 bg-amber-50 inline-block px-3 py-1.5 rounded-full mt-4 border border-amber-200">
      ※「打あわせ可」は0件表示のデザイン確認用のため、現在データをセットしていません。
    </p>
  </div>
</template>

<style>
 .search_result{
              padding: 20px;
              margin-top: 80px;
              text-align:center;

            h1{
              width: fit-content;
              font-size:20px ;
              background: aliceblue;
              border-radius: 40px;
              padding: 10px 20px 10px 20px;
              margin-left: auto;
              margin-right: auto;
              margin-bottom: 20px;
            }
            p{
              width: fit-content;
              background: aliceblue;
              border-radius: 40px;
              padding: 10px 20px ;
              margin-left: auto;
              margin-right: auto;
              margin-bottom: 20px;

             span{
                 background: linear-gradient(transparent 45%, rgb(232 204 180) 80%);
             }
            }
 }
 .cafe_filter_list{
               display: grid;
               grid-template-columns: repeat(auto-fill, 300px);
               align-content: center;
               grid-auto-flow: row;
               justify-content: center;
               gap: 20px;

              li{
                background: white;
                border-radius: 10px;

               img{
                   border-radius: 10px 10px 0 0 ;
               }
              }
               
 }
 .tags{
    & span{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 4px ;
      align-content: center;
  }
}
</style>