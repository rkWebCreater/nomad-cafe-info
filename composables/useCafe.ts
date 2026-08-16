import featureMaster from '../data/features.json'

// ==========================================
// 1. 型定義（Interface）を作成して any を排除
// ==========================================
// features.json から特徴キー一覧（"power" | "wifi" | "morning" ...）を自動生成
export type FeatureKey = keyof typeof featureMaster

export interface CafeFeature {
  available: boolean
  [key: string]: any
}

export interface Cafe {
  id?: string | number
  name: string
  address?: string
  area?: string
  areaNameJa?: string
  businessHours?: string
  features?: {
    [K in FeatureKey]?: CafeFeature
  } & {
    [key: string]: CafeFeature | undefined
  }
}


export interface SearchApiResponse {
  success: boolean
  message?: string
  results: Cafe[]
  conditions?: any
  isFallback?: boolean
}

// ==========================================
// 2. Composable 本体の実装
// ==========================================
export const useCafe = (allCafesData: Ref<Cafe[]> = ref([])) => {
  // ① Nuxtのルーターを取得（URLのクエリを見るために必要）
  const route = useRoute()

  // ② リアクティブな状態（State）の定義 データの一時保存
  const isLoading = ref(false)
  const noticeMessage = ref('')
  const aiConditions = ref<any>(null)
  const searchResults = ref<Cafe[]>([])

  // ③ URLのクエリパラメータを監視・取得するための算出プロパティ
  const searchKeyword = computed(() => String(route.query.keyword || ''))
  const searchArea = computed(() => String(route.query.area || ''))
  const searchTag = computed(() => String(route.query.tag || ''))

  // 入力チェック用（キーワードが空じゃないか判定）
  const isValidInput = computed(() => searchKeyword.value.trim().length > 0)

  //-------- 営業中かどうかの判定
  const checkIfOpen = (businessHours: string): boolean => {
    const now = new Date()
    const currentHours = String(now.getHours()).padStart(2, '0')
    const currentMinutes = String(now.getMinutes()).padStart(2, '0')
    const nowTimeNum = Number(currentHours + currentMinutes)

    const cleanHours = businessHours.replace(/\s+/g, '')
    const times = cleanHours.split('-')
    if (times.length !== 2) return false

    const openStr = times[0]
    const closeStr = times[1]

    if (!openStr || !closeStr) return false

    const openTimeNum = Number(openStr.replace(':', ''))
    const closeTimeNum = Number(closeStr.replace(':', ''))

    if (closeTimeNum < openTimeNum) {
      return nowTimeNum >= openTimeNum || nowTimeNum <= closeTimeNum
    } else {
      return nowTimeNum >= openTimeNum && nowTimeNum <= closeTimeNum
    }
  }

  // features.json から検索用キーワードリストを全自動生成（二度と手動更新不要！）
  const FEATURE_KEYWORDS: Record<string, string[]> = Object.fromEntries(
    Object.entries(featureMaster).map(([key, item]) => [key, item.keywords])
  )


  /**
   * ローカル検索・エリア絞り込み・タグ絞り込みを実行するメイン関数
   * 
   * @param allCafes 全カフェのデータ配列
   * @param options 検索条件（keyword: キーワード, area: エリア, tag: タグ）
   * @returns 絞り込まれたカフェの配列
   */
  const localSearch = (
    allCafes: Cafe[],
    options: { keyword?: string; area?: string; tag?: string } = {}
  ): Cafe[] => {
    const rawKeyword = (options.keyword || '').trim().toLowerCase()
    const area = (options.area || '').trim()
    const tag = (options.tag || '').trim()

    // キーワード文字列をスペース区切りで配列化  rawKeyword ? ... : [] （三項演算子） rawKeywordに文字が入っていたら後半の処理を実行　空なら空の配列[]を返す
    // .split(/\s+/) : 1つ以上の半角/全角スペースで分割
    // .filter(Boolean) : 空文字 ("") を除外
    const keywords: string[] = rawKeyword? rawKeyword.replace(/ /g, ' ').split(/\s+/).filter(Boolean): [] 
    /*.filter(Boolean) （空文字の除去）
    意味: 分割した結果、紛れ込んでしまった空文字（""）を除外します。
    JavaScript では Boolean("") は false になるため、.filter(Boolean) と書くだけで空要素がキレイに消えます。*/ 

    if (keywords.length === 0 && !area && !tag) return allCafes

    return allCafes.filter((cafe) => {
      // --- 条件 A: キーワード（複数単語AND検索 ＆ 電源/Wi-Fi判定） ---
      // .every() : 指定したキーワードすべてにヒットする場合のみ true
      const matchKeyword = keywords.every((kw) => {

        // 1. 店舗情報テキスト（店名、住所、エリア名など）に含まれているか
        // .some() : 配列内のいずれか1つでも条件を満たせば true
        const inText = [cafe.name, cafe.address, cafe.area, cafe.areaNameJa].some((field) => field?.toLowerCase().includes(kw))
       
        // 2. 設備キーワード（電源、Wi-Fi、モーニングなど）に一致し、かつ店舗で利用可能か
        // Object.entries() : オブジェクトを [キー, 値] の配列に変換
        const inFeature = Object.entries(FEATURE_KEYWORDS).some(
          ([featureKey , kwList]) =>
            // 入力されたkwがリストに含まれているか (.includes)  かつ、そのカフェで該当機能が利用可能か (Booleanで安全にboolean値化)
            kwList.includes(kw) && Boolean(cafe.features?.[featureKey]?.available)
        ) 

        return inText || inFeature
      })

      // --- 条件 B: エリア一致確認 ---
      const matchArea = !area || cafe.area === area

      // --- 条件 C: タグ一致確認 ---
      // タグが未指定(!tag)、または該当タグのavailableがtrueの場合に true
      const matchTag = !tag || Boolean(cafe.features?.[tag]?.available)

      return matchKeyword && matchArea && matchTag
    })
  }

  // ④ ローカル検索の自動算出プロパティ (filteredCafes)
  const filteredCafes = computed<Cafe[]>(() => {
    return localSearch(allCafesData.value, {
      keyword: searchKeyword.value,
      area: searchArea.value,
      tag: searchTag.value
    })
  })

  //-------- API 検索関数（名称は fetchSearchResults のまま）
  const fetchSearchResults = async (keyword: string) => {
    if (!import.meta.client) return
    if (!keyword || !keyword.trim() || isLoading.value) return

    isLoading.value = true
    noticeMessage.value = ''
    aiConditions.value = null
    searchResults.value = []

    try {
      const data = await $fetch<SearchApiResponse>(`/api/search?text=${encodeURIComponent(keyword.trim())}`)

      if (!data.success) {
        throw new Error(data.message || 'APIの処理に失敗しました')
      }

      if (data.results.length === 0) {
        searchResults.value = filteredCafes.value || []

        if (searchResults.value.length > 0) {
          noticeMessage.value =
            'AI検索で一致しなかったため、通常のキーワード検索結果を表示しています。'
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
      noticeMessage.value =
        '⚠️ AIの利用制限に達したため、通常のキーワード検索結果を表示しています。'
      searchResults.value = filteredCafes.value || []
    } finally {
      isLoading.value = false
    }
  }

  // watch URLクエリ監視 自動実行スクロール
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

      await nextTick()
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
    checkIfOpen,
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