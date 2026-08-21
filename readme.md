# ☕️ 深夜・通常営業カフェ検索＆閲覧アプリケーション

ノマドワーカー・在宅ワーカー向けに、**現在営業中・深夜営業のカフェを検索・閲覧できるWebアプリケーション**をNuxt 4 / Vue 3 / TypeScriptで開発しました。

営業時間をもとにした営業状態の自動判定、動的な詳細ページ、AI検索、静的サイトへのデプロイまで、フロントエンドだけでなく**SSR / SSG・API・データ設計・CI/CDを含めた開発**を行っています。

## 🛠 技術スタック

- **Frontend:** Nuxt 4 / Vue 3 / TypeScript
- **CSS:** Tailwind CSS
- **UI:** Swiper v11（swiper/vue）
- **Data:** JSONローカルデータ
- **API:** Nuxt Server API / Gemini API
- **Rendering:** SSR / SSG
- **Deployment:** GitHub Pages / GitHub Actions
- **State / Data Fetching:** `ref` / `computed` / `useRoute` / `useAsyncData`
- **Language:** TypeScript

---

## 💡 技術的にこだわったポイント

### 1. Nuxt 4 × Swiperのライフサイクル問題を解決

当初はWeb Components版の`<swiper-container>`を使用していましたが、Nuxt 4のページ遷移とSSR環境における初期化タイミングの違いにより、画面遷移後にSwiperがフリーズし、スライドが正常に機能しない問題が発生しました。

そこで`swiper/vue`へ移行し、Vueコンポーネントとしてライフサイクルを管理。

さらに、

- Vueの`:key`によるコンポーネント再生成
- `:deep(.swiper-wrapper)`によるScoped CSSの詳細度制御
- NuxtのSSR環境を考慮した初期化

を組み合わせ、**ページ遷移後も再読み込みなしでSwiperが正常動作するUI**を実現しました。

---

### 2. リアクティブな詳細ページと動的データ連携

カフェ詳細ページではURLのIDを`useRoute`と`computed`でリアクティブに取得。

さらに`useAsyncData`の`watch`を利用し、ページ下部のおすすめカフェをクリックした際にも、**ページ全体をリロードせず詳細情報だけをリアクティブに切り替える設計**にしています。

また、おすすめカフェ一覧では現在表示中のカフェを`.filter()`で除外し、同一店舗が重複表示されないようにしています。

共通処理はPropsを利用してコンポーネント化し、再利用性も考慮しています。

---

### 3. 営業時間から「現在営業中」を自動判定

JSONに保持した営業時間データをもとに、現在時刻と営業時間を比較して営業状態を自動判定するロジックを実装。

通常営業時間だけでなく、**日付をまたぐ深夜営業にも対応できるデータ構造**を採用し、検索結果や詳細ページで現在の営業状態を動的に表示できるようにしています。

---

### 4. Gemini APIを利用したAI検索とフォールバック設計

検索バーにはGemini APIを利用した自然言語検索を実装。

例えば「WiFiがあって電源も使える深夜営業のカフェ」のような条件をAI側で解析し、設備条件などを構造化して検索できる仕組みを設計しました。

ただし、AI検索に依存するとAPI障害や環境変数未設定時にアプリケーション全体が停止する可能性があります。
そのため、
```text
AI検索
  ↓
try / catch
  ↓
API失敗
  ↓
通常のキーワード検索へフォールバック
というFail Safe設計を採用。
searchResults.value = filteredCafes.value || []のような防御的な実装も行い、API通信に失敗してもUIがクラッシュしない構成にしています。

## 5. SSG環境におけるGemini APIとNitro Prerenderの問題を解決

GitHub PagesへのSSGデプロイ時、Nuxt / NitroのPrerender処理が`/search`関連ページをクロールし、ビルド時にAPI処理が実行される問題が発生しました。

GitHub Actionsにはセキュリティ上`.env`をアップロードしていないため、ビルド環境にはGemini APIキーが存在せず、API処理が`500 Server Error`となっていました。

そこで`nitro.prerender.ignore`を利用し、検索ページをPrerender対象から除外しました。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      // ビルド時に検索ページをPrerender対象から除外
      ignore: [
        '/search',
        '/Search',
        '/nomad-cafe-info/search',
        '/nomad-cafe-info/Search'
      ]
    }
  }
})

* 防御的プログラミングを徹底し、API層でエラーが発生してもUIがクラッシュせず、通常のローカル検索結果を提供し続ける安全な運用を実現しました。

### 5. SSG環境における Gemini API と Nitro Prerender の競合解決
* **課題**: GitHub PagesへのSSG（静的生成）デプロイ時、Nuxt / Nitro の Prerender 処理が `/search` 関連ページを自動クロールし、ビルド（Node.js環境）時にAPI通信を行おうとしました。しかし、セキュリティ上 GitHub Actions のビルド環境には `.env`（APIキー）を入れていないため、Prerender 段階で `500 Server Error` となりビルドが失敗していました。
* **解決策**:
* `nuxt.config.ts` の `nitro.prerender.ignore` に動的検索ルートを追加し、事前レンダリング対象から除外。
* `search.vue` 内で `import.meta.client` によるクライアント実行判定を実装。
* **「ビルド時に静的化する処理」** と **「ブラウザ上で動的に実行する処理」** の関心事を明確に分離することで、APIキーを漏洩させることなくSSGビルドを正常完了させました。

---

## 🚀 GitHub Actions / GitHub Pages への CI/CD・SSGデプロイ

GitHub Actions を構築し、メインブランチへのプッシュ時に自動でビルド＆デプロイされるパイプラインを確立しました。開発過程で発生したインフラ・環境固有の問題を以下のように解決しています。

| 発生した問題・エラー | 原因 | 解決策 |
| :--- | :--- | :--- |
| **Artifacts が生成されない** | アクションのバージョン古化と出力パス設定ミス | `actions/upload-pages-artifact@v3` へ更新し、Nuxtの生成物 `.output/public` を明示的に指定 |
| **依存関係インストール失敗** | ロックファイルの不整合・リポジトリ欠落 | `package-lock.json` をリポジトリ管理下に追加し、`npm ci` による再現性のあるビルドを確立 |
| **画像・アセットの 404 エラー** | GitHub Pages のサブディレクトリ仕様（`/nomad-cafe-info/`）および Linux ケースセンシティブ | ベースパスに合わせた相対パス補正と、ファイル名の大文字・小文字の完全一致対応 |
| **Prerender 時の 500 Error** | 追加したJSONデータの配列構造ネストミス | 二重配列構造をフラットな単一オブジェクト配列にデータ整形し、`undefined` 参照を解消 |

---

## 🔧 設備検索データの自動型定義 ＆ プロンプト一元管理

カフェの設備仕様（Wi-Fi、電源、ランチ、深夜営業など）は `FeatureKey` として一元管理しています。

* **シングルソース・オブ・トゥルース（Single Source of Truth）**:
1. `server/api/search.ts` における Gemini API 向けシステムプロンプト
2. AIレスポンスバリデーション用 JSON Schema
3. `useCafe.ts` における通常フォールバック検索キーワード
4. TypeScript の `FeatureKey` 型定義

設備キーを追加・変更するだけで、上記 4 箇所の型・プロンプト・判定ロジックが連動して更新される設計を採用。ハードコードを排除し、保守性と型安全性を大幅に向上させました。

---

## 📌 実装・開発を通じてアピールできるポイント

本プロジェクトでは、単なる画面デザインやCRUD操作の域を超え、Webアプリケーション全体のライフサイクルを見据えた開発を遂行しました。

* **フロントエンド・フレームワーク** : Nuxt 4 / Vue 3 Composition API による高品質なUI構築
* **型安全性と保守性** : TypeScript による厳密な型定義とデータドリブンな一元管理
* **アーキテクチャの理解** : SSR / SSG のレンダリング挙動の違いに応じた Nitro Prerender の制御
* **API連携と堅牢性** : Nuxt Server API + Gemini API の活用、および障害に強い Fail-Safe（フォールバック）設計
* **リアクティブ思考** : `useAsyncData` + `watch` / `computed` を駆使した画面遷移のないシームレスなUX
* **ライブラリ・ライフサイクル制御** : Nuxt 4 と Swiper のSSR/クライアントギャップの克服
* **DevOps / CI/CD** : GitHub Actions による静的サイト自動生成および GitHub Pages への堅牢なデプロイパイプライン

各技術の特性と動作用域（サーバー/クライアント/ビルド時）を正しく理解し、実際に発生した課題の原因を突き止めて解決に導く実践力を身につけています。
"""
