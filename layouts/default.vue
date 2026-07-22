<!-- layouts/default.vue -->
<!-- app/layouts/default.vue -->
<template>
  <div class="layout-container">
    <Drawer />

    <main class="main-content">
      <slot />
    </main>

    <!-- components/TheFooter.vue が自動で読み込まれます -->
    <TheFooter />
  </div>
</template>

<style scoped>
/* ページのコンテンツが少ない時でも、フッターを画面の一番下に固定するためのCSS */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>