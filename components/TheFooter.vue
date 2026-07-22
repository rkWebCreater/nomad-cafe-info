<script setup>
// エリアリンクのデータ
const areaList = [
  { id: 'shibuya', name: '渋谷' },
  { id: 'shinjuku', name: '新宿' },
  { id: 'umeda', name: '梅田' },
  { id: 'namba', name: '難波' },
  { id: 'nagoya', name: '名古屋' },
  { id: 'fukuoka', name: '福岡' }
]

// タグリンクのデータ
const tagList = [
  { id: 'wifi', name: 'Wi-Fiあり' },
  { id: 'power', name: '電源あり' },
  { id: 'quiet', name: '静か・作業向け' }
]
</script>

<template>
  <footer class="site-footer">
    <div class="footer-container">
      
      <!-- 1. ロゴ・ブランドエリア -->
      <div class="footer-item footer-brand">
        <NuxtLink to="/" class="footer-logo">
          <span class="logo-text">Nomad Cafe Info</span>
        </NuxtLink>
        <p class="brand-desc">カフェで仕事や作業をして過ごしたい人のためのカフェ検索サイト</p>
      </div>

      <!-- 2. 営業中のカフェ -->
      <div class="footer-item">
        <p class="nav-title">カフェを探す</p>
        <ul class="nav-list">
          <li>
            <NuxtLink :to="{ path: '/', hash: '#nowOpenCafe' }" class="nav-link">
              ☕ 今営業中のカフェ
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- 3. エリアから探す -->
      <div class="footer-item">
        <p class="nav-title">エリアから探す</p>
        <ul class="nav-list">
          <li v-for="area in areaList" :key="area.id">
            <NuxtLink :to="{ path: '/search', query: { area: area.id } }" class="nav-link">
              {{ area.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- 4. タグから探す 
      <div class="footer-item">
        <p class="nav-title">タグから探す</p>
        <ul class="nav-list">
          <li v-for="tag in tagList" :key="tag.id">
            <NuxtLink :to="{ path: '/search', query: { tag: tag.id } }" class="nav-link">
              # {{ tag.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>-->

    </div>

    <!-- コピーライト -->
    <div class="footer-bottom">
      <small class="copyright">&copy; {{ new Date().getFullYear() }} Nomad Cafe Info. All rights reserved.</small>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: rgb(167, 123, 88);
  color: rgb(237, 242, 247);
  padding: 40px 20px 20px;
  margin-top: 80px;
}

/* ==============================================
   基本スタイル（SP：デフォルトで縦並び）
============================================== */
.footer-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column; /* SP: 縦並び */
  gap: 32px;
}

.footer-brand {
  max-width: 280px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
}

.brand-desc {
  font-size: 12px;
  color: rgb(224, 218, 203);
  margin-top: 8px;
}

.nav-title {
  font-weight: bold;
  font-size: 0.9rem;
  color: rgb(224, 218, 203);
  margin-bottom: 12px;
  border-bottom: 0.5px solid rgb(65, 40, 20);
  padding-bottom: 4px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.nav-link {
  color: rgb(240, 236, 226);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #fff;
}

.footer-bottom {
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
}

.copyright {
  font-size: 0.75rem;
  color: rgb(65, 40, 20);
}

/* ==============================================
   PCスタイル（768px以上：横並び）
============================================== */
@media (min-width: 768px) {
  .footer-container {
    flex-direction: row;          /* 横並びに切替 */
    justify-content: space-between; /* 4列を等間隔に配置 */
    align-items: flex-start;
  }

  .footer-item {
    flex: 1;                     /* 各列の幅を均等化 */
    max-width: 220px;
  }

  .footer-brand {
    flex: 1.2;                   /* ロゴエリアだけ少し広めに確保 */
    max-width: 260px;
  }
  .nav-list{
    flex-direction: column;
    gap: 8px;
  }
}
</style>