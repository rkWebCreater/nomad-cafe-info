<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 4300
})

const isVisible = ref(true)
const isFading = ref(false)

// GitHub Pages の baseURL ('/nomad-cafe-info/') を自動考慮
const config = useRuntimeConfig()
const rawBase = config.app.baseURL || '/'
const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

// public/images/loading/loading_bar.mp4 へのパス
const videoSrc = computed(() => {
  return `${normalizedBase}images/loading/loading_bar.mp4`
})

onMounted(() => {
  setTimeout(() => {
    isFading.value = true
    setTimeout(() => {
      isVisible.value = false
    }, 700)
  }, props.duration)
})

const skipLoading = () => {
  isFading.value = true
  setTimeout(() => {
    isVisible.value = false
  }, 300)
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
  background-color: #fff1e5; /* サイト全体の優しい生成り色 */
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
  /* レイアウトシフト（カクつき）を完全防止 */
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
