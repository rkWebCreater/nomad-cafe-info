<script setup>
import {TAGS} from '~/constants/tags'
// エリアリンクのデータ
const areaList = [
  { id: 'shibuya', name: '渋谷' },
  { id: 'shinjuku', name: '新宿' },
  { id: 'umeda', name: '梅田' },
  { id: 'namba', name: '難波' },
  { id: 'nagoya', name: '名古屋' },
  { id: 'fukuoka', name: '福岡' }
]

</script>

<template>
  <footer class="site-footer">
    <div class="footer-container">
      
      <!-- 1. ロゴ・ブランドエリア -->
      <div class="footer-item footer-brand">
        <NuxtLink to="/" class="inline-block">
          <img 
            src="/images/Logo/nomad_cafe_info.webp" 
            class="footer-logo" 
            width="150" 
            height="33" 
            sizes="sm:150px md:200px"
            alt="nomad cafe info"
          />
        </NuxtLink>
        <p class="brand-desc">カフェで仕事や作業をして過ごしたい人のための<br>カフェ検索サイト</p>
      </div>

      <!-- 2. 営業中のカフェ -->
      <div class="footer-item">
        <p class="nav-title">カフェを探す</p>
        <ul class="nav-list">
          <li>
            <NuxtLink :to="{ path: '/', hash: '#nowOpenCafe' }" class="nav-link">
             現在営業中のカフェ
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

      <div class="footer-item">
        <p class="nav-title">タグから探す</p>
        <ul class="nav-list">
          <li v-for="tag in TAGS" :key="tag.key">
            <NuxtLink :to="{ path: '/search/', hash:'#search-header', query: { tag: tag.key } }" class="nav-link">
               {{ tag.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

    </div>

    <!-- コピーライト -->
    <div class="footer-bottom">
      <small class="copyright">&copy; {{ new Date().getFullYear() }} Nomad Cafe Info. All rights reserved.</small>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--color-base);
  color: var(--color-text);
  padding: 40px 20px 20px;
  margin-top: 80px;

  /* ----------------------------------
     1. コンテナエリア
  ---------------------------------- */
  .footer-container {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column; /* SP: 縦並び */
    gap: 32px;

    @media (min-width: 768px) {
      flex-direction: row; /* PC: 横並び */
      justify-content: space-between;
      align-items: flex-start;
    }

    /* ブランド（ロゴ）ブロック */
    .footer-brand {
      max-width: 280px;

      @media (min-width: 768px) {
        flex: 1.2;
        max-width: 260px;
      }

      .footer-logo {
        width: 140px;
        height: auto;
        display: block;
      }

      .brand-desc {
        font-size: 12px;
        color: var(--color-text);
        margin-top: 8px;
      }
    }

    /* ナビゲーション列ブロック */
    .footer-item {
      @media (min-width: 768px) {
        flex: 1;
        max-width: 220px;
      }

      .nav-title {
        font-size: 12px;
        color: var(--color-text);
        margin-bottom: 12px;
        border-bottom: 0.5px solid var(--color-border);
        padding-bottom: 4px;
      }

      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap:wrap ;
        gap: 10px;

        @media (min-width: 768px) {
          flex-direction: column;
          gap: 8px;
        }

        .nav-link {
          color: var(--color-text);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s ease;

          &:hover {
            color: var(--color-accent);
          }
        }
      }
    }
  }

  /* ----------------------------------
     2. フッター下部（コピーライト）
  ---------------------------------- */
  .footer-bottom {
    margin-top: 40px;
    padding-top: 20px;
    text-align: center;

    .copyright {
      font-size: 0.75rem;
      color: var(--color-text);
    }
  }
}
</style>
