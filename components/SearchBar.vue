<!-- app/components/SearchBar.vue 検索バーのコンポーネント-->
<template>
  <div class="search-container">
    <input v-model="searchQuery" @keydown.enter ="handleSearch" type="text" placeholder="地名、カフェ名" class="search-input"  />
    <button class="search-button"  @click="handleSearch" >検索</button>
  </div>
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
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  height:40px;
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
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if(!searchQuery.value.trim()) return //空っぽのときは何もしない

  router.push({
    path:'/search' , 
    query : { keyword : searchQuery.value }
  })
}
</script>