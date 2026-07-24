<!-- 検索結果ページ -->

<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import cafeData from '../cafes.json' //git hub用のパス　git hubにアップする際cafes.jsonまでのパスがローカル環境と違う　appフォルダからpagesやcomponentsなどを出すため

// 1. URLの情報を取得するための準備 useRoute()を取得
const route = useRoute()

// 2. URLの ?keyword=〇〇 の部分やエリアボタンからのクエリをリアルタイムに取得 computed(()=>route.query.oooo || '')　キーワードか空文字を取得
const searchKeyword = computed(()=>route.query.keyword || '')
const searchArea = computed(()=>route.query.area || '')

// エリアボタンから遷移する際の日本語に直して検索結果ページに表示させる
const searchAreaName = computed(() =>{
  if(!searchArea.value) return ''
  const matchedCafe = cafeData.find( cafe => cafe.area ===searchArea.value)
  return matchedCafe ? matchedCafe.areaNameJa : searchArea.value
})

// 3. キーワードをもとにカフェデータを絞り込む　computed(()=>{  })
const filteredCafes = computed(()=> {

    const keyword = searchKeyword.value.trim().toLowerCase() //もし .trim() を使わずにそのまま検索してしまうと、コンピューターは「『スタバ』（スペースなし）と『スタバ 』（スペースあり）は別の言葉だ！」と判断してしまい、本当はデータがあるのに「0件です」と表示されてしまう原因になる
    const area = searchArea.value.trim()

    //どちらも指定がない場合は全件表示
    if(!keyword && !area)  return cafeData

    return cafeData.filter(cafe =>{

       //  カフェ側のデータもすべて小文字に変換して比較する
    const cafeName = cafe.name.toLowerCase()
    const cafeAddress = cafe.address.toLowerCase()
    const cafeArea = cafe.area.toLowerCase() // 💡 これにより「shibuya」等のローマ字と一致するようになる
    const cafeAreaNameJa = cafe.areaNameJa.toLowerCase()

        const matchKeyword = !keyword || 
        cafeName.includes(keyword) || 
        cafeAddress.includes(keyword) || 
        cafeArea.includes(keyword) ||
        cafeAreaNameJa.includes(keyword)

        //エリアの条件（空文字なら無条件でtrue)
        //カフェデータのエリアID(areaId)と照合する想定
        const matchArea = !area || cafe.area === area

        // キーワードとエリア、両方の条件をクリアしたものだけ残す
        return matchKeyword && matchArea
    }
        
    )

})
</script>

<template>

 <div class="search_result">
  <h1>
   <span v-if="searchArea">エリア「{{ searchAreaName }}」</span>
   <span v-if="searchArea && searchKeyword">と</span>
   <span v-if="searchKeyword">キーワード「{{ searchKeyword }}」</span>
   <span v-if="!searchArea && !searchKeyword">すべてのカフェ</span>
  </h1>
  <p><span>{{filteredCafes.length }}件</span>のカフェが見つかりました</p>
 </div>

 <ul class="cafe_filter_list ml-auto mr-auto">

  <li  v-for ="filteredCafe in filteredCafes" :key="filteredCafe.id" >
   <NuxtLink :to="`/cafes/${filteredCafe.id}`" class="">
    <img :src="filteredCafe.imageUrl" :alt="filteredCafe.name" class="w-full h-48 object-cover">
    <div class="p-5 grid grid-rows-[auto_1fr_auto] gap-2 content-between card-body-height flex-1">
      <div>
       <span class="area-name bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded inline-block">{{ filteredCafe.areaNameJa }}</span>
       <h3 class="cafe-name font-bold text-gray-900 mt-2 mb-1 min-h-[2rem] line-clamp-2">{{ filteredCafe.name }}</h3>
      </div>
      <div class="flex flex-col justify-center">
       <p class="text-gray-800 text-sm min-h-[2rem] line-clamp-2">📍 {{ filteredCafe.address }}</p>
       <p class="text-gray-600 text-sm mt-1">🕒 {{ filteredCafe.businessHours }}</p>
      </div>
      <div class="mt-2 flex gap-2 text-xs text-gray-500">
       <span class="bg-gray-100 px-2 py-1 rounded">🛜 {{ filteredCafe.features?.wifi?.available ? 'あり' : 'なし' }}</span>
       <span class="bg-gray-100 px-2 py-1 rounded">🔌 {{ filteredCafe.features?.power?.available ? 'あり' : 'なし' }}</span>
      </div>
    </div>
   </NuxtLink>
  </li>

 </ul>

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