<template>
  <n-grid :x-gap="12" :cols="12">
    <n-gi :span="1">
      <div v-if="currentShape">
        {{ currentShape?.id() }}
      </div>
    </n-gi>
    <n-gi :span="11">
      <n-table size="small" v-if="currentShape">
        <thead>
          <tr>
            <th width="120px">轨道</th>
            <th>动画序列</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              点击
            </td>
            <td>
              <n-space>
                <n-button>HELLO</n-button>
                <n-button>HELLO</n-button>
                <n-button>HELLO</n-button>
              </n-space>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NTable, NGrid, NGi, NButton, NSpace } from 'naive-ui';
import { bus, ShapeEvent } from "@/utils/bus";
import type { Shape } from '@svgdotjs/svg.js';
import { ref } from 'vue';

const currentShape = ref<Shape | null>(null);

bus.on("select", (event: ShapeEvent) => {
  currentShape.value = event.shape;
})
</script>

<style scoped>
</style>