<template>
  <n-tree block-line draggable :data="treeData" :node-props="nodeProps" />
</template>

<script setup lang="ts">
import { bus, ShapeEvent } from "@/utils/bus";
import { NTree, createDiscreteApi, darkTheme, lightTheme, useOsTheme } from "naive-ui";
import { computed, ref } from "vue";
import type { TreeOption, ConfigProviderProps } from "naive-ui";
import type { ShapeNode } from "@/utils/scene";

const theme = useOsTheme();
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: theme.value === 'light' ? lightTheme : darkTheme
}))
const { message } = createDiscreteApi(["message"], {
  configProviderProps: configProviderPropsRef.value
});

const treeData = ref<TreeOption[]>([]);

/**
 * 将 ShapeNode 转换为 TreeOption
 * @param node ShapeNode 节点
 * @returns TreeOption 对象
 */
function convertNodeToTreeOption(node: ShapeNode): TreeOption {
  const treeOption: TreeOption = {
    key: node.id,
    label: node.id,
    children: [
      {
        key: node.shape?.id(),
        label: node.shape?.id()
      },
      {
        key: node.label?.id(),
        label: node.label?.id()
      }
    ]
  };

  // 递归转换子节点
  if (node.children && node.children.length > 0) {
    treeOption.children = node.children.map(child => convertNodeToTreeOption(child));
  }

  return treeOption;
}

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      bus.emit("outlineSelect", option.label || "");
      message.info(option.label as string);
    }
  };
};

bus.on("outline", (event: ShapeEvent) => {
  const { node } = event;
  if (node && node.scene) {
    // 将 ShapeNode 转换为 TreeOption 并更新 treeData
    treeData.value = [convertNodeToTreeOption(node)];
  } else {
    treeData.value = [];
  }
})
</script>

<style scoped>
:deep(.n-tree-node-content) {
  text-align: left;
}
</style>