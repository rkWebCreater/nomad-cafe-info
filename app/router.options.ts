// RouterConfigの型だけを読み込む（実行時のJavaScriptには含まれない）
import type { RouterConfig } from '@nuxt/schema'

// このファイルをNuxtのルーター設定として出力する
export default <RouterConfig>{
  // ページ遷移時のスクロール位置を決める関数
  scrollBehavior(_to, _from, savedPosition) {
    // savedPositionがあれば、戻る・進む前の位置に戻す
    // なければ、ページの左上（top: 0, left: 0）へ移動する
    return savedPosition ?? { top: 0, left: 0 }
  }
}