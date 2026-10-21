<!-- ドロワーメニューのコンポーネント -->
<template>
  <div>
    <!-- ハンバーガーボタン（トリガー） -->
    <!-- :class="{ 'is-active': isOpen }" で、isOpenがtrueの時だけ自動でクラスがつきます -->
    <button 
      id="menu-trigger" 
      :class="{ 'is-active': isOpen }" 
      :aria-expanded="isOpen"
      :aria-label="isOpen ? 'メニューを閉じる' : 'メニューを開く'"
      @click="toggleMenu">
      <span></span>
      <span></span>
    </button>

    <!-- ドロワーメニュー本体 -->
    <!-- こちらも、isOpenがtrueの時だけ 'is-open' クラスが合体します -->
    <div :class="['drawer-menu', { 'is-open': isOpen }]" id="drawer-menu">
      <nav class="drawer-nav">
        <div class="tag-section">
          <TagSection />
        </div>
        <ul>
          <!-- @click="closeMenu" を仕込むことで、リンクを踏んだ瞬間に自動でドロワーが閉じます v-forによる繰り返し処理-->
          <li v-for="item in menuItem" :key="item.id">
            <NuxtLink  :to="item.path" @click="closeMenu" class="menu_text_color">{{item.name }}</NuxtLink>
          </li>
          <!-- ここまでv-forによる繰り返し処理 -->
        </ul>
      </nav>
    </div>

  </div>
</template>

<style>
/* ===================================================
   ハンバーガーボタン（メニューを開閉するボタン）*/
#menu-trigger {
  width: 30px;
  height: 30px;
  position: fixed;
  top: 3%;
  right: 1%;
  background: rgba(53, 32, 16, 1); /* ボタンの背景色（お好みで変えてください） */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10000; /* メニュー本体より上に表示 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px; /* 2本線の間隔 */
 
   /*ボタンの2本線*/
   span {
      display: block;
      width:20px;
      height: 2px;
      background: #ffffff; /* 線の色 */
      transition: transform 0.3s, opacity 0.3s; /* ✖に変わるアニメーション速度 */
   }

}
@media (min-width:769px){

 #menu-trigger {
               width: 40px;
               height: 40px;
               gap: 7px;

            span{
                 width: 24px;
                 height:3px;
            }
          
  }
}

.is-active{
                   
/*メニューが開いた時（JSで .is-active がついた時）の✖アニメーション */
         & span{
              &:nth-child(1){
                             transform: translateY(4px) rotate(225deg);
              }
              &:nth-child(2){
                            transform: translateY(-4px) rotate(315deg);
              }
         }

}



/* ===================================================
   ドロワーメニュー本体（右側から出てくる白い画面）
=================================================== */
.drawer-menu {
  position: fixed;
  top: 0;
  right: 0px;
  width: 280px; /* メニューの横幅 */
  height: 100vh; /* 画面全体の高さ */
  background: rgb(247, 233, 220); /* メニューの背景色 */
  box-shadow: inset 4px 4px 0 1px rgba(174, 143, 118, 0.8);
  z-index: 9999;
  padding: 80px 24px 24px; /* ボタンと被らないように上をあける */
  box-sizing: border-box;
  text-align:center;

  /* ★ここが重要：初期状態は右側に隠しておく（GSAPなしで動かす肝） */
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); /* スムーズに動かす設定 */
}

/* メニューが開いた時（JSで .is-open がついた時）に画面内に戻す */
.drawer-menu.is-open {
  transform: translateX(0);
}


/* ===================================================
   メニューの中のリンク（ナビゲーション）
=================================================== */
.drawer-nav .tag-section {
  width: 100%;
  height: auto;
  font-size: 14px;
}

/* Drawer内のTagSectionだけをコンパクトに調整 */
.drawer-nav .tag-section #cafeTag {
  padding-inline: 0;
  margin-bottom: 24px;
}

.drawer-nav .tag-section #cafeTag .section-ttl {
  font-size: 16px;
  margin-bottom: 8px;
}

.drawer-nav .tag-section #cafeTag > p {
  display: none; /* Drawer内では説明文を非表示にする */
}

.drawer-nav .tag-section #cafeTag > div {
  gap: 8px;
}

.drawer-nav .tag-section #cafeTag > div a {
  display: inline-flex;
  width: auto;
  align-items: center;
  border-bottom: 0;
  color: #fff;
  padding: 6px 12px;
  font-size: 12px;
}
.drawer-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.drawer-nav li {
  margin-bottom: 10px;
}

.drawer-nav a {
  display: block;
  color: rgb(85, 46, 9);
  text-decoration: none;
  font-size: 14px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  transition: color 0.2s;
}

/* リンクにマウスを乗せたときの効果 */
.drawer-nav a:hover {
  color: rgb(201, 174, 130); /* お好みのアクセントカラーに */
}
</style>

<script setup>
 /* import {ref , onMounted , watch } from 'vue'
    import { useRoute } from 'vue-router' */
  const route = useRoute()
  //---------ドロワーメニューの開閉状態を真偽値( true / false) でリアクティブに管理  ref()
  const isOpen = ref(false)

  //メニューを開閉する関数  valueを書かないと認識しない
  const toggleMenu = () =>{
    isOpen.value = !isOpen.value
  }

  //メループを閉じる関数（リンクがクリックされたとき）
  const closeMenu = () =>{
    isOpen.value = false
  }

//---------ここまでドロワーメニューの開閉

//-----ドロワーメニューの繰り返し処理
  const menuItem = [
             {id: 1 , name: 'トップページ' , path:'/' },
             {id: 2 , name: '営業中のカフェ' , path:'/#nowOpenCafe'},
             {id: 3 , name: 'エリアから探す' , path:'/#cafeArea'},
             {id: 4 , name: 'タグから探す' , path:'/#cafeTag'},
             {id: 5 , name: '新着おすすめカフェ' , path:'/#new-reco-cafe'}
  ]

//-----ここまでドロワーメニューの繰り返し処理


  //指定の要素へスムーズにスクロールする関数（vue, nuxt用に安全化）
  const scrollToTarget = (targetId) =>{
    if(!targetId) return

    //サーバーサイドでの実行を防ぎ、ブラウザ上でのみ動作させる安全策
    if(import.meta.client){
        const targetElement = document.getElementById(targetId)
        if(targetElement){
            const headerHeight = 0 //固定ヘッダーがある場合は高さを指定(例:80)
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight
        
        window.scrollTo({
                      top:targetPosition,
                      behavior:'smooth'
        })
        
        }
    }
  }

  //ページ遷移時や読み込み時にハッシュ(#cafeAreaなど)があればスクロールを実行
  const checkAndScroll = () =>{
        const hash = route.hash //URLの#cafeAreaの部分を取得
        if(hash){
            const targetId = hash.replace('#' , '') //#を消してID名だけにする
            //Nuxtの画面描画が100%完了するのを一瞬待ってからスクロールを走らせる
            setTimeout(() =>{
                scrollToTarget(targetId)},100)
        }
  }

  //最初のページ読み込みのタイミングをフック
  onMounted(()=>{
    checkAndScroll()
  })

  //下部のスライダー同様、同じページ内でハッシュが変わった瞬間を監視してスクロール
  watch(()=> route.hash , () =>{
    checkAndScroll()
  })
  
</script>
