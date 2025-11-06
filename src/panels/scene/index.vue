<template>
  <div id="svg-container"></div>
</template>

<script setup lang="ts">
import { SVG } from "@svgdotjs/svg.js";
import type { Shape } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.resize.js";
import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.draggable.js";
import "@svgdotjs/svg.panzoom.js";
import { onMounted, ref } from "vue";
import { bus } from "@/utils/bus";
import { showAxis, showView } from "@/utils/scene";

const shapes = ref<Shape[]>([]);

const addShape = (shape: Shape) => {
  shapes.value.push(shape);
  shape.on("mousedown", function (this: Shape) {
    shapes.value.forEach(shape => shape.select(false).resize(false));
    this.select(true).resize(true);
    bus.emit("select", this)
  });
};

onMounted(() => {
  const canvas = SVG()
    .addTo("#svg-container")
    .size("100%", "100%")
    .viewbox(0, 0, 600, 600)
    .panZoom({
      zoomFactor: 0.1,
      panButton: 1,
    });

  // 初始绘制网格
  showAxis(canvas);
  // 绘制视图边框
  showView(canvas, "cyan", 0.5);


  canvas.on("mousedown", function (this: Shape) {
    shapes.value.forEach(shape => shape.select(false));
  })

  addShape(canvas
    .rect(50, 50)
    .fill("#0f6")
    .draggable())

  addShape(canvas
    .rect(50, 50)
    .move(100, 100)
    .fill("#f96")
    .draggable())
});
</script>

<style scoped>
#svg-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
