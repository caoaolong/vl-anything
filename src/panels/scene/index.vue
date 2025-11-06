<template>
  <div ref="container" id="svg-container"></div>
</template>

<script setup lang="ts">
import { SVG } from "@svgdotjs/svg.js";
import type { Shape } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.resize.js";
import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.draggable.js";
import "@svgdotjs/svg.panzoom.js";
import { onMounted, ref } from "vue";

const container = ref<HTMLElement | null>(null);
const current = ref<Shape | null>(null);

const selectShape = function (this: Shape, _: Event): void {
  this.select(true).resize(true);
  if (current.value && current.value !== this) {
    current.value.select(false).resize(false);
  }
  current.value = this;
};

let draggingShape = ref<Shape | null>(null);

const activeShape = function (this: Shape, _: Event) {
  if (draggingShape.value && draggingShape.value !== this) {
    (draggingShape.value as Shape).draggable(false); // 停止旧形状拖动
  }
  draggingShape.value = this;
  this.draggable(true);
};

const inactiveShape = function (this: Shape, _: Event) {
  draggingShape.value = null;
  this.draggable(false);
};

onMounted(() => {
  var canvas = SVG()
    .addTo("#svg-container")
    .size("100%", "100%")
    .viewbox(0, 0, 800, 600)
    .panZoom({
      zoomFactor: 0.1,
      panButton: 1,
    });

  canvas
    .rect(50, 50)
    .fill("#0f6")
    .on("mousedown", selectShape)
    .on("mouseenter", activeShape)
    .on("mouseup", inactiveShape);
  canvas
    .rect(50, 50)
    .move(100, 100)
    .fill("#f96")
    .on("mousedown", selectShape)
    .on("mouseenter", activeShape)
    .on("mouseup", inactiveShape);
});
</script>

<style scoped>
#svg-container {
  position: relative;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
}
</style>
