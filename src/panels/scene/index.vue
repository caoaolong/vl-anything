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
import { onMounted, onUnmounted, ref } from "vue";
import { bus } from "@/utils/bus";
import { showAxis, showView, createViewboxWatcher } from "@/utils/scene";

const shapes = ref<Shape[]>([]);

// 用于清理的变量
let rafId: number | null = null;
let viewboxWatcher: ReturnType<typeof createViewboxWatcher> | null = null;
let canvasInstance: ReturnType<typeof SVG> | null = null;

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

  canvasInstance = canvas;

  // 初始绘制网格
  showAxis(canvas);

  // 绘制视图边框
  showView(canvas, "cyan", 0.5);

  // 创建视图变化监听器
  viewboxWatcher = createViewboxWatcher(canvas);

  // 使用 requestAnimationFrame 定期检查 viewbox 变化
  const tick = () => {
    if (viewboxWatcher) {
      viewboxWatcher.check();
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  // 监听鼠标和滚轮事件，立即检查变化
  canvas.on("mousemove", viewboxWatcher.check);
  canvas.on("wheel", viewboxWatcher.check);

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

  // 组件卸载时清理
  onUnmounted(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (viewboxWatcher) {
      viewboxWatcher.cleanup();
      if (canvasInstance) {
        canvasInstance.off("mousemove", viewboxWatcher.check);
        canvasInstance.off("wheel", viewboxWatcher.check);
      }
    }
  });
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
