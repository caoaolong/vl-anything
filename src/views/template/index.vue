<template>
  <div ref="container" id="svg-container"></div>
</template>

<script setup lang="ts">
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.resize.js";
import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.draggable.js"
import { onMounted, ref } from "vue";

const container = ref<HTMLElement | null>(null);

onMounted(() => {
  var canvas = SVG().addTo("#svg-container").size(500, 500);
  canvas.rect(50, 50).fill("red").select().draggable().resize();
});
</script>

<style scoped>
#svg-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
