<!-- pages/cafes/[id].vue カフェの詳細ページ-->

<template>
  <div class="max-w-5xl mx-auto p-4 md:p-6 text-left">
    
    <!-- クリックしたカフェ一軒の表示部分 -->
    <div v-if="cafe" class="detail-container mb-12">
      
      <!-- 1. 最上部：メイン画像エリア（大きく配置） -->
      <div class="hero-image-wrapper relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-md mb-6 md:mb-8">
        <img :src="cafe.imageUrl" :alt="cafe.name" class="w-full h-full object-cover" />
        <span class="absolute top-4 left-4 bg-amber-100/90 text-amber-900 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
          {{ cafe.areaNameJa }}
        </span>
      </div>

      <!-- 2. 情報カードエリア (SP: 1列 / PC: 左右2列) -->
      <div class="info-card bg-white border border-[#efe8e1] rounded-2xl p-6 md:p-8 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

          <!-- 【左カラム】基本情報 -->
          <div class="info-column ">
            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">店舗名</dt>
              <dd class="text-xl md:text-2xl font-bold text-[#7a583a] ">{{ cafe.name }}</dd>
            </div>
            
            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">📍 住所</dt>
              <dd class="text-sm text-gray-800 leading-relaxed">{{ cafe.address }}</dd>
            </div>
            
            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">🕒 営業時間</dt>
              <dd class="text-sm text-gray-800">{{ cafe.businessHours }}</dd>
            </div>
            
            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">💰 予算</dt>
              <dd class="text-sm text-gray-800">{{ cafe.budget }}</dd>
            </div>
            
            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">💻 HP</dt>
              <dd class="text-sm">
                <a 
                  v-if="cafe.website" 
                  :href="cafe.website" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-[#bc977a] underline hover:text-[#7a583a] transition-colors"
                >
                  公式サイトを開く ↗
                </a>
                <span v-else class="text-gray-400">なし</span>
              </dd>
            </div>
          </div>

          <!-- 【右カラム】作業環境情報 -->
          <div class="info-column  border-t md:border-t-0 md:border-l border-[#f0e6df] pt-6 md:pt-0 md:pl-10">
            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">🪑 席数</dt>
              <dd class="text-sm text-gray-800">{{ cafe.seats || cafe.nomadInfo?.seats || '要確認' }}</dd>
            </div>

            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">🛜 Wi-Fi</dt>
              <dd class="text-sm text-gray-800">
                {{ cafe.nomadInfo?.wifiSpeed || (cafe.features?.wifi?.available ? 'あり' : 'なし') }}
              </dd>
            </div>

            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">🔌 電源（コンセント）</dt>
              <dd class="text-sm text-gray-800">
                {{ cafe.nomadInfo?.powerSupply || (cafe.features?.power?.available ? 'あり' : 'なし') }}
              </dd>
            </div>

            <div class="info-item">
              <dt class="text-xs font-bold text-[#8c7a6b] tracking-wider mb-1">☕️ 雰囲気</dt>
              <dd class="text-sm text-gray-800">{{ cafe.atmosphere || cafe.nomadInfo?.atmosphere || '作業しやすい環境' }}</dd>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- 【他のおすすめカフェセクション】 -->
    <div v-if="othersCafes && othersCafes.length > 0" :key="cafeId" class="cafe-cards-section ml-auto mr-auto mt-12">
      <h2 class="cafe-cards-ttl font-bold text-xl mb-2 text-[#7a583a]">他のおすすめカフェ</h2>
      <p class="canSlide text-gray-400 text-xs mb-4">＜ーー スライドできます ーー＞</p>
      <CafeCards :cafes="othersCafes" :key="cafe.id" />
    </div>

  </div>
</template>

<style scoped>
/* ページ全体の幅・余白制御 */
.cafe-detail-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 16px 60px;
  text-align: left;
}

/* ==============================================
   1. メイン画像エリア
============================================== */
.main-hero {
  position: relative;
  width: 100%;
  height: 260px; /* SPでの画像高さ */
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  @media (min-width: 769px) {
    height: 400px; /* PCでの画像高さ（大きく見せる） */
    margin-bottom: 32px;
  }

  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .area-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(254, 243, 199, 0.95); /* amber-100 */
    color: #78350f; /* amber-900 */
    font-size: 0.75rem;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
  }
}

/* ==============================================
   2. 情報カードエリア（SP: 1列 / PC: 2列）
============================================== */
.info-card {
  background: #ffffff;
  border: 1px solid #efe8e1; /* 元のCSSの温かいベージュトーン */
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 60px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: grid;
  grid-template-columns: 1fr; /* SPは1列 */
  gap: 24px;

  @media (min-width: 769px) {
    
    gap: 40px;
    padding: 36px;
    margin-bottom: 80px;
  }

  .info-column {
    display: flex;
    flex-direction: column;
    gap:15px;

    /* PC表示時に右カラムの左側に縦線を入れる */
    &.border-left {
      border-top: 1px solid #f0e6df;
      padding-top: 24px;

      
    }
  }
  @media (min-width: 769px) {
     .info-column{
         gap:20px;

        .border-left{
            border-top: none;
            border-left: 1px solid #f0e6df;
            padding-top: 0;
            padding-left: 40px;
        }
    }
  }
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 1px;

   @media (min-width:769px){
    gap:4px;

   }

    .label {
      font-size: 0.75rem;
      font-weight: bold;
      color: #8c7a6b;
      letter-spacing: 0.05em;
    }

    .value {
      font-size: 0.95rem;
      color: #333333;
      margin: 0;
      line-height: 1.6;

      &.font-bold {
        font-size: 1.35rem;
        font-weight: bold;
        color: #7a583a;
        font-family: 'YuMincho', '游明朝', serif;
      }

      .link {
        color: #bc977a;
        text-decoration: underline;
        transition: color 0.2s ease;

        &:hover {
          color: #7a583a;
        }
      }

      .text-none {
        color: #9ca3af;
      }
    }
  }
}

/* ==============================================
   3. 他のおすすめカフェセクション
============================================== */
.cafe-cards-section {
  margin-top: 40px;

  @media (min-width: 769px) {
    margin-top: 60px;
  }
}

.cafe-cards-ttl {
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #7a583a;
  margin-bottom: 8px;
}

.canSlide {
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 16px;
}
</style>
<script setup>
// pages/cafes/[id].vue の script setup 部分

/* import { computed, watch } from 'vue'
   import { useRoute } from 'vue-router'  */
import cafeData from '~/cafes.json'

const route = useRoute()
const cafeId = computed(() => route.params.id) //URLの末尾cafe.idの部分を24時間監視してリアルタイムで検知する
const { checkIfOpen } = useCafe()

//---------Nuxt 3において「現在開いている詳細ページのカフェのデータをJSONから探し出し、URL（ID）が切り替わったときも自動でデータを最新に更新する」という、極めてスマートな非同期データ取得（データ一本釣り）の処理
const {data : cafe } = await useAsyncData(
    ()  =>  `cafe-${cafeId.value}`, //データの識別スタンプ
    () => {
        const found = cafeData.find(cafe => cafe.id === cafeId.value)
        return Promise.resolve(found || null)
    },
    {
        watch:[cafeId] //URLが変わったら自動でデータをリフレッシュ（更新）
    }
)//-------------

// 他の営業中のカフェ（今見ている店は除外）
const othersCafes = computed(() => {
  return cafeData.filter(cafe => cafe.id !== cafeId.value && checkIfOpen(cafe.businessHours)=== true)
})
</script>

