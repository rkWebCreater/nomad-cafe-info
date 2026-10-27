<script setup lang="ts">
const props = withDefaults(
  defineProps<{ accentRate?: number }>(),
  { accentRate: 0.08 }
);

const guide = ref<SVGPathElement | null>(null);
const dots = ref<{ x: number; y: number; accent: boolean }[]>([]);

onMounted(() => {
  const path = guide.value;
  if (!path) return;

  const spacing = 15;
  const length = path.getTotalLength();
  let previousWasAccent = false;

  for (let distance = spacing / 2; distance < length; distance += spacing) {
    const point = path.getPointAtLength(distance);
    const accent:boolean = !previousWasAccent && Math.random() < props.accentRate;

    dots.value.push({ x: point.x, y: point.y, accent });
    previousWasAccent = accent;
  }
});
</script>

<template>
  <div class="route-background" aria-hidden="true">
    <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
      <path
        ref="guide"
        d="M190 480 C260 420 280 365 350 365 S430 390 470 330 S530 245 590 255 S650 270 690 190 S720 80 750 10"
        fill="none"
      />

      <circle
        v-for="(dot, index) in dots"
        :key="index"
        :cx="dot.x"
        :cy="dot.y"
        r="1.75"
        :fill="dot.accent ? '#ae631c' : '#b5957fe2'"
        :fill-opacity="dot.accent ? 0.32 : 0.30"
      />
    </svg>
  </div>
</template>

<style scoped>
.route-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>