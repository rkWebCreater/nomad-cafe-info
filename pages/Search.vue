<!-- 検索結果ページ -->

<script setup>
/* import {computed} from 'vue'  vueのimport ref,computedなどの記述はNuxtでは不要
import {useRoute} from 'vue-router' */
import { TAG_MAP } from '~/constants/tags'
import cafeData from '../../../cafes.json'

// 1. URLの情報を取得するための準備 useRoute()を取得
const route = useRoute()
//追記
const searchResults = ref([])
const aiConditions = ref(null)
const noticeMessage = ref('')
const isLoading = ref(false)

// 2. URLの ?keyword=〇〇 の部分やエリアボタンからのクエリをリアルタイムに取得 computed(()=>route.query.oooo || '') キーワードか空文字を取得
const searchKeyword = computed(() => route.query.keyword || '')
const searchArea = computed(() => route.query.area || '')
const searchTag = computed(() => route.query.tag || '')

// 入力値のバリデーション（空文字NG、100文字以内）
const isValidInput = computed(() =>{
  const trimmed = searchKeyword.value.trim()
  return trimmed.length > 0 && trimmed.length <= 100
})

//エリアボタンから遷移する際　日本語に変換して表示させる処理
const searchAreaName = computed(() => {
  if (!searchArea.value) return ''
  const matchedAreaButton = cafeData.find(cafe => cafe.area === searchArea.value)
  return matchedAreaButton ? matchedAreaButton.areaNameJa : searchArea.value
})

//タグから遷移する際　日本語に変換して表示させる処理
const searchTagName = computed(()=>{
  if(!searchTag.value) return ''
  return TAG_MAP[searchTag.value] || searchTag.value
})

// キーワードをもとにカフェデータを絞り込む　ローカル検索  computed(()=>{  })
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
        (cafe.name?.toLowerCase().includes(kw)) || 
        (cafe.address?.toLowerCase().includes(kw)) || 
        (cafe.area?.toLowerCase().includes(kw)) || 
        (cafe.areaNameJa?.toLowerCase().includes(kw))

      //検索ワードが「電源」関連の場合、cafe.features.power.available を判定  【?.】オプショナルチェイニング：featuresなどが存在しない場合もエラーを出さず安全に判定
      // 2. 検索ワードに「電源」関連の言葉が含まれているかを柔軟に判定（someを使用）
      const isPowerKw =[ '電源' , '電源あり', 'コンセント', 'コンセントあり', 'power'].includes(kw)
      const inPower = isPowerKw && Boolean(cafe.features?.power?.available)
      
      //検索ワードが「wifi」関連の場合、cafe.features.wifi.available を判定
      // 3. 検索ワードに「wifi」関連の言葉が含まれているかを柔軟に判定（someを使用）
      const isWifiKw =['wifi','wifiあり', 'wi-fi', 'わいふぁい' , 'わいふぁいあり' , 'ワイファイ' , 'ワイファイあり'].includes(kw)
      const inWifi = isWifiKw && Boolean(cafe.features?.wifi?.available)

      // テキスト・電源・WiFiのどれか1つでもマッチしていれば、このキーワード(kw)はクリア
      return inText || inPower || inWifi
    })

    //エリアの条件（空文字なら無条件でtrue)
    //カフェデータのエリアID(areaId)と照合する想定
    const matchArea = !area || cafe.area === area

    /*条件C: タグ検索 (?tag=power や ?tag=wifi など)
    【[tag]】ブラケット記法：変数 tag の文字列（"power"や"wifi"）を使って動的にプロパティへアクセス
    Boolean（ブーリアン / 真偽値）とは、プログラミングの世界における 「true（真・正しい）」か「false（偽・間違い）」の2通りしか存在しないデータ型（値の種類）のこと
    */
    const matchTag = !tag || cafe.features?.[tag]?.available === true // || Boolean(cafe[tag])  他の値をtagに引っ掛けるようにしたい場合

    // すべての条件（キーワード AND エリア AND タグ）をクリアしたデータだけを残す
    return matchKeyword && matchArea && matchTag
  })

})

//------------------------ gemini ai
//fetchSearchResults 関数配置
const fetchSearchResults = async (keyword) => {
  if(!keyword || !keyword.trim() || isLoading.value) return

  isLoading.value = true
  noticeMessage.value = ''
  aiConditions.value = null
  searchResults.value = []//ここで空にする

  try{
    const data = await $fetch(`/api/search?text=${encodeURIComponent(keyword.trim())}`)
    //最初に失敗か(successではない)どうかチェック
    //もし失敗していたら、ここで強制的にエラーを起こして下のcatchブロックにワープさせる  ガード節
    if(!data.success){
      throw new Error(data.message || 'APIの処理に失敗しました')
    }
    //↓はdata.successがtrueしていることになります　全体をif(data.success){}で囲む必要がなくなる
    if(data.results.length === 0){
      searchResults.value = filteredCafes.value
      if(searchResults.value.length > 0){
        noticeMessage.value = 'AI検索で一致しなかったため、通常のキーワード検索結果を表示しています。'
      }
    }else{
      searchResults.value = data.results
      aiConditions.value = data.conditions
      if(data.isFallback && data.message){
        noticeMessage.value = data.message
      }
    }

  }
  catch (error) {
    // 💡 AIの制限（429エラーなど）や通信エラーが起きた場合、
    // 自動的に従来のローカル絞り込み結果（filteredCafes）に切り替えて表示する
    console.error('Search request error:', error)
    noticeMessage.value = '⚠️ AIの利用制限に達したため、通常のキーワード検索結果を表示しています。'
    searchResults.value = filteredCafes.value
  }
  finally{
    isLoading.value = false
  }
}

// footerでタグを押したときどのページでも見出しまでスクロールするための処理　タグ（route.query.tag）が変わったのを検知してスクロールさせる
// タグ（tag）またはエリア（area）が変わったのを検知してスクロールさせる
watch(
  [() => route.query.keyword ,() => route.query.tag, () => route.query.area],
  async ([newKeyword]) => {
    // 1. 自由テキストのキーワードがある場合は、AI検索を実行
    if(newKeyword){
      //キーワード（文章）がある場合　AI検索を実行
      await fetchSearchResults(newKeyword)
    }else {
      //キーワードがない場合（エリアボタンやタグ単体、または条件なし）
      aiConditions.value = null
      noticeMessage.value = ''
      searchResults.value = filteredCafes.value
    }

    // DOM（画面の要素）が更新されるのを少し待つ
    await nextTick()
    // どのクエリ（keyword, tag, area）が変わった場合でも、画面の更新を待ってからスクロール
    const headerEl = document.getElementById('search-header')
    if (headerEl) {
      headerEl.scrollIntoView({ behavior: 'smooth' })
    }
  },
  {immediate:true } // ← この3行目を追加するだけで、onMountedの代わりになります！
)
/*ユーザーが直接URL（例: [https://example.com/search?keyword=名古屋](https://example.com/search?keyword=名古屋)）をブラウザに入力してページを開いたり、ページをリロード（再読み込み）したりしたとき、「URLが変わった瞬間（watch）」は起きず、「ページが最初に開いた瞬間」だけが起きます。
onMounted を書くか、あるいは watch に「初回も自動で実行してね」というおまじないをつけるかのどちらかをしておかないと、「直接URLを開いたときに検索結果が出ない」という現象が起きてしまうから */

</script>

<template>
  <!-- 1. AIローディング中の表示（検索時にふわっと出す） -->
  <div v-if="isLoading" class="text-center py-8 text-amber-800 bg-amber-50 rounded-lg mb-6">
    <p class="text-lg font-bold animate-pulse">🤖 AIが条件を解析して最適なカフェを探しています...</p>
  </div>

  <!-- 2. フォールバック・通知メッセージ（条件に合うものがなく別候補を出した時など） -->
  <div v-if="noticeMessage" class="mb-6 p-4 bg-orange-100 text-orange-800 rounded-lg text-sm border border-orange-200">
   ⚠️ {{ noticeMessage }}
  </div>

  <!-- 3. AIが解析した検索条件のボックス（Geminiが動いている証拠） -->
  <div v-if="aiConditions" class="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm">
    <p class="font-bold text-slate-700 mb-1">🤖 AIが以下の条件を読み取りました：</p>
    <div class="flex flex-wrap gap-2 text-slate-600">
      <span v-if="aiConditions.area" class="bg-white px-2 py-1 rounded border border-slate-200">
       📍 エリア: <strong>{{ aiConditions.area }}</strong>
      </span>
      <span v-if="aiConditions.features && aiConditions.features.length > 0" class="bg-white px-2 py-1 rounded border border-slate-200">
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

  <!-- 0件の場合のメッセージ （ローディング中でない時だけ表示）-->
  <div v-else-if="!isLoading" class="text-center py-12 text-gray-500">
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