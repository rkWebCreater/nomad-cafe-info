<template>
  <section class="top-hero">
    <!-- 背景装飾のウォーターマークテキスト -->
    <div class="hero-watermark" aria-hidden="true">
      nomad in life
    </div>

    <div class="hero-container">
      <!-- 左側：非対称 staggered 画像ギャラリーエリア -->
      <div class="hero-gallery">
        <!-- 画像1（メイン：テラス・PC） -->
        <div class="gallery-item main-img">
          <img
            :src="mainImage"
            alt="カフェのテラス席でPC作業する様子"
            loading="eager"
          />
        </div>

        <!-- 画像2（左下：コーヒーカップ） -->
        <div class="gallery-item coffee-img">
          <img
            :src="coffeeImage"
            alt="温かいコーヒーカップ"
            loading="lazy"
          />
        </div>

        <!-- 画像3（右下：カフェ内観） -->
        <div class="gallery-item interior-img">
          <img
            :src="interiorImage"
            alt="落ち着いたカフェの内観"
            loading="lazy"
          />
        </div>

      </div>

      <!-- 右側：テキストエリア -->
      <div class="hero-content">
        <p class="hero-subtext-top">今日の仕事はどこでしよう？</p>
        <p class="hero-subtext-detail">Wi-Fi、電源があるところがいいなぁ</p>
        <h1 class="hero-title">
          <span class="title-line-1">
            <span class="emphasis">集 中</span>
            <span class="normal">できる</span>
          </span>
          <span class="title-line-2">
            <span class="main-heading">環 境 へ</span>
            <span class="sub-script">cafe nomadic</span>
          </span>
        </h1>
        <div class="search-bar w-full max-w-l">
         <SearchBar />
        </div>
      </div>
      
    </div>

  </section>
</template>

<script setup lang="ts">
export interface TopHeroProps {
  /** メイン画像（テラス・PC作業）のURL */
  mainImage?: string
  /** 左下画像（コーヒーカップ）のURL */
  coffeeImage?: string
  /** 右下画像（カフェ内観）のURL */
  interiorImage?: string
}

const props = withDefaults(defineProps<TopHeroProps>(), {
  mainImage: '/nomad-cafe-info/images/slider/cafeNormal2.png',
  coffeeImage: '/nomad-cafe-info/images/slider/cafeNormal3.png',
  interiorImage: '/nomad-cafe-info/images/slider/cafe2.jpg'
})
</script>

<style scoped>

/* ==========================================================================
   コンポーネント全体スタイル（トップページ専用 / スマホファースト）
   ========================================================================== */
.top-hero {
  /* --------------------------------------------------
     1. スマホファースト（デフォルトスタイル: < 768px）
     -------------------------------------------------- */
  position: relative;
  width: 100%;
  min-height: 80vh;
  background-color: #fff1e5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.25rem;
  overflow: hidden;
  box-sizing: border-box;
  color: #3d2c1e;

  /* 背景ウォーターマーク */
  .hero-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-4deg);
    font-family: 'Alex Brush', cursive;
    font-size: clamp(6rem, 16vw, 22rem);
    color: rgba(240, 228, 177, 0.338);
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    z-index: 1;
    letter-spacing: 0.05em;
    text-shadow: 0 0 20px rgba(227, 223, 219, 0.8);
  }

  /* メインコンテナ（スマホでは1カラム縦並び） */
  .hero-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    gap: 2.5rem;
    align-items: center;
    display:flex;
    flex-direction: column-reverse;

  }

  /* 画像ギャラリー（スマホ基本設定） */
    /* 12 x 12 グリッドレイアウト（重ならずに上下互い違い配置） */
  .hero-gallery {
    width: 100%;
    max-width: 400px;
    height:clamp(300px 60vh , 500px);
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
    gap: 0.5rem;
    

    .gallery-item {
      overflow: hidden;
      border-radius: 16px;
      box-shadow: 0 10px 28px rgba(61, 44, 30, 0.07);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* 1. メイン画像：上部に大きく配置（3〜11行目、横いっぱい） */
      &.main-img {
        grid-column: 3 / 11;
        grid-row: 1 / 7;
        animation: moveScale 2s ease-in-out infinite; /* 時間 (3s) を追加 */
      }

      /* 2. 下段左画像：少し上に配置（2〜6行目、左半分） */
      &.coffee-img {
        grid-column: 2/ 6;
        grid-row: 8/ 11;
        animation: moveSide 2s ease-in-out infinite; /* 時間 (3s) を追加 */
      }

      /* 3. 下段右画像：少し下に配置（7〜10行目、右半分・互い違い） */
      &.interior-img {
        grid-column: 7 / 10;
        grid-row: 8 / 12;
        animation: moveUnder 1.5s ease-out infinite; /* 時間 (3s) を追加 */
      }
    }
  }
  /*メイン画像　アニメーション */
  @keyframes moveScale{
    0%{
      scale:1;
    }
    50%{
      scale:0.98;
    }
    100%{
      scale:1;
    }
  }
  /* 右画像　アニメーション */
 @keyframes moveUnder{
  0%{
    transform:translateY(-3px);
  }
  50%{
    transform:translateY(0px);
  }
  100%{
    transform:translateY(-3px);
  }
 }
 /*左画像　アニメーション */
 @keyframes moveSide {
  0% {
    transform: translateX(3px); /*横移動 transform: translateX() に修正 */
  }
  50% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(3px);
  }
}
  @media (min-width: 768px) {
    .hero-gallery {
      max-width: 100%;
      height: 480px;
      gap: 0.75rem;
    }
  }
  /* 右側コンテンツ（スマホ中央揃え） */
  .hero-content {
    display: flex ;
    flex-direction: column ;
    align-items:center;
    width:clamp(300px , 90% , 500px) ; 
    position: relative ;
    top:0;
    right:0;

    .hero-subtext-top {
      font-size: 0.5rem;
      letter-spacing: 0.2em;
      color: #4a382a;
      margin: 0 0 0.4rem 0;
      font-weight: 500;
    }

    .hero-subtext-detail {
      font-size: 0.5rem;
      letter-spacing: 0.15em;
      color: #6e5949;
      margin: 0 0 1.8rem 0;
    }

    .hero-title {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 0;
      line-height: 1.2;

      .title-line-1 {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.6rem;

        .emphasis {
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #2c1d11;
        }

        .normal {
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #2c1d11;
        }
      }

      .title-line-2 {
        position: relative;
        display: inline-block;

        .main-heading {
          font-size: 2.6rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #2c1d11;
        }

        .sub-script {
          position: absolute;
          bottom: -0.7rem;
          left: 30%;
          transform: translateX(-50%);
          font-family: 'Alex Brush', cursive;
          font-size: 0.5rem;
          color: #c4a04d;
          letter-spacing: 0.5em;
          white-space: nowrap;
          pointer-events: none;
        }
      }
    }
    .search-bar{
          width:90%;
          max-width: 500px;
    }
  }

  /* --------------------------------------------------
     2. ブレイクポイント: 768px 以上（タブレット・PC）
     -------------------------------------------------- */
  @media (min-width: 768px) {

    .hero-container {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 3.5rem;
      align-items: center;
    }

    .hero-gallery {
      max-width: 100%;
      min-height: 440px;

      .gallery-item.interior-img {
        margin-top: 1rem;
      }
    }

    .hero-content {
      padding-left: 1rem;

      .hero-subtext-top {
        font-size: 0.8rem;
        letter-spacing: 0.3em;
        margin-bottom: 0.5rem;
        top:-100%;
      }

      .hero-subtext-detail {
        font-size: 0.8rem;
        letter-spacing: 0.3em;
        margin-bottom: 2.5rem;
        top:-70%;
      }

      .hero-title {
        gap: 0.6rem;

        .title-line-1 {
          justify-content: center;
          gap: 0.8rem;

          .emphasis {
            font-size: 2rem;
            letter-spacing: 0.3em;
          }

          .normal {
            font-size: 1.4rem;
            letter-spacing: 0.2em;
          }
        }

        .title-line-2 {
          .main-heading {
            font-size: 3.6rem;
            letter-spacing: 0.25em;
          }

          .sub-script {
            bottom: -0.2rem;
            left: 0;
            letter-spacing: 10px;
            transform: none;
          }
        }
      }
    }
  }
}
</style>