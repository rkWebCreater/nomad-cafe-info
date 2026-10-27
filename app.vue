<script setup lang="ts">
const route = useRoute();

</script>
<template>
  <!-- pagesフォルダの中身をURLに合わせて自動で映し出すスイッチです -->
   <div class="app-shell">
    <RouteBackground :key="route.path" :accent-rate="0.08" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
:root{
  --color-base: #f5efe5;
  --color-accent: #d2a933;
  --color-border: #d6bfa7;
  --color-text: #3e2b24;
  --color-text-white : white;
  --color-muted: #5c5049;
}
 /* サイト全体の背景色を一括で指定します */
body {
  color: var(--color-text);
  background: var(--color-base);
  margin: 0;
  font-family: 'zen kurenaido', sans-serif;
}
.app-shell {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
}
</style>
