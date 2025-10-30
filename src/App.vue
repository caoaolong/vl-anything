<template>
  <div class="app-root">
    <header>
      <h1>VL-Anything — Vue 演示</h1>
      <p>使用 draw.io 导出的 SVG 来制作交互式课件（Vue 版本）。</p>
    </header>

    <main>
  <SvgSlide src="/demo.drawio.svg" />

      <section style="margin-top: 1rem">
        <div class="box green"></div>
      </section>
    </main>
  </div>
</template>

<script setup>
import SvgSlide from '@/components/SvgSlide.vue'
</script>

<style>
.app-root {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  padding: 1rem;
}
.box {
  width: 75px;
  height: 75px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #0ae448, #abff84);
}
</style>
