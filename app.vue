<template>
  <!-- pagesフォルダの中身をURLに合わせて自動で映し出すスイッチです -->
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
  
</template>
<style>
 /* サイト全体の背景色を一括で指定します */
body {
  background-color: rgb(255, 241, 229); /* カフェサイトに合う優しい生成り色 */
  margin: 0;
  color: rgb(65, 40, 20); /* 全体の標準の文字色もここで指定できます */
  font-family: 'zen kurenaido', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
