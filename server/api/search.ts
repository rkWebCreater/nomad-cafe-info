//google gemini apiを使って検索バーにgeminiを組み込む
import { GoogleGenAI, Type , ThinkingLevel} from "@google/genai";
import cafeData from "../data/cafes.json"
import featureMaster from "@@/data/features.json"
import { type Cafe , type FeatureKey } from "@/schemas/cafe"
import { z } from "zod"

// features.json から Gemini へのプロンプト文を自動生成 Object.entries()で配列にしてmapを使って値を分ける
// 例: "- 電源 → \"power\"\n- Wifi → \"wifi\"..."
const featureInstructions = Object.entries(featureMaster)
    .map(([key, item]) => `- ${item.name} → "${key}"`)
    .join('\n')

// features.json から Schema の description を自動生成
// 例: "電源なら'power'、Wifiなら'wifi'..."
const featureDescription = Object.entries(featureMaster)
    .map(([key, item]) => `${item.name}なら'${key}'`)
    .join('、') + '。なければ空配列'

const isFeatureKey = (key: string): key is FeatureKey =>
  Object.prototype.hasOwnProperty.call(featureMaster, key)

const hasFeature = (cafe: Cafe, key: string): boolean =>
  isFeatureKey(key) && cafe.features[key]?.available === true

//zodで型チェックするためのスキーマを定義
const SearchConditionsSchema = z.object({
           area: z.string(),
           features: z.array( z.custom<FeatureKey>((value): value is FeatureKey =>
                                                    typeof value === 'string' && isFeatureKey(value)
                                                  )
           ),
           featureLogic: z.enum(["AND", "OR"])
})

export default defineEventHandler(async(event) =>{

    // 1. クエリパラメーターからテキストを取得　フロントエンド（検索バー）から飛んできた ?text=名古屋 電源 というURLのオマケ（クエリ）を受け取り、userText という箱に入れています
    const query = getQuery(event);
    const userText = (query.text as string) || "";
    
    //  ここにログを追加 ターミナルでnpm run devしているときに記録される
    console.log('【API受信】検索キーワード:', userText)

    // 【セキュリティ対策】入力文字数の制限（空文字や長すぎるテキストを弾く）空っぽのまま検索ボタンを押されたり、悪意のある人が1万文字の長文を送ってきてサーバーをパンクさせようとしたりするのを防ぐための「門番」です。条件に合わなければここでエラーを返して処理を終わらせます。
    if(!userText.trim() || userText.length > 20){
        throw createError({
            statusCode : 400 ,
            statusMessage:"検索テキストは1文字以上20文字以内で入力してください",
        })
    }

    //nuxt.config.tsで設定したAPIキーを安全に読み込む　サーバーの奥深くに隠しておいた「秘密の鍵（APIキー）」を取り出して、Geminiとお話しするための準備（初期設定）をしています。
    const config = useRuntimeConfig();
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey});

    // catch の外側でも使えるようにあらかじめ変数を用意しておく
    let fallbackResults: Cafe[] = [];

    // ----------------メインの処理     ユーザーが入力した「名古屋で電源があるカフェ」という文章をGeminiに渡し、{ area: "名古屋", features: ["power"] } という綺麗なデータに変換してもらいます。そして、そのデータをもとにJSONファイル（カフェ一覧）を絞り込んでいます
    try{
        // 1. Geminiに「この条件でJSON形式で返してね」とお願いする
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents:`ユーザーのカフェ検索要望から検索条件を抽出してください。検索できる設備・条件は以下です。
            ${featureInstructions}
            ユーザーの文章に該当する条件があればfeaturesに入れてください。
            該当しない場合は空配列にしてください。
            ユーザー入力: "${userText}"`,

            config:{
                
                responseMimeType:"application/json",
                
                thinkingConfig: {
                        thinkingLevel: ThinkingLevel.MINIMAL,
                },
                responseSchema:{
                    type:Type.OBJECT,
                    properties:{
                        area:{ type:Type.STRING , description: "都市名や駅名（例: 名古屋).抽出できなければ空文字"},
                        features:{
                            type:Type.ARRAY,
                            description: featureDescription, // ← features.json から自動生成
                            items:{type : Type.STRING}
                        },
                        featureLogic: {
                            type: Type.STRING,
                            description: "条件の論理。ユーザーが「か」「または」「どちらか」などと言った場合はOR、「と」「両方」などの場合はAND。指定がなければAND"
                        }
                    },
                    required:["area","features","featureLogic"],
                }
            }

        });

        // 2. Geminiから返ってきたJSONをパースして、条件を取り出す
        const conditions = SearchConditionsSchema.parse(
           JSON.parse(response.text || "{}")
        )

        // 3. カフェの全データを用意
        let filteredCafes = [...cafeData];

       // 4. AIが「エリア」を見つけていたら、エリアで絞り込む
       if(conditions.area){
        filteredCafes = filteredCafes.filter((cafe:Cafe) =>
         cafe.area.includes(conditions.area) ||
         cafe.name.includes(conditions.area) ||
         (cafe.areaNameJa && cafe.areaNameJa.includes(conditions.area))
        )
       }
       // 5. AIが「設備」を見つけていたら、設備で絞り込む
       if(conditions.features && conditions.features.length > 0){

        filteredCafes = filteredCafes.filter((cafe :Cafe) => {  
        if (conditions.featureLogic === "OR") {
            return conditions.features.some((featureKey: string) =>
                hasFeature(cafe, featureKey)
            );
        }else {
            return conditions.features.every((featureKey: string) =>
                hasFeature(cafe, featureKey)
            );
        }
        })
       }
        // 6. 成功結果として、絞り込んだカフェ一覧をフロントエンドに返す
        return {
            success:true ,
            conditions,
            results: filteredCafes
        };

    }
    // ----------------メインの処理 ここまで
    
    //外部のAIに頼りきりだと、AIがダウンしたときにアプリが壊れてしまう　それを防ぐため、「AI通信に失敗したら、とりあえず名前かエリア名が一致するカフェを探して返す」というバックアップ処理を書いています。
    catch(error){
        // エラーの詳細はサーバー側のログにだけ残す
        console.error("Gemini API Error Detail:",error);

        // 【フォールバック処理】AIがダメなら、キーワードごとにカフェ情報や利用可能な設備を検索する
        const keywords = userText.trim().toLowerCase().split(/\s+/).filter(Boolean)
        fallbackResults = cafeData.filter((cafe: Cafe) =>
            keywords.every((keyword) => {
                const inText = [cafe.name, cafe.area, cafe.areaNameJa, cafe.address]
                    .some((field: string | undefined) => field?.toLowerCase().includes(keyword))
                const inFeature = Object.entries(featureMaster).some(([featureKey, feature]) =>
                    feature.keywords.some((featureKeyword) =>
                        featureKeyword.toLowerCase() === keyword
                    ) && hasFeature(cafe, featureKey) === true
                )

                return inText || inFeature
            })
        )

    }
    return {
        success: true ,
        isFallback: true ,
        conditions: null ,
        results: fallbackResults,
        message: "AI解析が混みあっているため、通常のキーワード検索結果を表示しています。"
    }

})
