<template>
    <n-tree :data="treeData" />
</template>

<script setup lang="ts">
import { bus, ShapeEvent } from "@/utils/bus";
import { NTree } from "naive-ui";
import { ref } from 'vue';
import type { TreeOption } from 'naive-ui';
import type { ShapeNode } from "@/utils/scene";

const treeData = ref<TreeOption[]>([]);

/**
 * 将 ShapeNode 转换为 TreeOption
 * @param node ShapeNode 节点
 * @returns TreeOption 对象
 */
function convertNodeToTreeOption(node: ShapeNode): TreeOption {
  // 获取节点标签文本，优先使用 label，其次使用 shape 的 id
  const label = node.label?.text() || node.shape?.id() || '未命名节点';
  
  // 使用 shape 的 id 作为 key，如果没有则生成一个
  const key = node.shape?.id() || `node-${Date.now()}-${Math.random()}`;
  
  const treeOption: TreeOption = {
    key,
    label,
  };

  // 递归转换子节点
  if (node.children && node.children.length > 0) {
    treeOption.children = node.children.map(child => convertNodeToTreeOption(child));
  }

  return treeOption;
}

bus.on("outline", (event: ShapeEvent) => {
  const { node } = event;
  if (node) {
    // 将 ShapeNode 转换为 TreeOption 并更新 treeData
    treeData.value = [convertNodeToTreeOption(node)];
  } else {
    treeData.value = [];
  }
})
</script>

<style scoped>
</style>