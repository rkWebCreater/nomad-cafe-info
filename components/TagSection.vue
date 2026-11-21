<script setup>
import { TAGS } from '~/constants/tags'
const router = useRouter()
const selectedTags = ref([]) // 選択されたタグを保持する配列

function toggleTag(tagKey) {
  // 選択済みのタグが含まれている場合は削除、含まれていない場合は追加する
  selectedTags.value = selectedTags.value.includes(tagKey)
    ? selectedTags.value.filter((key) => key !== tagKey)
    : [...selectedTags.value, tagKey]
}

function applyFilters() {
  // 選択されたタグをクエリパラメータとしてルートに渡す
  router.push({ path: '/search', query: { tag: selectedTags.value.join(',') } })
}

function resetFilters() {
  selectedTags.value = [] // 選択されたタグをリセット
}
</script>

<template>
  <section class=" px-4 text-center mb-20">
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
      <button
        v-for="tag in TAGS"
        :key="tag.key"
        @click="toggleTag(tag.key)"
        :style="{ '--tag-icon': `url('${tag.iconImg}')` }"
        class="tag-btn inline-block text-sm md:text-base px-4 py-2 rounded-full transition-colors duration-200 shadow-sm"
        :class="{ 'is-selected': selectedTags.includes(tag.key) }"
        >
        {{ tag.name }}
      </button>
    </div>

    <div class="btns flex justify-center gap-4 mt-8">
     
     <!-- 絞り込みボタン -->
     <button @click="applyFilters" class="btn bg-[#7A583A] text-white px-6 py-2.5 rounded-full transition-colors duration-200 shadow-sm">
      絞り込み
     </button>

     <!-- リセットボタン -->
     <button @click="resetFilters" class="btn bg-[#dcdcdc] text-[#7A583A] px-6 py-2.5 rounded-full transition-colors duration-200 shadow-sm">
       リセット
     </button>
    
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
.tag-btn {
  position: relative;
  background: #fff8f0;
}
.is-selected {
  color: #fff8f1;
  background: radial-gradient(#682b01, #ffc78f);
  box-shadow: 0 0 0 3px rgb(177 98 19 / 35%);
}
/* 疑似要素の設定 
*/
.tag-btn::after{
    content: '';
    opacity: 0;

    /* svgの色を変更　background の代わりに　mask を使う */
    -webkit-mask: var(--tag-icon) left center / contain no-repeat;
    mask: var(--tag-icon) left center / contain no-repeat;
    background: rgb(245 240 230 / 50%);
    z-index: -1;

    /* 配置設定 */
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    transition: opacity 0.5s cubic-bezier(0.75, -0.2, 0.19, 1.36), top 0.5s cubic-bezier(0.82, -0.22, 0.25, 1);
}
.tag-btn:hover::after{
  opacity: 1 ;
  top:50%;
}
.btns .btn:hover{
  opacity:0.8;
}

</style>