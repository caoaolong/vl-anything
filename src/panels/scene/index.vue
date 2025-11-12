<template>
  <div id="svg-container"></div>
</template>

<script setup lang="ts">
import { SVG } from "@svgdotjs/svg.js";
import { Shape, G } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.resize.js";
import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.draggable.js";
import "@svgdotjs/svg.panzoom.js";
import { onMounted, ref } from "vue";
import { bus } from "@/utils/bus";
import { showAxis, showView } from "@/utils/scene";
import { UpdateShape } from "@/entites/vg";
import { Text } from "@svgdotjs/svg.js";
import { gsap } from "gsap";

const shapes = ref<Record<string, Shape>>({});
const labels = ref<Record<string, Text>>({});
// 标志位：用于防止程序更新时触发拖拽事件
const isUpdatingFromInspector = ref(false);

const updateLabel = (shape: Shape) => {
  const label = labels.value[shape.id()];
  if (!label) return;
  label.cx(shape.cx()).cy(shape.cy());
};

const addShape = (g: G, shape: Shape) => {
  shapes.value[shape.id()] = shape;
  const label = g.text("").fill("#fff");
  label.cx(shape.cx()).cy(shape.cy());
  labels.value[shape.id()] = label;
  shape.on("mousedown", function (this: Shape) {
    Object.values(shapes.value).forEach((shape: Shape) =>
      shape.select(false).resize(false)
    );
    this.select(true).resize(true);
    console.log(labels.value[this.id()]);
    bus.emit("select", { shape: this, label: labels.value[this.id()] });
  });
  shape.on("dragmove", function (this: Shape) {
    updateLabel(this);
    // 如果是从检查器更新，不发送 update 事件
    if (!isUpdatingFromInspector.value) {
      bus.emit("update", { shape: this, label: labels.value[this.id()] });
    }
  });
  shape.on("resize", function (this: Shape) {
    updateLabel(this);
    // 如果是从检查器更新，不发送 update 事件
    if (!isUpdatingFromInspector.value) {
      bus.emit("update", { shape: this, label: labels.value[this.id()] });
    }
  });
};

bus.on("edit", (model: Record<string, any>) => {
  const id = model["vector_graphics__id"];
  if (!id) return;
  const shape = shapes.value[id];
  if (!shape) return;
  const label = labels.value[id];
  // 标记这是从检查器更新，不要触发 update 事件
  isUpdatingFromInspector.value = true;
  UpdateShape(shape, label, model);
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

  // canvas.text("Label");

  // 初始绘制网格
  showAxis(canvas);
  // 绘制视图边框
  showView(canvas, "cyan", 0.5);

  canvas.on("mousedown", function (this: Shape) {
    Object.values(shapes.value).forEach((shape: Shape) => shape.select(false));
  });

  const g1 = canvas.group();
  addShape(g1, g1.rect(50, 50).fill("#0f6").draggable());

  //   gsap.to(g1, {
  //     duration: 2,
  //     delay: 1,
  //     repeat: -1,
  //     yoyo: false,
  //     ease: "power1.inOut",
  //     onUpdate: () => {
  //       const shape = shapes.value[g1.children()[0].id()];
  //       updateLabel(shape);
  //     },
  //     x: 1,
  //   });

  const g2 = canvas.group();
  addShape(g2, g2.rect(50, 50).move(100, 100).fill("#f96").draggable());
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
