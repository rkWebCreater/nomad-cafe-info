export const useCafe = () =>{

//営業中かどうかの判定 スライダーのカードをコンポーネント化しているのでCafeCards.vue側にもcheckIfOpen関数を記述する
const checkIfOpen = (businessHours: string): boolean => {

  const now = new Date();//今の日付
  const currentHours = String(now.getHours()).padStart(2,'0');   //String()で文字データに変換し.padStart(2,'0')で1桁の数字（例：9）を、2桁のきれいな文字列（例：09）に強制的に変換する .padStart( , '')は文字列にしか使えない
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const nowTimeNum = Number(currentHours + currentMinutes);      //Number()で数値化する
  
  // 💡 空白や全角スペースのブレを完全に消去してからハイフンで分割します
  const cleanHours = businessHours.replace(/\s+/g, '')
  const times = cleanHours.split('-')
  if (times.length !== 2) return false //もしデータが未入力だったり形式が違ったりした場合に、エラーを起こさず安全に「営業外（false）」として弾く。
  
   // 💡 TypeScriptの警告対策：
    // 「times[0] と times[1] は絶対に存在する文字列（string）である」と明示します
    const openStr = times[0]
    const closeStr = times[1]
    
    if (!openStr || !closeStr) return false

    // コロンを消して純粋な数値に変換（例: "08:00" ➔ 800）
    const openTimeNum = Number(openStr.replace(':', ''))
    const closeTimeNum = Number(closeStr.replace(':', ''))

  if(closeTimeNum < openTimeNum){
    // 終了時間が開店時間より小さい＝深夜営業の店の場合

    // 「開始時刻以降（18時〜24時）」または「終了時刻まで（0時〜3時）」なら営業中
     return nowTimeNum >= openTimeNum || nowTimeNum <= closeTimeNum
  
  }else{
    // 終了時間が開店時間より大きい＝通常営業の店の場合

     return nowTimeNum >= openTimeNum && nowTimeNum <= closeTimeNum
  }
}

 // 外部で使えるように関数を返します
  return {
    checkIfOpen
  }
}
