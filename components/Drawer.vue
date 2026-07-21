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
                           & .is-active{
                   
                /* SP メニューが開いた時（JSで .is-active がついた時）の✖アニメーション */
                                  & span{
                                     &:nth-child(1){
                                                 transform: translateY(3px) rotate(45deg);
                                     }
                                     &:nth-child(2){
                                                 transform: translateY(-4px) rotate(-45deg);
                                     }
                                   }

                            }
                  }
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
  right: -20px;
  width: 280px; /* メニューの横幅 */
  height: 100vh; /* 画面全体の高さ */
  background: rgb(231, 200, 175); /* メニューの背景色 */
  box-shadow: -4px 10px 0 1px rgba(174, 143, 118, 0.8);/* 左側にうっすら影をつける */
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
  color: rgb(51, 51, 51);
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  transition: color 0.2s;
}

/* リンクにマウスを乗せたときの効果 */
.drawer-nav a:hover {
  color: rgb(255, 234, 210); /* お好みのアクセントカラーに */
}
</style>

<script setup>
  import {ref , onMounted , watch } from 'vue'
  import { useRoute } from 'vue-router'

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
  {id: 3 , name: 'エリアから探す' , path:'/#cafeArea'}]

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
<!-- Nuxt3 / Vue3】ドロワー＆スクロールコードの重要用語解説1. Vue / Nuxt の基本機能（関数）


 ref() （レフ） 日常のたとえ: 画面と連動する 「魔法のホワイトボード」解説: 普通の変数（let x = false）は、中身を書き換えても画面の見た目は変わりません。しかし ref(false) で囲むと、JavaScript側で isOpen.value = true に書き換えた瞬間に、画面側のHTML（ドロワーメニュー）も連動してパッと自動で開くようになります。
 このように画面をリアルタイムに動かす仕組みを「リアクティブ」と呼びます。
  
 onMounted() （オン・マウンテッド）日常のたとえ: お店の 「オープン初日（開店の瞬間）」解説: ページがブラウザに表示され、HTMLの組み立てが100%完了した「一番最初の瞬間」に、中の処理（スクロールチェックなど）を1回だけ自動で実行してくれる案内役です。
  
 watch() （ウォッチ）日常のたとえ: 24時間体制の 「監視カメラ」解説: 指定したデータ（今回はURLの #about-con などのハッシュ）をじーっと見張り続け、中身が変化した「その瞬間」を検知して、自動で次の処理（スクロール関数など）を呼び出してくれる防犯カメラのような機能です。
  ブラウザ標準の機能（Web APIメソッド・プロパティ）
  
 document.getElementById()   日常のたとえ: 巨大なマンションから 「部屋番号で住人を一本釣りする」解説: 画面の中にある無数のHTML要素の中から、指定した id="about-con" などの名前（ID）を持っている要素を1つだけピンポイントで探し出して連れてくる命令です。
 
 getBoundingClientRect() （ビー・アール・シー）日常のたとえ: 建築士の 「レーザー距離計（測定器）」解説: 探し出してきたHTML要素が、「今、画面の最上部から数えて何ピクセル下に位置しているか」という正確な現在地（座標情報）をリアルタイムに測って教えてくれる超高精度なメソッドです。
  
 window.scrollY   日常のたとえ: マラソンの 「これまでに走った（スクロールした）累計距離」解説: ユーザーがページを上から下へどれだけスクロールしたか、その「現在のスクロール量（ピクセル）」を表すプロパティです。
 
 window.scrollTo()  日常のたとえ: 指定の場所へワープさせる 「自動操縦ボタン」解説: ブラウザの画面を指定した位置まで自動で動かす命令です。オプションに { behavior: 'smooth' } を指定することで、一瞬でワープするのではなく、カメラがスーッと滑らかに移動する（スムーズスクロール）ようになります。 
  
 import.meta.client  日常のたとえ: 「ここはブラウザ（パソコンの画面）ですか？」という確認の合図解説: Nuxt 3は、画面を表示する前に「サーバー側（裏側）」で一度HTMLを組み立てます。しかし、サーバー側には window や document（画面）が存在しないため、直接スクロールを実行しようとすると画面が真っ白にクラッシュしてしまいます。
 if(import.meta.client) と書くことで、「サーバー側での処理のときはスルーして、ユーザーのブラウザ画面に表示されたときだけ安全にスクロールを実行してね」という強力な安全装置（防壁）になります。
  
 setTimeout()  日常のたとえ: 「ちょっと100ミリ秒（0.1秒）だけお茶を飲んで待つ」解説: ページが切り替わった直後は、まだ文字や画像の読み込みが完全に終わっておらず、スクロール位置がズレてしまうことがあります。
 setTimeout(() => { ... }, 100) と書くことで、ほんの一瞬だけ実行を遅らせ、ブラウザが幅や高さを完全に計算し終えた「一番綺麗なタイミング」でスクロールを走らせる、実務でも必須のズレ防止テクニックです。
  -->