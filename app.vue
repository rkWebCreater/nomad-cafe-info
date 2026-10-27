<script setup lang="ts">
const route = useRoute();

</script>
<template>
  <!-- pagesフォルダの中身をURLに合わせて自動で映し出すスイッチです -->
   <div class="app-shell">
    <RouteBackground :key="route.path" :accent-rate="0.28" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
 /* サイト全体の背景色を一括で指定します */
body {
  color: var(--color-text);
  background: var(--color-base);
  margin: 0;
}
.app-shell {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
}
</style>
