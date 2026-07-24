<script setup>
// 表示したいおすすめカフェの合計枠数（メイン1件 ＋ サブ2件 ＝ 計3件）
const DISPLAY_COUNT = 3

// カフェのデータ（実務では API や microCMS 等から取得）
const recoCafes = ref([
  {
    id: 1,
    name: 'Cafe normand blaren',
    areaName: '渋谷',
    desc: '渋谷ストリーム2Fに位置する開放感あふれる旗艦店。大きな窓から差し込む自然光の中で、ゆったりと作業を進められます。',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    isFeatured: true,    // 👈 手動おすすめフラグ
    featuredOrder: 1     // 👈 表示順の優先度
  },
  {
    id: 2,
    name: 'ROASTERY & WORK',
    areaName: '新宿',
    desc: '静寂なBGMと自家焙煎コーヒーが楽しめるワークスペース。全席コンセント完備。',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    isFeatured: false
  },
  {
    id: 3,
    name: 'GREEN SHADE CAFE',
    areaName: '梅田',
    desc: '緑に囲まれたテラス席が人気のノマドカフェ。Wi-Fiも高速で快適です。',
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,        // 👈 手動指定なしの中で最高評価
    isFeatured: false
  },
  {
    id: 4,
    name: 'SILENT COFFEE',
    areaName: '福岡',
    desc: '集中作業に特化したサイレント仕様のカフェ。深煎りエスプレッソが魅力。',
    imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    isFeatured: false
  }
])

// -------------------------------------------------------------
// 【コアロジック】手動指定優先 ＋ 不足分は高評価店舗で自動補完
// -------------------------------------------------------------
const recommendedCafes = computed(() => {
  // 1. 手動で「おすすめ指定（isFeatured: true）」された店舗を取り出し優先順にソート
  const featured = recoCafes.value
    .filter(item => item.isFeatured)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))

  // 手動指定だけで目標の3件が埋まっていれば、そのまま返す
  if (featured.length >= DISPLAY_COUNT) {
    return featured.slice(0, DISPLAY_COUNT)
  }

  // 2. 重複防止：手動選出されたカフェのIDを「Set」に保存
  const featuredIds = new Set(featured.map(item => item.id))

  // 3. 未選出の店舗から「評価（rating）が高い順」に不足分（3 - 手動数）だけ取得
  const neededCount = DISPLAY_COUNT - featured.length
  const fallback = recoCafes.value
    .filter(item => !featuredIds.has(item.id)) // Setを使って重なりを除外
    .sort((a, b) => b.rating - a.rating)       // 降順ソート
    .slice(0, neededCount)                    // 足りない分だけ切り出し

  // 4. スプレッド構文（...）で「手動指定」＋「高評価補完」を合体！
  return [...featured, ...fallback]
})

// -------------------------------------------------------------
// 【UI用データ切り分け】
// -------------------------------------------------------------
// 先頭1件（インデックス0）を「左側のメイン（featuredCafe）」に割り当て
const featuredCafe = computed(() => recommendedCafes.value[0])

// 2件目と3件目（インデックス1〜2）を「右側のサブ（subCafes）」に割り当て
const subCafes = computed(() => recommendedCafes.value.slice(1, 3))
</script>

<template>
  <section class="new-cafes-section">
    <div class="section-container">
      <h2 class="section-title" id="new-reco-cafe">新着おすすめカフェ</h2>

      <div class="cafe-grid">
        <!-- 左側：メインカード（縦長に空間を見せる） -->
        <div 
          v-if="featuredCafe" 
          :to="`/cafes/${featuredCafe.id}`" 
          class="cafe-card main-card"
        >
          <img :src="featuredCafe.imageUrl" :alt="featuredCafe.name" class="card-image" />
          <div class="card-overlay">
            <span class="area-badge">{{ featuredCafe.areaName }}</span>
            <h3 class="cafe-name">{{ featuredCafe.name }}</h3>
            <p class="cafe-desc">{{ featuredCafe.desc }}</p>
          </div>
        </div>

        <!-- 右側：サブカード群（文字量を抑えて写真の印象をキープ） -->
        <div class="sub-cards-group">
          <div
            v-for="cafe in subCafes" 
            :key="cafe.id" 
            :to="`/cafes/${cafe.id}`" 
            class="cafe-card sub-card"
          >
            <img :src="cafe.imageUrl" :alt="cafe.name" class="card-image" />
            <div class="card-overlay">
              <span class="area-badge">{{ cafe.areaName }}</span>
              <h3 class="cafe-name">{{ cafe.name }}</h3>
              <p class="cafe-desc">{{ cafe.desc }}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 全体の温かみのある背景トーン */
.new-cafes-section {
  background: rgb(253, 251, 247);
  padding: 60px 20px;

  & .section-container {
    max-width: 1100px;
    margin: 0 auto;

    & .section-title {
      text-align: center;
      font-size: 18px;
      color: #785842;
      margin-bottom: 32px;
      font-weight: 500;
      letter-spacing: 0.05em;

      @media (min-width:768px){
        font-size:25px;
      }
    }

    /* グリッドレイアウト構造 */
    .cafe-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;

      /* レスポンシブ（PC表示）も中にネスト */
      @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }

      .sub-cards-group {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
    }
  }
}

/* カード共通スタイル */
.cafe-card {
  position: relative;
  display: block;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  /* ホバー処理と画像拡大のアニメーション */
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);

    .card-image {
      transform: scale(1.03);
    }
  }

  /* 背景画像 */
  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  /* オーバーレイ領域 */
  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgb(81 43 11 / 61%) 0%, rgb(149 114 80 / 15%) 50%, #fff1e52e 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    color: #ffffff;

    .area-badge {
      display: inline-block;
      align-self: flex-start;
      font-size: 0.75rem;
      color: rgb(255, 246, 212);
      background: rgba(223, 162, 116, 0.3);
      backdrop-filter: blur(4px);
      padding: 3px 10px;
      border-radius: 20px;
      margin-bottom: 8px;
      letter-spacing: 0.05em;
    }

    .cafe-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 6px;
      line-height: 1.3;
    }

    .cafe-desc {
      font-size: 0.825rem;
      color: #e2e8f0;
      line-height: 1.5;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  /* メインカード（左側）の個別スタイル */
  &.main-card {
    height: 380px;

    @media (min-width: 768px) {
      height: 460px;
    }
  }

  /* サブカード（右側）の個別スタイル */
  &.sub-card {
    height: 220px;

    @media (min-width: 768px) {
      height: 218px;
    }

    /* 右側のカードだけタイトルを少し小さく */
    .cafe-name {
      font-size: 1.1rem;
    }
  }
}
/*全部ネストしない3つの理由
1. 詳細度（Specificity）が上がりすぎて設計が崩れやすくなる
CSSを深くネストしすぎると、ブラウザが解析する時の優先度（詳細度）が非常に強くなってしまいます。

全部ネストした場合のコンパイル結果:

.new-cafes-section .section-container .cafe-grid .cafe-card .card-overlay .cafe-name

（階層が深すぎて、後からスタイルを少し上書きしたい時に効かなくなりがちです）

適度に分けた場合:

.cafe-card .card-overlay .cafe-name

（シンプルで後からの変更や管理がしやすい）

2. Vueの <style scoped> がすでにスタイルを保護してくれている
Vue/Nuxt の <style scoped> 機能は、ビルド時に自動でランダムな固有ID（data-v-xxxxxx）を付与してくれます。

そのため、他コンポーネントの .cafe-card にスタイルが漏れて汚染される心配が最初からありません。親の .new-cafes-section で囲わなくても安全性が保たれています。

3. コンポーネント（BEM思考）としての読みやすさ
CSS設計の考え方（BEMなど）では、「大きな枠組み（レイアウト）」 と 「カードなどの独立したパーツ（コンポーネント）」 を分けて記述する方が、コードの構造が一目で分かって保守性が高くなります。

レイアウト関係（全体の余白や並び）: .new-cafes-section 〜 .cafe-grid

パーツ単体の見た目（カードのデザイン）: .cafe-card */
</style>

<!--
Nuxt 3 × カフェサイト設計・実装ガイド（完全版）

1. UI/UX & デザイン（カラー・レイアウト）
空間を感じさせるアスペクト比 : 落ち着いたカフェやWebサイトのトーン（ゆったり・ナチュラル・上品）には、縦長で店舗の雰囲気や天井の照明がしっかり見えるカードデザインが相性抜群。
サイトのトンマナに合わせたブラウン系オーバーレイ : 黒のグラデーションではなく、サイトのテーマカラーに合わせた深みのある茶色〜暖色系グラデーションにすることで、カフェの温もりや木目の世界観を一気に引き立てる。

background: linear-gradient(to top, rgb(81 43 11 / 61%) 0%, rgb(149 114 80 / 15%) 50%, #fff1e52e 100%);

下部 (61%): 深いダークブラウンで白文字の可読性をしっかり確保。
中間 (15%): ミディアムブラウンで写真となじませる。
最上部: ほんのりミルク感のあるウォームホワイトで写真全体に温かいフィルター効果。

テキスト量と視認性 : カード上に文字を載せる際、説明文は -webkit-line-clamp: 2 を使って2行程度に抑え、... で自動省略するのが実務の定番。


2. 実務でのデータ取得基準 & 柔軟なロジック設計
データ取得の主な手段
Headless CMS（microCMS, Contentful等）: クライアントが管理画面から追加・編集（受託開発で最も主流）。
DB / API（Supabase, Firebase等）: ユーザー投稿や評価機能を持つサービス。
Nuxt Content: 静的なMarkdown/JSONで管理。

「手動優先 ＋ 高評価自動補完」のフォールバック設計
「運用者が設定し忘れた」「おすすめ店舗が1件しかない」という事態でも、画面崩れを起こさない安全設計（フォールバック）が重要。

処理フロー:

CMS等の手動おすすめ指定（isFeatured: true）を取得。

指定枠（例: 3件）に満たない場合、手動選出済みの店舗IDを Set に記録。

未選出の店舗から 「評価（rating）が高い順」 に不足分を抽出。

スプレッド構文（...）で結合し、枠数を確実に埋める。

3. JavaScript 重要構文 & テクニック
① 位置指定 [0] vs 条件検索 find()
cafes.value[0]: 配列の先頭（最新）をピンポイントで取得（高速）。

cafes.value.find(cafe => cafe.id === 1): 特定のIDや条件に一致する1件を取得。

② Set（重複を許さない集合）
特徴: 同じ値を保持しない特殊なオブジェクト。

用途: new Set(array) で重複なしリストを作り、featuredIds.has(id) で高速に重複チェック。

③ スプレッド構文 ...
特徴: 配列のカギかっこを外して中身を展開・合体させる。

用途: [...featured, ...fallback] で2つの配列を綺麗に1つのフラットな配列にまとめる。

4. Nuxt 3 開発フロー & コンポーネント構造
反映手順
components/NewCafes.vue にコンポーネントを作成（Nuxt 3 は自動インポートされる）。

pages/index.vue に <NewCafes/> タグを配置。

npm run dev でローカル確認。

Git Push（Vercel等の自動ビルド）または npm run generate（FTPアップロード）。

5. CSSネイティブネスト & 設計手法（BEM思考）
Modern CSS のネスト機能
Nuxt 3（Vite環境）では、Sass等を入れなくても通常の <style scoped> 内でネイティブのネスト（入れ子）記述が可能。

保守性を高める「分割ネスト」ルール
ネストを全部繋げすぎるとCSSの詳細度（優先順位）が上がりすぎて、後からの修正が困難になる。「レイアウト」 と 「パーツ」 に分けて、ネストの深さは 2〜3階層まで に留めるのがプロの現場のベストプラクティス。 -->