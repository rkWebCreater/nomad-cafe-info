<!-- カフェエリアのコンポーネント -->

<script setup>

//定数ファイルからAREASのリストを読み込む
import {AREAS} from '~/constants/areas'

</script> 
<template>
 <div id="cafeArea" class="mt-20 mb-20">
      <div class="ttl">
        <h2>エリアから探す</h2>
      </div>
      <ul class="area-list">

       <!-- 繰り返し処理 -->
       <NuxtLink v-for="area in AREAS" 
       :key="area.id" 
       :to="{path: '/search', query: { area: area.id }}" class="area-item">

       <div class="area-image"><img :src="area.imageUrl" :alt="area.name"  /></div> 
       
       <div class="area-name"><p >{{area.name}}<br></p></div> 
       
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
            color: rgb(120, 88, 66);
          }
        }
}


/* エリアボタン一覧 */
.area-list{
           margin-left: auto;
           margin-right: auto;
           display: grid;
           justify-content: center;
           align-content: center;
           gap:20px;

    /* エリアボタン */
    .area-item{
               width:stretch;
               max-width:clamp(200px , 5vw , 300px);
               height:70px;
               position: relative;
               display: flex;
               flex-wrap: wrap; 
               overflow:hidden;
               border-radius: 20px;
    /*　画像　*/
      .area-image{
         width:clamp(150px , 4vw , 200px);

         img{
          border-radius: 10px;
          height:stretch;
         }
        
      }
      /*　エリア名　*/
      .area-name{
              width:stretch ;
              height: 80px ;
              background: rgb(53 32 16);
              border-radius: 10px;
              /*右側を曲線にする */
              clip-path: ellipse(100% 75% at 100% 50%);
              position:absolute;
              left:100px;
            
        p{
          width: max-content;
          color: rgb(53 32 16);
          position:absolute;
          left:57%;
          transform : translate(-50% , -50%);
         
        }
        p:after{
           content:'→';
           position:absolute;
           left:40%;
         
        }
        
      }
      .area-name:before{
              content:'';
              width: 100%;
              height:80px;
              background: rgb(255 247 240);
              border-radius: 10px;
              clip-path: ellipse(100% 65% at 100% 40%);
              position: absolute;
              left: 3px;

            }
    }
    
}
.area-item:hover{
              opacity : 0.5;
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

           /* エリアボタン */
    .area-item{

      /*　エリア名　*/
      .area-name{
            
        p{
          font-size:12px;
          top:35%;
         
        }
        
      }
    }
    

 }
}
@media (min-width:769px){
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
               height:80px;

      img{
        width: 100% ;
        height: 80px ; 
        object-fit: cover;
      }

      p{
        font-size:14px;
        bottom: 0;
        letter-spacing: 3px;
        padding: 0 0 0 5px;
        border-radius: 5px;
        top:50%;
      }
    }
 }

      
}
</style>
