# Nomad-Cafe-Info

ノマドワーカーや在宅ワーカー向けのカフェ検索サイトです。営業時間、エリア、設備情報を使ってカフェを探し、店舗の詳細を確認できます。カフェ情報はプロジェクト内のJSONファイルで管理しています。

## 主な機能

- トップページで、営業時間から判定した営業中のカフェをスライダー表示
- 渋谷・新宿・梅田・難波・名古屋・福岡のエリア別検索
- 設備タグ（電源、Wi-Fi、モーニング、ランチ、一人席、禁煙、打ち合わせ可）による絞り込み
- 店名、住所、エリア、設備キーワードによるローカル検索
- 店舗詳細ページで住所、営業時間、予算、設備、公式サイトやSNSリンクを表示
- ローカル検索でキーワードに一致しない場合、Gemini APIで自然文からエリア・設備条件を抽出して検索
- AI検索の応答が利用できない場合は、通常のローカル検索結果を表示

トップページの「新着おすすめカフェ」欄は、`components/index/NewCafes.vue` 内に記述した固定サンプルデータを表示します。`server/data/cafes.json` の店舗一覧とは連動していません。

## 使用技術

- Nuxt 4、Vue 3、TypeScript
- Tailwind CSS（Nuxtモジュール経由）
- `@nuxt/image`、`@nuxt/fonts`（Nuxtモジュール）
- Swiper Vue コンポーネント
- Zod（カフェデータと検索条件の検証・型定義）
- Google GenAI SDK（Gemini API）
- Nuxt Server API / Nitro
- JSONによるローカルデータ管理
- Vercel（公開環境）

## 必要な環境

- Node.js `24.x`（`package.json` の指定）
- npm

Vercel側のNode.js設定はプロジェクト設定で管理されるため、このリポジトリからは確認できません。

## セットアップと起動

```sh
npm ci
npm run dev
```

開発サーバーのURLはNuxtが起動時に表示します。


## ビルドとプレビュー

Nuxtアプリケーションをビルドする場合：

```sh
npm run build
npm run preview
```

静的ファイルを生成する場合（Vercelへの現在の公開手順ではありません）：

```sh
npm run generate
```

静的生成物は `.output/public` に出力されます。`package.json` には `lint` と `test` のスクリプトは定義されていません。

## デプロイ

公開環境は Vercel です。`nuxt.config.ts` では `app.baseURL` を `/` に設定し、Vercelのドメイン直下で配信する構成になっています。Gemini検索を使うには、Vercelの環境変数に `GEMINI_API_KEY` を設定してください。


Vercelのビルド設定、公開ブランチ、ドメインはVercel側で管理され、このリポジトリ内からは確認できません。

`.github/workflows/deploy.yml` もリポジトリに残っており、内容は `main` ブランチへのpushで GitHub Pages に静的サイトを公開する設定です。現在の公開先はVercelとのことですが、このワークフローが無効化・未使用かどうかはリポジトリ内から確認できません。Vercelへのデプロイ手順とは別の設定です。

## データと動作上の注意

- カフェ一覧は `server/data/cafes.json` の固定データ50件です。データの外部取得や更新処理はありません。
- おすすめ欄の画像には `images.unsplash.com` の画像URLが使われています。ネットワーク接続や画像提供元の状態により表示が変わる場合があります。
- 店舗情報の出典や更新日はコード内で確認できません。実店舗の現在の営業状況、設備、料金を保証するデータとして扱わないでください。
- 営業中判定はブラウザーの現在時刻と `businessHours` の時刻範囲を比較します。日付をまたぐ営業時間には対応していますが、曜日、祝日、臨時休業、タイムゾーン別の営業時間は扱いません。ブラウザーの時計設定にも依存します。
- `meeting`（打ち合わせ可）は設備マスターにありますが、現在のカフェ一覧には該当設備のデータがありません。検索結果は0件になります。
- `content/readme.md` はリポジトリ内にあるメモです。アプリのソースからの参照は確認できません。
- Vercelの公開URLやプロジェクト設定はリポジトリ内に記載されていません。

## ディレクトリ構成

```text
.
├── app/
│   ├── assets/css/main.css     # 共通スタイル
│   └── router.options.ts       # ルーターのスクロール動作
├── components/
│   ├── cafe/                   # カフェカード、スライダー
│   └── index/                  # トップページの各セクション
├── composables/useCafe.ts      # カフェデータ、営業時間判定、検索処理
├── constants/                  # エリア・タグの表示用定義
├── content/readme.md           # アプリから参照されていないメモ
├── data/features.json          # 設備名、検索語、アイコンの定義
├── layouts/default.vue         # 共通レイアウト
├── pages/
│   ├── index.vue               # トップページ
│   ├── search.vue              # 検索結果
│   └── cafes/[id].vue          # カフェ詳細
├── public/                     # 画像、アイコン、Webアプリマニフェスト
├── schemas/                    # ZodスキーマとTypeScript型
├── server/
│   ├── api/search.ts           # Geminiを使う検索API
│   └── data/cafes.json         # カフェ一覧データ
├── .github/workflows/          # GitHub Pages向け設定（現行公開先ではないとのこと）
├── nuxt.config.ts
├── package.json
└── readme.md                   # プロジェクト説明
```
