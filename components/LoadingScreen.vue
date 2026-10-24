<script setup lang="ts">
import { useRuntimeConfig } from 'nuxt/app';

interface Props {
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3500
})

// ページ遷移後も保持される、ローディング表示済み状態
const hasShownLoading = useState<boolean>(
  'loading-screen-has-shown',
  () => false
)

const isVisible = ref(!hasShownLoading.value)  //初回だけ表示
const isFading = ref(false)
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')

let fadeTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

// GitHub Pages の baseURL を取得
const config = useRuntimeConfig()
const rawBase = (config.app as Record<string, any>)?.baseURL || '/'
const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

// public/images/loading/loading_bar.mp4 へのパス
const videoSrc = computed(() => {
  return `${normalizedBase}images/loading/loading_bar.mp4`
})

const clearTimers = () => {
  if (fadeTimer) clearTimeout(fadeTimer)
  if (hideTimer) clearTimeout(hideTimer)
}

const hideOverlay = (delay: number) => {
  clearTimers()
  isFading.value = true
  hideTimer = setTimeout(() => {
    isVisible.value = false
  }, delay)
}

onMounted(() => {
  //2回目以降は表示しない
  if(!isVisible.value) return

  hasShownLoading.value = true

  if (videoRef.value) {
    videoRef.value.play().catch(() => {})
  }

  fadeTimer = setTimeout(() => {
    hideOverlay(700)
  }, props.duration)
})

onUnmounted(() => {
  clearTimers()
})

const skipLoading = () => {
  hideOverlay(300)
}
</script>

<template>
  <div
    v-if="isVisible"
    id="loading-overlay"
    :class="{ 'fade-out': isFading }"
    @click="skipLoading"
    title="画面クリックでスキップ"
  >
    <div class="loading-wrapper">
      <video
        ref="videoRef"
        class="loading-video"
        :src="videoSrc"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
      ></video>
      <p class="skip-hint">画面クリックでスキップ</p>
    </div>
  </div>
</template>

<style scoped>
#loading-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  background-color: #fff1e5;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  cursor: pointer;
  overflow: hidden;
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.7s ease;
}

#loading-overlay.fade-out {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(540px, 90vw);
  max-width: 540px;
}

.loading-video {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  border-radius: 20px;
}

.skip-hint {
  margin-top: 10px;
  font-size: 11px;
  color: #a89484;
  letter-spacing: 0.1em;
  opacity: 0.8;
  user-select: none;
}
</style>