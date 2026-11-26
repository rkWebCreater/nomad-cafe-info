import CafesData from '@/server/data/cafes.json'
import { CafesSchema, type CafeType} from '@/schemas/cafe'

// アプリ全体で共有するカフェデータのマスター
const validatedCafes = CafesSchema.parse(CafesData) // cafes.json の内容を Zod で検証し、型安全な Cafe[] に変換
export const allCafesData = ref<CafeType[]>(validatedCafes) // Ref<Cafe[]> として定義することで、Vueのリアクティブ機能を使えるようにする
//JSONはすでに手元にあるので待つ必要がなく await と $fetch は不要ですが、「データが変わったら画面を自動更新する」という Vue のリアクティブ機能を使うためrefは必要。

export const useCafe = () => {
    
  //-------- 営業中かどうかの判定
  const checkIfOpen = (businessHours?: string): boolean => {

  if (!businessHours) return false // 営業時間が空の場合は閉店扱い

  // 現在時刻を取得
  const now = new Date()
  const nowTimeNum = now.getHours() * 100 + now.getMinutes() // 現在時刻を数値化 例：14:30 → 1430

  // 営業時間を開店時間と閉店時間に分ける
  const [openTime, closeTime] = businessHours.replace(/[^0-9-]/g, '')
                                             .split('-').map(Number)

  // まず存在するかチェック
  if (openTime === undefined || closeTime === undefined) {
    return false
  }
  /*   TypeScriptに「ここより下では openTime と closeTime は必ず存在する」と伝えるために、openTime と closeTime は undefined の可能性があるので先にはじく
  isNaN() は number を要求するから */

  // エラーチェック
  if (isNaN(openTime) || isNaN(closeTime)) {
    return false
  }

  // 深夜営業の場合
  // 例：22:00〜02:00
  if (closeTime < openTime) {
    return nowTimeNum >= openTime || nowTimeNum <= closeTime
  }

  // 通常営業の場合
  // 例：10:00〜18:00
  return nowTimeNum >= openTime && nowTimeNum <= closeTime
}
  //-------- ここまで営業中かどうかの判定
 return{
    allCafes: allCafesData, //  全カフェデータ（Ref<Cafe[]>）
    checkIfOpen
 }
}