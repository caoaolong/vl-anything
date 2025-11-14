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

const root = ref<ShapeNode | null>(new ShapeNode("Scene1", null, null, true));

const handleClose = (name: string) => {
  scenePanels.value = scenePanels.value.filter(panel => panel !== name);
};

const handleAdd = () => {
  scenePanels.value.push('Scene' + (scenePanels.value.length + 1));
};

const createNode = (g: G, shape: Shape, label: Text | null) => {
  console.log(shape.cx(), shape.cy());
  label?.cx(shape.cx()).cy(shape.cy());
  const node = ShapeNode.fromGroup(g, shape, label);
  root.value?.addChild(node);
  bus.emit("outline", { node: root.value });
  return node;
}

// 标志位：用于防止程序更新时触发拖拽事件
const isUpdatingFromInspector = ref(false);

const updateLabel = (shape: Shape) => {
  const node = root.value?.getChild(shape.id());
  if (!node) return;
  const label = node.label;
  if (!label) return;
  label.cx(shape.cx()).cy(shape.cy());
};

const changeSelect = (shape: Shape) => {
  root.value?.children.forEach((node: ShapeNode) =>
    node.shape?.select(false).resize(false)
  );
  shape.select(true).resize(true);
}

const addShape = (g: G, shape: Shape, label: Text | null) => {
  const node = createNode(g, shape, label);

  shape.on("mousedown", function (this: Shape) {
    changeSelect(this);
    bus.emit("select", { node });
  });
  shape.on("dragmove", function (this: Shape) {
    updateLabel(this);
    // 如果是从检查器更新，不发送 update 事件
    if (!isUpdatingFromInspector.value) {
      bus.emit("update", { node });
    }
  });
  shape.on("resize", function (this: Shape) {
    updateLabel(this);
    // 如果是从检查器更新，不发送 update 事件
    if (!isUpdatingFromInspector.value) {
      bus.emit("update", { node });
    }
  });
};

bus.on("edit", (model: Record<string, any>) => {
  const id = model["vector_graphics__id"];
  if (!id) return;
  const node = root.value?.getChild(id);
  if (!node || !node.shape || !node.label) return;
  // 标记这是从检查器更新，不要触发 update 事件
  isUpdatingFromInspector.value = true;
  UpdateShape(node.shape, node.label, model);
  // 使用 setTimeout 确保更新完成后再重置标志位
  setTimeout(() => {
    isUpdatingFromInspector.value = false;
  }, 0);
});

bus.on("outlineSelect", (label: string) => {
  const node = root.value?.getChild(label);
  if (!node) return;
  changeSelect(node.shape as Shape);
  bus.emit("select", { node: node });
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
    root.value?.children.forEach((node: ShapeNode) => node.shape?.select(false));
  });

  const g1 = canvas.group();
  addShape(g1, g1.rect(50, 50).fill("#0f6").draggable(), g1.text("122"));

  const g2 = canvas.group();
  addShape(g2, g2.rect(50, 50).move(100, 100).fill("#f96").draggable(), g2.text("12123"));
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
