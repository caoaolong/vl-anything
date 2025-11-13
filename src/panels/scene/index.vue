<template>
  <n-tabs v-model:value="activeTab" type="card" addable closable @close="handleClose" @add="handleAdd" size="small">
    <n-tab-pane v-for="panel in scenePanels" :key="panel" :name="panel">
      <div :id="'svg-container-' + panel"></div>
    </n-tab-pane>
  </n-tabs>
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
import { showAxis, showView, ShapeNode } from "@/utils/scene";
import { UpdateShape } from "@/entites/vg";
import type { Text } from "@svgdotjs/svg.js";
import { NTabs, NTabPane } from "naive-ui";

const activeTab = ref<string>('Scene1');
const scenePanels = ref<string[]>(['Scene1']);

const root = ref<ShapeNode | null>(new ShapeNode(null, null));
const nodes = ref<Record<string, ShapeNode>>({});

const handleClose = (name: string) => {
  console.log(name)
};

const handleAdd = () => {
  console.log('add')
};

const getNode = (shape: Shape, label: Text | null) => {
  const id = shape.id();
  if (!nodes.value[id]) {
    const node = new ShapeNode(shape, label);
    root.value?.addChild(node);
    bus.emit("outline", { node: root.value });
    nodes.value[id] = node;
  }
  return nodes.value[id];
};

// 标志位：用于防止程序更新时触发拖拽事件
const isUpdatingFromInspector = ref(false);

const updateLabel = (shape: Shape) => {
  const node = getNode(shape, null);
  const label = node.label;
  if (!label) return;
  label.cx(shape.cx()).cy(shape.cy());
};

const addShape = (g: G, shape: Shape) => {
  const node = getNode(shape, null);
  node.shape = shape;
  node.label = g.text("").fill("#fff").cx(shape.cx()).cy(shape.cy());

  shape.on("mousedown", function (this: Shape) {
    Object.values(nodes.value).forEach((node: ShapeNode) =>
      node.shape?.select(false).resize(false)
    );
    this.select(true).resize(true);
    bus.emit("select", { node: getNode(this, null) });
  });
  shape.on("dragmove", function (this: Shape) {
    updateLabel(this);
    // 如果是从检查器更新，不发送 update 事件
    if (!isUpdatingFromInspector.value) {
      bus.emit("update", { node: getNode(this, null) });
    }
  });
  shape.on("resize", function (this: Shape) {
    updateLabel(this);
    // 如果是从检查器更新，不发送 update 事件
    if (!isUpdatingFromInspector.value) {
      bus.emit("update", { node: getNode(this, null) });
    }
  });
};

bus.on("edit", (model: Record<string, any>) => {
  const id = model["vector_graphics__id"];
  if (!id) return;
  const node = nodes.value[id];
  if (!node || !node.shape || !node.label) return;
  // 标记这是从检查器更新，不要触发 update 事件
  isUpdatingFromInspector.value = true;
  UpdateShape(node.shape, node.label, model);
  // 使用 setTimeout 确保更新完成后再重置标志位
  setTimeout(() => {
    isUpdatingFromInspector.value = false;
  }, 0);
});

onMounted(() => {
  const canvas = SVG()
    .addTo("#svg-container-Scene1")
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
    Object.values(nodes.value).forEach((node: ShapeNode) => node.shape?.select(false));
  });

  const g1 = canvas.group();
  addShape(g1, g1.rect(50, 50).fill("#0f6").draggable());

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
