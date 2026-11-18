<!-- トップページ -->
<template>
  <div class="min-h-screen">

    <indexLoadingScreen />
    <indexFV/> 

    <!-- カフェスライダーセクション -->
    <div class="cafe-cards-section  mx-auto" id="nowOpenCafe">
  
      <h2 class="cafe-cards-ttl tracking-wider mb-5">現在営業中のカフェ</h2>
    
      <!-- 営業中のカフェをCafeSliderで表示 -->
      <CafeSlider 
      :allCafes="openCafes"
      state-key="home-open-cafes" 
      class="h-full" />

      <img src="/images/slider/bg/cafe_table-bg.webp" alt="カフェのテーブル">
    
    </div>
    
   <!-- エリアから探す -->
   <indexCafeAreas />

   <!-- タグから探す -->
   <div id="cafeTag"></div>
   <TagSection />

   <!-- 新着おすすめカフェ -->
   <indexNewCafes />
  
  </div>
</template>
<script setup>
// 💡 composables/useCafe.ts から全カフェデータと営業時間判定関数を呼び出す（個別 import 不要！）
const { allCafes, checkIfOpen } = useCafe()
// 曜日配列（営業日判定用）
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const openCafes = computed(() => {
  const today = WEEKDAYS[new Date().getDay()]
  // 営業中のカフェ(営業時間、営業日)をフィルタリングして返す
  return allCafes.value.filter(cafe => checkIfOpen(cafe.businessHours) && !cafe.closedDays?.includes(today))
})
</script>
<style scoped>
/*PC、SP共通 */
header{
        width:clamp(320px , 100% , 1200px);/*clamp() メディアクエリを使わなくてもSP、PC両方のサイズを設定できる 最小320px、画面幅の100%を基本とし、最大1200pxに制限 */
        background:url(/images/FV/FV_cafe.png);
        background-repeat: no-repeat;
        background-position: top;
        background-size: cover;
        position:relative;
        height:400px;
        margin-bottom:60px; 
        
      h1{
        color:rgb(65, 40, 20);
        position: absolute;
        top: 18%;
        left: 0;
        text-align: start;
        letter-spacing: 2px;
        line-height:30px;

        .mCatch{
            color:rgba(218, 175, 140, 1);
            background:rgb(65, 40, 20);
            border-radius:40px;
            font-size: 20px;
            padding: 2px 10px 2px 10px;
        }
        .sCatch{
               color:rgb(65, 40, 20);
               background:rgba(218, 175, 140, 1);
               border-radius:40px;
               padding: 6px 20px ;
               letter-spacing:5px;
               font-size: 12px;
        }
      }
      .search-bar{
                 position: absolute;
                 top:70%;
                 right: 0;
      }

}
/*CSSの background または background-image プロパティで url() と linear-gradient() をカンマ (,) で区切って同時に指定すると、背景画像の上に半透明のグラデーションを重ねて表示できる。先に書いた方が手前（上層）に重なる。 */
.cafe-cards-section{ 
                     position: relative;
                     width:100% ;

           .cafe-cards-ttl{
                  color:var(--text-color);
                  font-size:20px;
                  text-align: center;
                  padding: 30px 10px 10px 10px;

           }
           img{

            width: 200px;
            position: absolute;
            left: -80px;
            bottom: -70px;
            
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
                       max-width: 1200px;
                       padding: 20px ;
                       margin-bottom:120px ; 

        .cafe-cards-ttl{
                        font-size:25px ; 
                        text-align: center ;
                        padding: 30px 0 0 0 ;
                        margin-bottom: 40px ;
        }
        img{
              width:400px;
              position: absolute ;
              left: 65%;
        }
     }
 
}
</style>