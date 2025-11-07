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
import { UpdateShape } from "@/entites/vg";

const shapes = ref<Record<string, Shape>>({});
// 标志位：用于防止程序更新时触发拖拽事件
const isUpdatingFromInspector = ref(false);

const addShape = (shape: Shape) => {
  shapes.value[shape.id()] = shape;
  shape.on("mousedown", function (this: Shape) {
    Object.values(shapes.value).forEach((shape: Shape) => shape.select(false).resize(false));
    this.select(true).resize(true);
    bus.emit("select", this)
  });
  shape.on("dragmove", function (this: Shape) {
    // 如果是从检查器更新，不发送 update 事件
    if (!isUpdatingFromInspector.value) {
      bus.emit("update", this);
    }
  });
  shape.on("resize", function (this: Shape) {
    // 如果是从检查器更新，不发送 update 事件
    if (!isUpdatingFromInspector.value) {
      bus.emit("update", this);
    }
  });
};

bus.on("edit", (model: Record<string, any>) => {
  const id = model["vector_graphics__id"];
  if (!id) return;
  const shape = shapes.value[id];
  if (!shape) return;
  // 标记这是从检查器更新，不要触发 update 事件
  isUpdatingFromInspector.value = true;
  UpdateShape(shape, model);
  // 使用 setTimeout 确保更新完成后再重置标志位
  setTimeout(() => {
    isUpdatingFromInspector.value = false;
  }, 0);
});

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
    Object.values(shapes.value).forEach((shape: Shape) => shape.select(false));
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
