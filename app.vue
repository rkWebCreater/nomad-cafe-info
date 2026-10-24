<template>
  <!-- pagesフォルダの中身をURLに合わせて自動で映し出すスイッチです -->
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
  
</template>
<style>
:root{
  --color-base: #f5efe5;
  --color-accent: #d2a933;
  --color-border: #d6bfa7;
  --color-text: #3e2b24;
  --color-text-white : white;
  --color-muted: #76675d;
}
 /* サイト全体の背景色を一括で指定します */
body {
  color: var(--color-text);
  background: var(--color-base);
  margin: 0;
  font-family: 'zen kurenaido', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
