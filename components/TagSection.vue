<script setup>
import { TAGS } from '~/constants/tags'

// 画像に表示されているタグのリスト
// key は JSON 側のプロパティ名やクエリのパラメータに合わせて調整できます
/*const tags = [
  { name: '電源', key: 'power' },
  { name: 'Wifi', key: 'wifi' },
  { name: 'モーニング', key: 'morning' },
  { name: 'ランチ', key: 'lunch' },
  { name: '一人席', key: 'single' },
  { name: '禁煙', key: 'no-smoking' },
  { name: '打あわせ可', key: 'meeting' }
] constants/tags.js にまとめたので消しても大丈夫　*/
 /*
 const tagImages =[
  {id:1 , name:'wifiImage' , imgUrl :'~/images/illust/wifi_pin.png'},
  {id:2 , name:'powerImage' , imgUrl :'~/images/illust/power_pin.png'}
  ]  
  */
</script>

<template>
  <section class=" px-4 text-center mb-20" id="cafeTag">
    <!-- タイトル -->
    <h2 class="section-ttl text-[#7A583A] tracking-wider mb-4"><!-- tracking-wider は、CSSの letter-spacing（文字と文字の間の余白）を少し広くする Tailwind CSSのクラス -->
      タグから探す
    </h2>

    <!-- 説明文 -->
    <p class="text-[#7A583A] text-sm md:text-base leading-relaxed mb-8">
      あなたの作業スタイルに合ったカフェを<br class="block sm:hidden" /> <!-- <br class="block sm:hidden" /> でスマホ時は改行、PCタブレット（sm:以上 ）では非表示にする-->
      細かい条件で絞り込んで検索できます
    </p>
    <!-- タグイラスト 
    <div v-for="tagImage in tagImages" :key="tagImage.id" class="tag_image">
      <img src="tagImage.imgUrl" alt="tagImage.name">
    </div>
-->
    <!-- タグボタン一覧 -->
    <div class="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
      <NuxtLink
        v-for="tag in TAGS"
        :key="tag.key"
        :to="{ path: '/search', query: { tag: tag.key } }"
        class="inline-block bg-[#e48e43] hover:bg-[#ae7d4d] text-white text-sm md:text-base px-6 py-2.5 rounded-full transition-colors duration-200 shadow-sm">
        {{ tag.name }}
      </NuxtLink>
    </div>
  </section>
</template>
<style>
.section-ttl{
  font-size:18px;
  
  @media (min-width:768px){
        font-size:25px;
      }
}
</style>