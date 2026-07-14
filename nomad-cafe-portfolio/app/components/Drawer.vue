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
        <ul>
          <!-- @click="closeMenu" を仕込むことで、リンクを踏んだ瞬間に自動でド放ドロワーが閉じます -->
          <li>
            <NuxtLink to="/" @click="closeMenu">トップページ</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/#nowOpenCafe" @click="closeMenu">営業中のカフェ</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/#cafeArea" @click="closeMenu">エリアから探す</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style>
/* ===================================================
   ハンバーガーボタン（メニューを開閉するボタン）
=================================================== */
#menu-trigger {
  width: 30px;
  height: 30px;
  position: fixed;
  top: 3%;
  right: 5%;
  background: rgb(85, 45, 15); /* ボタンの背景色（お好みで変えてください） */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10000; /* メニュー本体より上に表示 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px; /* 2本線の間隔 */
 
   /*ボタンの日本線*/
   span {
      display: block;
      width:20px;
      height: 2px;
      background: #fff; /* 線の色 */
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

/* SP メニューが開いた時（JSで .is-active がついた時）の✖アニメーション */
#menu-trigger.is-active span:nth-child(1) {
  transform: translateY(3px) rotate(45deg);
}
#menu-trigger.is-active span:nth-child(2) {
  transform: translateY(-4px) rotate(-45deg);
}
/* PC メニューが開いた時（JSで .is-active がついた時）の✖アニメーション */
@media (min-width:769px){
                      #menu-trigger.is-active span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
#menu-trigger.is-active span:nth-child(2) {
  transform: translateY(-4px) rotate(-45deg);
}

}


/* ===================================================
   ドロワーメニュー本体（右側から出てくる白い画面）
=================================================== */
.drawer-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px; /* メニューの横幅 */
  height: 100vh; /* 画面全体の高さ */
  background: #f1f1f1; /* メニューの背景色 */
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15); /* 左側にうっすら影をつける */
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
@media (min-width:1024px){
    .drawer-menu.is-open {
                         transform: translateX(10%);
}
}


/* ===================================================
   メニューの中のリンク（ナビゲーション）
=================================================== */
.drawer-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.drawer-nav li {
  margin-bottom: 20px;
}

.drawer-nav a {
  display: block;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  transition: color 0.2s;
}

/* リンクにマウスを乗せたときの効果 */
.drawer-nav a:hover {
  color: #007bff; /* お好みのアクセントカラーに */
}
</style>

<script setup>
  import {ref , onMounted , watch } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  //ドロワーメニューの開閉状態を真偽値( true / false) でリアクティブに管理
  const isOpen = ref(false)

  //メニューを開閉する関数
  const toggleMenu = () =>{
    isOpen.value = !isOpen.value
  } 

  //メループを閉じる関数（リンクがクリックされたとき）
  const closeMenu = () =>{
    isOpen.value = false
  }

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

  //ページ遷移時や読み込み時にハッシュ(#cafeArea)があればスクロールを実行
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