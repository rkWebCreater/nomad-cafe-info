<!-- 検索結果ページ -->

<script setup>
/* import {computed} from 'vue'  vueのimport ref,computedなどの記述はNuxtでは不要
import {useRoute} from 'vue-router' 
*/
import cafeData from '~/cafes.json' 
/* タグの英名と日本語名の対応表を用意
wifiやpowerなどの英単語は引用符ありなしどちらでもOK　no-smoking ―がある場合は引用符がいる*/
const tagMap = {
  power: '電源',
  wifi: 'Wifi',
  morning: 'モーニング',
  lunch: 'ランチ',
  single: '一人席',
  'no-smoking': '禁煙',
  meeting: '打あわせ可'
}

// 1. URLの情報を取得するための準備 useRoute()を取得
const route = useRoute()

// 2. URLの ?keyword=〇〇 の部分やエリアボタンからのクエリをリアルタイムに取得 computed(()=>route.query.oooo || '') キーワードか空文字を取得
const searchKeyword = computed(() => route.query.keyword || '')
const searchArea = computed(() => route.query.area || '')
const searchTag = computed(() => route.query.tag || '')

//エリアボタンから遷移する際　日本語に変換して表示させる処理
const searchAreaName = computed(() => {
  if (!searchArea.value) return ''
  const matchedAreaButton = cafeData.find(cafe => cafe.area === searchArea.value)
  return matchedAreaButton ? matchedAreaButton.areaNameJa : searchArea.value
})
//タグから遷移する際　日本語に変換して表示させる処理
const searchTagName = computed(()=>{
  if(!searchTag.value) return ''
  return tagMap[searchTag.value] || searchTag.value
})

// 3. キーワードをもとにカフェデータを絞り込む computed(()=>{  })
const filteredCafes = computed(() => {

  const rawKeyword = searchKeyword.value.trim().toLowerCase() //もし .trim() を使わずにそのまま検索してしまうと、コンピューターは「『スタバ』（スペースなし）と『スタバ 』（スペースあり）は別の言葉だ！」と判断してしまい、本当はデータがあるのに「0件です」と表示されてしまう原因になる
  const area = searchArea.value.trim()
  const tag = searchTag.value.trim()

  // 全角スペースも半角スペースに統一してから、スペースで区切って配列にする
  // 例: "渋谷 電源" ➔ ["渋谷", "電源"]
  const keywords = rawKeyword ? rawKeyword.replace(/ /g, ' ').split(/\s+/).filter(Boolean) : []

  //どちらも指定がない場合は全件表示
  if (keywords.length === 0 && !area && !tag) return cafeData

  return cafeData.filter(cafe => {
    // 条件A: キーワード（複数単語のAND検索 ＆ 設備判定）
    // 1. 店名・住所・エリア名に含まれるか
    const matchKeyword = keywords.every(kw => {
      const inText = 
        cafe.name.toLowerCase().includes(kw) || 
        cafe.address.toLowerCase().includes(kw) || 
        cafe.area.toLowerCase().includes(kw) || 
        cafe.areaNameJa.toLowerCase().includes(kw)

      //検索ワードが「電源」関連の場合、cafe.features.power.available を判定  【?.】オプショナルチェイニング：featuresなどが存在しない場合もエラーを出さず安全に判定
      const isPowerKw = ['電源' , '電源あり', 'コンセント', 'コンセントあり', 'power'].includes(kw)
      const inPower = isPowerKw && Boolean(cafe.features?.power?.available)
      
      //検索ワードが「wifi」関連の場合、cafe.features.wifi.available を判定
      const isWifiKw = ['wifi','wifiあり', 'wi-fi', 'わいふぁい' , 'わいふぁいあり' , 'ワイファイ' , 'ワイファイあり'].includes(kw)
      const inWifi = isWifiKw && Boolean(cafe.features?.wifi?.available)

      // テキスト・電源・WiFiのどれか1つでもマッチしていれば、このキーワード(kw)はクリア
      return inText || inPower || inWifi
    })

    //エリアの条件（空文字なら無条件でtrue)
    //カフェデータのエリアID(areaId)と照合する想定
    const matchArea = !area || cafe.area === area

    //条件C: タグ検索 (?tag=power や ?tag=wifi など)
    // 【[tag]】ブラケット記法：変数 tag の文字列（"power"や"wifi"）を使って動的にプロパティへアクセス
    const matchTag = !tag || cafe.features?.[tag]?.available === true

    // すべての条件（キーワード AND エリア AND タグ）をクリアしたデータだけを残す
    return matchKeyword && matchArea && matchTag
  })

})
</script>

<template>
  <!-- 検索結果のヘッダー情報 -->
  <div class="search_result">
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
    <p><span>{{ filteredCafes.length }}件</span>のカフェが見つかりました</p>
  </div>

  <!-- 検索結果一覧 -->
  <!-- 1件以上ある場合 -->
  <ul v-if="filteredCafes.length > 0" class="cafe_filter_list ml-auto mr-auto">
    <li v-for="filteredCafe in filteredCafes" :key="filteredCafe.id">
      <NuxtLink :to="`/cafes/${filteredCafe.id}`" class="block h-full">
        <img :src="filteredCafe.imageUrl" :alt="filteredCafe.name" class="w-full h-48 object-cover"/>
        
        <div class="p-5 grid grid-rows-[auto_1fr_auto] gap-2 content-between card-body-height flex-1">
          <div>
            <span class="area-name bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded inline-block">
              {{ filteredCafe.areaNameJa }}
            </span>
            <h3 class="cafe-name font-bold text-gray-900 mt-2 mb-1 min-h-[2rem] line-clamp-2">
              {{ filteredCafe.name }}
            </h3>
          </div>
          
          <div class="flex flex-col justify-center">
            <p class="text-gray-800 text-sm min-h-[2rem] line-clamp-2">📍 {{ filteredCafe.address }}</p>
            <p class="text-gray-600 text-sm mt-1">🕒 {{ filteredCafe.businessHours }}</p>
          </div>
          
          <div class="mt-2 flex gap-2 text-xs text-gray-500">
            <span class="bg-gray-100 px-2 py-1 rounded">
              🛜 {{ filteredCafe.features?.wifi?.available ? 'あり' : 'なし' }}
            </span>
            <span class="bg-gray-100 px-2 py-1 rounded">
              🔌 {{ filteredCafe.features?.power?.available ? 'あり' : 'なし' }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </li>
  </ul>

  <!-- 0件の場合のメッセージ -->
  <div v-else class="text-center py-12 text-gray-500">
    <p class="text-lg font-medium">条件に一致するカフェが見つかりませんでした。</p>
    <p class="text-sm mt-2">検索キーワードやエリアを変更して再度お試しください。</p>
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
              padding: 10px ;
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
</style>