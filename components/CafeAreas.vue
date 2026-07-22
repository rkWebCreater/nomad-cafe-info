<!-- カフェエリアのコンポーネント -->
<template>
 <div id="cafeArea">
      <div class="ttl">
        <h2 class="font-semibold">エリアから探す</h2>
      </div>
      <ul class="area-list">
       <!-- jsで繰り返し処理 -->
       <NuxtLink v-for="area in areasInfo" :key="area.id" :to="{path: '/search', query: { area: area.id }}" class="area-item">
        <img :src="area.imageUrl" :alt="area.name" class="area-image" />
        <p class="area-name">{{area.name}}</p>
       </NuxtLink><!-- コロン（:）をつけることで、データの中の「imageUrl」の文字をそのまま画像パスとして正しく読み込みます。 -->  
      </ul>
  </div>
</template>

<style>
/*PC,SP 共通 */
#cafeArea{
        .ttl{
          h2{
            text-align: center;
          }
        }
}
.area-list{
           margin-left: auto;
           margin-right: auto;
           display: grid;
           justify-content: center;
           align-content: center;

    .area-item{
               position: relative;

      img{
         border-radius: 10px;
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
      }
      p{
        font-family:'zen kurenaido';
        color:rgb(245, 230, 217) ;
        background: rgb(65, 40, 20);
        position: absolute;
      }
    }
    
}

@media (max-width:768px){
      
#cafeArea{
        .ttl{
            margin-bottom:20px;
            letter-spacing: 1px;
          h2{
            font-size:20px;
          }
          
        }
}
        
.area-list{
           width: 100%;
           max-width: 400px;
           height:250px;
           grid-template-columns: repeat(auto-fill, minmax(45%, auto));
           column-gap: 10px;
           row-gap: 10px;

    .area-item{
               height:70px;

      img{
        width: 100% ;
        height: 70px ; 
      }

      p{
        font-size:16px;
        bottom: 0;
        letter-spacing: 5px;
        padding: 0 0 0 5px;
        border-radius: 5px;
      }
    }
 }
}
@media (min-width:1024px){
     #cafeArea{
        .ttl{
             margin-bottom:20px;
             letter-spacing: 5px;

            h2{
               font-size:25px;
            }
          
        }
  }
  .area-list{
           width: 100%;
           max-width: 1000px;
           height:250px;
           grid-template-columns: repeat(auto-fill, minmax(20%, auto));
           column-gap: 30px;
           row-gap: 30px;

    .area-item{
               height:100px;

      img{
        width: 100% ;
        height: 100px ; 
        object-fit: cover;
      }

      p{
        font-size:16px;
        bottom: 0;
        letter-spacing: 5px;
        padding: 0 0 0 5px;
        border-radius: 5px;
      }
    }
 }

      
}
</style>

<script setup>

const areasInfo = [
  {
    id:"shibuya",
    name:"渋谷",
    imageUrl:"/nomad-cafe-info/images/areas/shibuya.png"
  },
  {
    id:"shinjuku",
    name:"新宿",
    imageUrl:"/nomad-cafe-info/images/areas/shinjuku.png"
  },
  {
    id:"umeda",
    name:"梅田",
    imageUrl:"../nomad-cafe-info/images/areas/umeda.png"
  },
  {
    id:"namba",
    name:"難波",
    imageUrl:"/nomad-cafe-info/images/areas/nanba.png"
  },
  {
    id:"nagoya",
    name:"名古屋",
    imageUrl:"/nomad-cafe-info/images/areas/nagoya.png"
  },
  {
    id:"fukuoka",
    name:"福岡",
    imageUrl:"/nomad-cafe-info/images/areas/fukuoka.png"
  }
]
</script> 