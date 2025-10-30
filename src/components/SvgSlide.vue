<template>
  <div>
    <div ref="container" class="svg-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SVG } from '@svgdotjs/svg.js'
import { gsap } from 'gsap'

const props = defineProps({
  src: { type: String, required: true }
})

const container = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(props.src)
    const text = await res.text()
    if (container.value) {
      container.value.innerHTML = text

      const svgEl = container.value.querySelector('svg')
      if (svgEl) {
        // 使用模块化的 SVG.js API
        const draw = SVG(svgEl)
        // 尝试找到 data-cell-id="button" 并绑定事件
        const button = draw.findOne('[data-cell-id="button"]')
        if (button) {
          button.on('click', () => {
            // 使用模块化的 gsap
            gsap.to('.box', { x: 200, duration: 1 })
          })
        }
      }
    }
  } catch (e) {
    console.error('加载 SVG 失败', e)
  }
})
</script>

<style scoped>
.svg-container {
  border: 1px solid #eee;
  padding: 0.5rem;
  min-height: 240px;
}
</style>
