<template>
  <div class="min-h-screen ">
    <!-- ヘッダー -->
    <header class="text-center ">

      <Drawer />

      <h1 class="mt-3 text-amber-800">
        <span class="mCatch text-2xl font-semibold ">今日の仕事はどこでしようか</span><br>
        <span class="sCatch">WiFi・電源あり、PC作業OK</span><br>
        <span class="sCatch">あなたに合ったカフェを見つける</span><br>
        <span class="sCatch  ">カフェ検索サイトです。</span><br>
      </h1>

      <div class="search-bar">
       <SearchBar />
      </div>

    </header>

    <!-- カフェスライダーセクション -->
    <div class="cafe-cards-section  mx-auto" id="nowOpenCafe">
      <h2 class="cafe-cards-ttl font-bold text-white">
       現在営業中のカフェ
      </h2>
      <p class="canSlide">＜ーー  スライドできます  ーー＞</p>
      <CafeCards :cafes="openCafes" class="h-full" />
    </div>
    
   <CafeAreas />
  
  </div>
</template>

<style scoped>

/*PC、SP共通 */
header{
        background:url(../../public/images/FV/FV_cafe.png);
        background-repeat: no-repeat;
        position:relative;
        
      h1{
        color:rgba(53, 32, 16, 1);
        font-family: "Zen Kurenaido", sans-serif;
        font-style: normal;
        position: absolute;

        .mCatch{
            color:rgba(218, 175, 140, 1);
            background:rgba(53, 32, 16, 1);
            border-radius:40px;
        }
        .sCatch{
               color:rgba(53, 32, 16, 1);
               background:rgba(218, 175, 140, 1);
               border-radius:40px;
               padding: 3px 20px 3px 20px;
               letter-spacing: 5px;
        }
      }
      .search-bar{
                 top:70%;
      }

}
.cafe-cards-section{
                     background:url(../../public/images/slider/bg/cafe_table.jpg);
                     background-repeat: no-repeat;
                     background-size: cover;
                     background-position: center; 

                    .cafe-cards-ttl{
                                   letter-spacing: 3px;
                    }
               
           .canSlide{
                     color: white;
                     text-align:center;
            }
}

@media (max-width:768px) {

  header{
         height:400px;
         margin-bottom:80px;
         background-position: top;
         background-size: cover;

        h1{
           top: 18%;
           left: 0;
           text-align: start;
           letter-spacing: 2px;
           line-height:30px;

        }
        .mCatch{
                font-size: 20px;
                padding: 2px 10px 2px 10px;
                
        }
        .sCatch{
                font-size: 12px;
        }
        .search-bar{
                   position: absolute;
                   right: 0;
        }

  }
  .cafe-cards-section{
             
        .cafe-cards-ttl{
            font-size:20px;
            text-align: center;
            padding:20px;

        }
        .canSlide{
          color: white;
          font-size: 14px;
          text-align:center;
          padding:20px;
    
        } 
  }
}

@media (min-width:1024px){

  header{
        max-width: 1200px;
        height: 600px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 120px;
        background-position: left;
        background-size: cover;

        h1{
          font-size:25px ;
          top: 25% ;
          right:10px ;
          text-align:end ;
          line-height:65px ;

          .mCatch{
              font-size:50px ;
              letter-spacing: 10px ;
              padding: 0 20px 0 20px ;
          }
        }
        .search-bar{
                    width: 40% ;
                    position: absolute ;
                    right: 0 ;
                  
        }
  }
    .cafe-cards-section{
                       padding:20px ;
                       margin-bottom:120px ; 

        .cafe-cards-ttl{
                        font-size:25px ; 
                        text-align: center ;
                        padding: 30px 0 0 0 ;
                        margin-bottom: 40px ;
        }
        .canSlide{
                 font-size: 18px ;
                 letter-spacing: 10px ;
        }
     }
 
}
</style>

<script setup>


import CafeCards from '~/components/CafeCards.vue'; /*コンポーネントCafeCards.vueの読み込み */
// 先ほど作成したJSONデータを読み込む
import cafeListData from '../../cafes.json'
const cafeList = cafeListData

//営業中かどうかの判定 スライダーのカードをコンポーネント化しているのでCafeCards.vue側にもcheckIfOpen関数を記述する
const checkIfOpen = (businessHours) => {

  const now = new Date();//今の日付
  const currentHours = String(now.getHours()).padStart(2,'0');   //String()で文字データに変換し.padStart(2,'0')で1桁の数字（例：9）を、2桁のきれいな文字列（例：09）に強制的に変換する .padStart( , '')は文字列にしか使えない
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const nowTimeNum = Number(currentHours + currentMinutes);      //Number()で数値化する
  
  const times = businessHours.split('-');
  if (times.length !== 2) return false //もしデータが未入力だったり形式が違ったりした場合に、エラーを起こさず安全に「営業外（false）」として弾く。
  
  const openTimeNum = Number(times[0].trim().replace(':', ''))//Number(...) で、文字列から純粋な数値の 800 に変換する。times[0].trim() 文字のまわりにある余分なスペース（半角・全角）をキレイに消去して "08:00" にする。 replace(':', '') で、コロンを消し去って "0800" というただの数字の並びにする。
  const closeTimeNum = Number(times[1].trim().replace(':', ''))

  if(closeTimeNum < openTimeNum){
    // 終了時間が開店時間より小さい＝深夜営業の店の場合

    // 「開始時刻以降（18時〜24時）」または「終了時刻まで（0時〜3時）」なら営業中
     return nowTimeNum >= openTimeNum || nowTimeNum <= closeTimeNum
  
  }else{
    // 終了時間が開店時間より大きい＝通常営業の店の場合

     return nowTimeNum >= openTimeNum && nowTimeNum <= closeTimeNum
  }
}

const openCafes = computed(()=> {
  //filter関数を使ってcheckIfOpenがtrueになるカフェだけを残す
  return cafeList.filter(cafe => checkIfOpen(cafe.businessHours))
})
/*computed()について

 普通の関数（function）との決定的な違い「計算するタイミング」と「記憶力（キャッシュ）」が違う
普通の関数（methods など）:画面が書き換わる（リロードされるなど）たびに、毎回最初から最後まで計算を実行する
 データが変わっていなくてもお構いなしに動くため、データ量が多いとサイトが重くなる
 
computed():元になるデータ（今回の場合は cafeList や検索窓の文字）が変わった瞬間だけ自動で再計算します。
データが変わっていなければ、前回の計算結果を頭の中に記憶（キャッシュ）してそれを一瞬で使い回すため、サイトの動作が劇的に軽くなります。 
*/


</script>

