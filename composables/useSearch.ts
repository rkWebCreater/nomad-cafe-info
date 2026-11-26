import {allCafesData} from './useCafe'
import featureMaster from '@/data/features.json'
import {type CafeType, type FeatureKey } from '@/schemas/cafe'
import {type SearchOptions, type SearchApiResponse } from '@/schemas/search'

// ==========================================
// 2. カフェ検索用のカスタムコンポーザブル（useSearch）
// ==========================================
export const useSearch = () => {
  // ① Nuxtのルーターを取得（URLのクエリを見るために必要）
  const route = useRoute()

  // ② リアクティブな状態（State）の定義 データの一時保存
  const isLoading = ref(false)
  const noticeMessage = ref('')
  const aiConditions = ref<unknown | null>(null)
  const searchResults = ref<CafeType[]>([])

  // ③ URLのクエリパラメータを監視・取得するための算出プロパティ
  const searchKeyword = computed(() => String(route.query.keyword || ''))
  const searchArea = computed(() => String(route.query.area || ''))
  const searchTag = computed<string[]>(() => {
                    const value = route.query.tag
                    const values = Array.isArray(value) ? value : [value]

                    return values.filter((tag): tag is string => typeof tag === 'string')
                                 .flatMap(tag => tag.split(',')
                                 .map(tag => tag.trim())
                                 .filter(Boolean)) // カンマ区切りのタグを分割して配列化
                    })

  // 入力チェック用（キーワードが空じゃないか判定）
  const isValidInput = computed(() => searchKeyword.value.trim().length > 0)

  /*
   * ローカル検索・エリア絞り込み・タグ絞り込みを実行するメイン関数
   * 
   * @param allCafes 全カフェのデータ配列
   * @param options 検索条件（keyword: キーワード, area: エリア, tag: タグ）
   * @returns 絞り込まれたカフェの配列
   */
  const FEATURE_KEYWORDS = featureMaster // features.json の内容を使って、設備ごとのキーワードを定義
  const localSearch = (
    allCafes: CafeType[],
    options: SearchOptions = {}
  ): CafeType[] => {
    const rawKeyword = (options.keyword || '').trim().toLowerCase()
    const area = (options.area || '').trim()
    const tags = (Array.isArray(options.tag) ? options.tag : [options.tag || ''])
                .map(tag => tag.trim())
                .filter(Boolean)

    // キーワード文字列をスペース区切りで配列化  rawKeyword ? ... : [] （三項演算子） rawKeywordに文字が入っていたら後半の処理を実行　空なら空の配列[]を返す
    // .split(/\s+/) : 1つ以上の半角/全角スペースで分割
    // .filter(Boolean) : 空文字 ("") を除外　JavaScript では Boolean("") は false になるため、.filter(Boolean) と書くだけで空要素がキレイに消えます。
    const keywords: string[] = rawKeyword? rawKeyword.replace(/ /g, ' ').split(/\s+/).filter(Boolean): [] 

    if (keywords.length === 0 && !area && !tags.length) return allCafes

    return allCafes.filter((cafe) => {
      // --- 条件 A: キーワード（複数単語AND検索 ＆ 電源/Wi-Fi判定） ---
      // .every() : 指定したキーワードすべてにヒットする場合のみ true
      const matchKeyword = keywords.every((kw) => {

        // 1. 店舗情報テキスト（店名、住所、エリア名など）に含まれている　　.some() : 配列内のいずれか1つでも条件を満たせば true
        const inText = [
          cafe.name, 
          cafe.address, 
          cafe.area, 
          cafe.areaNameJa
        ].some((field) => field?.toLowerCase().includes(kw))
       
        // 2. 設備キーワード（電源、Wi-Fi、モーニングなど）に一致し、かつ店舗で利用可能か
        const inFeature = (Object.keys(FEATURE_KEYWORDS) as FeatureKey[])
        .some((featureKey) => FEATURE_KEYWORDS[featureKey].keywords.includes(kw) && cafe.features[featureKey]?.available === true) 

        return inText || inFeature
      })

      // --- 条件 B: エリア一致確認 ---
      const matchArea = !area || cafe.area === area

      // --- 条件 C: タグ一致確認 ---
      // タグが未指定(!tag)、または該当タグのavailableがtrueの場合に true
      const matchTag = tags.length === 0 || tags.every(tag => cafe.features[tag as FeatureKey]?.available === true)

      return matchKeyword && matchArea && matchTag
    })
  }

  // ④ ローカル検索の結果を算出プロパティとして返す
  const filteredCafes = computed<CafeType[]>(() => {
    return localSearch(allCafesData.value, {

      keyword: searchKeyword.value,
      area: searchArea.value,
      tag: searchTag.value
    
    })
  })

  //-------- API 検索関数
  const fetchSearchResults = async (keyword: string) => {

    if (!import.meta.client) return // サーバーサイドでは実行しない
    if (!keyword || !keyword.trim() || isLoading.value) return // キーワードが空、またはすでに検索中の場合は何もしない

    isLoading.value = true 
    noticeMessage.value = ''
    aiConditions.value = null 
    searchResults.value = []  

    try { 
      // ① AI検索APIにリクエストを送信
      const data = await $fetch<SearchApiResponse>(`/api/search?text=${encodeURIComponent(keyword.trim())}`) 

      if (!data.success) {
        throw new Error(data.message || 'APIの処理に失敗しました')
      }

      // ② AI検索APIのレスポンスを受け取り、条件に基づいてカフェを絞り込む
      // ここで、AIが返した条件（data.conditions）を使って、filteredCafes.value を再度絞り込むことも可能
      // 例: data.conditions に基づいて filteredCafes.value をフィルタリングする処理を追加
      if (data.results.length === 0) {

        searchResults.value = filteredCafes.value || []

        if (searchResults.value.length > 0) {
          noticeMessage.value = 'AI検索で一致しなかったため、通常のキーワード検索結果を表示しています。'
        }
      } else {
        searchResults.value = data.results || []
        aiConditions.value = data.conditions || null

        if (data.isFallback && data.message) {
          noticeMessage.value = data.message
        }
      }
    } catch (error) {

      console.error('Search request error:', error)
      noticeMessage.value = '⚠️ AI検索を利用できないため、通常のキーワード検索結果を表示しています。'
      searchResults.value = filteredCafes.value || []

    } finally {
      isLoading.value = false
    }
  }

  // ⑤ URLのクエリパラメータが変化したら自動で検索を実行するウォッチャー
  watch(
    [() => route.query.keyword, () => route.query.area, () => route.query.tag],
    async ([newKeyword]) => {
      
      const keywordStr = String(newKeyword || '').trim()
      const localResults = filteredCafes.value

      aiConditions.value = null
      noticeMessage.value = ''

      // ① ローカル検索で1件以上ある、またはキーワードが空の場合
      if ((localResults && localResults.length > 0) || !keywordStr) {
        searchResults.value = localResults
      }
      // ② ローカル検索で0件かつキーワード入力がある場合
      else {
        await fetchSearchResults(keywordStr)
      }

      await nextTick()//nextTickを使うことで、DOMの更新が完了するまで待機してからスクロール処理を実行することができます。これにより、検索結果が表示される前にスクロールが発生することを防ぎます。
      if (import.meta.client) {
        const headerEl = document.getElementById('search-header')
        if (headerEl) {
          headerEl.scrollIntoView({ behavior: 'smooth' })
        }
      }

    },
    { immediate: true }
  )

  // Vueファイル側で使いたい変数・関数をすべて返す
  return {
    
    localSearch,
    searchKeyword,
    searchArea,
    searchTag,
    isValidInput,
    isLoading,
    noticeMessage,
    aiConditions,
    searchResults,
    filteredCafes,
    fetchSearchResults
  }
}