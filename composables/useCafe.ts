

export const useCafe = (allCafesData: Ref<any[]> = ref([])) => {
  // ① Nuxtのルーターを取得（URLのクエリを見るために必要）
  const route = useRoute()

  // ② リアクティブな状態（State）の定義 データの一時保存
  const isLoading = ref(false)
  const noticeMessage = ref('')
  const aiConditions = ref<any>(null)
  const searchResults = ref<any[]>([])

  // ③ URLのクエリパラメータを監視・取得するための算出プロパティ
  const searchKeyword = computed(() => String(route.query.keyword || ''))
  const searchArea = computed(() => String(route.query.area || ''))
  const searchTag = computed(() => String(route.query.tag || ''))

  // 入力チェック用（キーワードが空じゃないか判定）
  const isValidInput = computed(() => searchKeyword.value.trim().length > 0)

  //-------- 営業中かどうかの判定
  const checkIfOpen = (businessHours: string): boolean => {
    const now = new Date(); //今の日付
    const currentHours = String(now.getHours()).padStart(2,'0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const nowTimeNum = Number(currentHours + currentMinutes);
    
    // 空白や全角スペースのブレを完全に消去してからハイフンで分割します
    const cleanHours = businessHours.replace(/\s+/g, '')
    const times = cleanHours.split('-')
    if (times.length !== 2) return false
    
    const openStr = times[0]
    const closeStr = times[1]
    
    if (!openStr || !closeStr) return false

    // コロンを消して純粋な数値に変換（例: "08:00" ➔ 800）
    const openTimeNum = Number(openStr.replace(':', ''))
    const closeTimeNum = Number(closeStr.replace(':', ''))

    if(closeTimeNum < openTimeNum){
      // 終了時間が開店時間より小さい＝深夜営業の店の場合
      return nowTimeNum >= openTimeNum || nowTimeNum <= closeTimeNum
    } else {
      // 終了時間が開店時間より大きい＝通常営業の店の場合
      return nowTimeNum >= openTimeNum && nowTimeNum <= closeTimeNum
    }
  }
  //-------- ここまで営業中かどうかの判定


  //-------- ローカル検索・エリア、タグ絞り込みロジック
  const localSearch = (allCafes: any[] , options :{keyword?:string; area?:string; tag?:string;} ={} ) =>{
    const rawKeyword = (options.keyword || '').trim().toLowerCase()
    const area = (options.area || '').trim()
    const tag = (options.tag || '').trim()

    // 全角スペース（ ）も半角スペースに統一してAND検索用の配列にする
    const keywords: string[] = rawKeyword
    ? rawKeyword.replace(/ /g, ' ').split(/\s+/).filter(Boolean)
    : []
    
    // 検索条件がすべて空なら全件をそのまま返す
    if(keywords.length === 0 && !area && !tag){
      return allCafes
    }

    // 絞り込み検索
    return allCafes.filter(cafe =>{
      // --- 条件 A: キーワード（複数単語AND検索 ＆ 電源/Wi-Fi判定） ---
      const matchKeyword = keywords.every(kw =>{
        const inText = cafe.name?.toLowerCase().includes(kw) ||
                       cafe.address?.toLowerCase().includes(kw) ||
                       cafe.area?.toLowerCase().includes(kw) ||
                       cafe.areaNameJa?.toLowerCase().includes(kw) 
        
        const isPowerKw = ['電源', '電源あり', 'コンセント', 'コンセントあり', 'power'].includes(kw)
        const inPower = isPowerKw && Boolean(cafe.features?.power?.available)

        const isWifiKw = ['wifi', 'wifiあり', 'wi-fi', 'わいふぁい', 'わいふぁいあり', 'ワイファイ', 'ワイファイあり'].includes(kw)
        const inWifi = isWifiKw && Boolean(cafe.features?.wifi?.available)

        return inText || inPower || inWifi
      })

      // --- 条件 B: エリア一致確認 ---
      const matchArea = !area || cafe.area === area

      // --- 条件 C: タグ一致確認 ---
      const matchTag = !tag || cafe.features?.[tag]?.available === true

      // すべての条件（キーワード AND エリア AND タグ）をクリアしたデータだけを残す
      return matchKeyword && matchArea && matchTag
    })
  }
  //-------- ローカル検索・エリア、タグ絞り込みロジック　ここまで


  // ④ ローカル検索の自動算出プロパティ (filteredCafes) を追加
  // これがないと API検索で一致しなかった時に通常の検索結果を表示できません
  const filteredCafes = computed(() => {
    return localSearch(allCafesData.value, {
      keyword: searchKeyword.value,
      area: searchArea.value,
      tag: searchTag.value
    })
  })


  //-------- gemini api 導入
  const fetchSearchResults = async (keyword: string) => {
    // SSR (サーバーサイドレンダリング)側の実行を防ぐ 空文字やローディング中なら中断
    if (!import.meta.client) return
    if (!keyword || !keyword.trim() || isLoading.value) return

    isLoading.value = true
    noticeMessage.value = ''
    aiConditions.value = null
    searchResults.value = [] // 検索前に結果を一旦リセット

    try {
      // APIレスポンスに any 型をつけてTSエラーを防ぐ
      const data: any = await $fetch(`/api/search?text=${encodeURIComponent(keyword.trim())}`)

      // ガード節 API側で失敗した場合は強制的にエラー（catchへジャンプ）
      if (!data.success) {
        throw new Error(data.message || 'APIの処理に失敗しました')
      }

      // data.results に修正 (sをつける)
      if (data.results.length === 0) {
        searchResults.value = filteredCafes.value || []

        // searchResults.value に修正
        if (searchResults.value.length > 0) {
          noticeMessage.value = 'AI検索で一致しなかったため、通常のキーワード検索結果を表示しています。'
        }
      } else {
        // ヒットした場合 結果と検索条件を保存
        searchResults.value = data.results || []
        aiConditions.value = data.conditions || null

        // バックエンドから制限警告（フォールバック）が届いていればメッセージを表示
        if (data.isFallback && data.message) {
          noticeMessage.value = data.message
        }
      }
    } catch (error) {
      console.error('Search request error:', error)
      noticeMessage.value = '⚠️ AIの利用制限に達したため、通常のキーワード検索結果を表示しています。'
      searchResults.value = filteredCafes.value || []
    } finally {
      // 成功・失敗にかかわらずローディング解除
      isLoading.value = false
    }
  }

  // watch URLクエリ監視 自動実行スクロール
  watch(
    [() => route.query.keyword, () => route.query.area, () => route.query.tag],
    async ([newKeyword]) => {
      // URLから取得した値を完全に文字列に変換
      const keywordStr = String(newKeyword || '').trim()

      if (keywordStr) {
        // キーワードがあれば AI 検索を実行
        await fetchSearchResults(keywordStr)
      } else {
        aiConditions.value = null
        noticeMessage.value = ''
        // キーワードがない場合はローカル検索結果をセットする
        searchResults.value = filteredCafes.value
      }

      // DOM更新を待ってからスクロールする処理を追加
      await nextTick()
      if(import.meta.client){
        const headerEl = document.getElementById('search-header')
        if (headerEl) {
          headerEl.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    { immediate: true } // 初回実行フラグを追加
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
    filteredCafes
  }
}