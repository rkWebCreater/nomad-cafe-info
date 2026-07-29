<!-- app/components/SearchBar.vue 検索バーのコンポーネント-->
<script setup>
// Nuxt 3 では route, router, ref は自動インポートされるため import 文は不要です
const route = useRoute()
const router = useRouter()

// 1. URLにすでに keyword があれば、検索窓の初期値としてセットする
const searchQuery = ref(route.query.keyword || '')

// 2. URLの keyword が変わったときに、検索窓の文字も連動させる
watch(() => route.query.keyword, (newKeyword) => {
  searchQuery.value = newKeyword || ''
})

const handleSearch = () => {
  if (!searchQuery.value.trim()) return // 空っぽのときは何もしない

  router.push({
    path: '/search',
    query: { keyword: searchQuery.value.trim() }
  })

  /* Nuxt 3 専用の組み込み関数（importも const router = useRouter() も不要）
 await navigateTo({
      path: '/search',
      query: { keyword: searchQuery.value?.trim() }
 }) */

}
</script>

<template>
  <!-- form タグで囲み @submit.prevent を使うことで、日本語変換の Enter で誤発火するのを防ぎます -->
  <form @submit.prevent="handleSearch" class="search-container">
    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="名古屋　電源　、Wifi　渋谷など" 
      class="search-input"  
    />
    <button type="submit" class="search-button">検索</button>
  </form>
</template>

<style scoped>
.search-container {
  max-width: 500px;
  max-height:40px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  gap: 1px;
}
.search-input {
  padding: 0 10px ;
  font-size: 16px ;
  border: 1px solid #ccc ;
  border-radius: 6px ;
  width: 100% ;
  height:32px ;

  @media (min-width:768px){
    height:40px ;
  }
  
}
.search-button {
  width:80px;
  font-size: 16px;
  color: rgb(107, 64, 24);
  background-color: rgb(225, 196, 88);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.search-button:hover {
  background-color: #451a03;
}
</style>
