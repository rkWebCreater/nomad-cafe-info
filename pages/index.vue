<!-- トップページ -->
<template>
  <div class="min-h-screen">
    <!-- ヘッダー 
    <header class="text-center">
        <Drawer />　ドロワーメニュー layouts/defaultで共通化をし自動インポートのため書く必要なし
     キャッチコピー 
      <h1 class="mt-3 text-amber-800">
       <span class="mCatch text-xl font-semibold ">今日の仕事はどこでしようか</span><br>
       <span class="sCatch ">WiFi・電源あり、PC作業OK</span><br>
       <span class="sCatch ">あなたに合ったカフェを見つける</span><br>
       <span class="sCatch ">カフェ検索サイトです。</span><br>
      </h1>

       検索バー 
      <div class="search-bar">
       <SearchBar />
      </div>

    </header>-->

    <FV/> 

    <!-- カフェスライダーセクション -->
    <div class="cafe-cards-section  mx-auto" id="nowOpenCafe">
  
      <h2 class="cafe-cards-ttl font-semibold text-white tracking-wider">現在営業中のカフェ</h2>
      <p class="canSlide">＜ーー  スライドできます  ーー＞</p>
    
      <!-- CafeCards.vueの部分 -->
      <CafeCards :cafes="openCafes" class="h-full" />
    
    </div>
    
   <!-- エリアから探す -->
   <CafeAreas />

   <!-- タグから探す -->
   <TagSection />

   <!-- 新着おすすめカフェ -->
   <NewCafes />
  
  </div>
</template>

<style scoped>

/*PC、SP共通 */
header{
        width:clamp(320px , 100% , 1200px);/*clamp() メディアクエリを使わなくてもSP、PC両方のサイズを設定できる 最小320px、画面幅の100%を基本とし、最大1200pxに制限 */
        background:url(/nomad-cafe-info/images/FV/FV_cafe.png);
        background-repeat: no-repeat;
        position:relative;
        
      h1{
        color:rgb(65, 40, 20);
        font-family: "Zen Kurenaido", sans-serif;
        font-style: normal;
        position: absolute;

        .mCatch{
            color:rgba(218, 175, 140, 1);
            background:rgb(65, 40, 20);
            border-radius:40px;
        }
        .sCatch{
               color:rgb(65, 40, 20);
               background:rgba(218, 175, 140, 1);
               border-radius:40px;
               padding: 6px 20px ;
               letter-spacing:5px;
        }
      }
      .search-bar{
                 top:70%;
      }

}
/*CSSの background または background-image プロパティで url() と linear-gradient() をカンマ (,) で区切って同時に指定すると、背景画像の上に半透明のグラデーションを重ねて表示できる。先に書いた方が手前（上層）に重なる。 */
.cafe-cards-section{ 
                     background: linear-gradient(#ff760059, #361e0a5e), url(/nomad-cafe-info/images/slider/bg/cafe_table.jpg);
                     background-repeat: no-repeat;
                     background-size: cover;
                     background-position: center;
                     position: relative;
          
           .canSlide{
                     color: white;
                     text-align:center;
            }
}
/*
.cafe-cards-section::before{
   /*contentプロパティは必須 
  content: "";
  /* divを起点に位置を調整する 
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* オーバーレイを作成 
  background: linear-gradient(rgba(167, 88, 28, 0.5),  rgba(87, 47, 3, 0.5));
  z-index: -1;
 }
*/
@media (max-width:768px) {

  header{
         height:400px;
         margin-bottom:60px;
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
            padding: 30px 10px 10px 10px;

        }
        .canSlide{
          color: white;
          font-size: 14px;
          text-align:center;
          padding:20px;
    
        } 
  }
}

@media (min-width:769px){

  header{
        height: 600px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 100px;
        background-position: left;
        background-size:contain;

        h1{
          font-size: 25px ;
          top: 25% ;
          right: 10px ;
          text-align: end ;
          line-height: 65px ;

          .mCatch{
              font-size: 40px ;
              letter-spacing: 15px ;
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
                       width:100% ;
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
/*vueからcomputedを確実にインポート
import { computed } from 'vue'
import CafeCards from '~/components/CafeCards.vue';  コンポーネントCafeCards.vueの読み込み */
// 先ほど作成したJSONデータを読み込む
import cafeListData from '@@/cafes.json'
const cafeList = cafeListData 

// 💡 composables から関数を呼び出す CafeCards.vueを営業時間判定にかけるため
const { checkIfOpen } = useCafe()

const openCafes = computed(() => {
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

