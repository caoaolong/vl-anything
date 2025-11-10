<template>
  <n-grid :x-gap="12" :cols="2" :y-gap="10">
    <n-gi :span="2" class="vl-inspector-subtitle">
      <span>Scale</span>
    </n-gi>
    <n-gi>
      <n-input-number v-model:value="model.scale.x" :format="formatFloatValue" round />
    </n-gi>
    <n-gi>
      <n-input-number v-model:value="model.scale.y" :format="formatFloatValue" round />
    </n-gi>
    <n-gi :span="2" class="vl-inspector-subtitle">
      <span>Translate</span>
    </n-gi>
    <n-gi>
      <n-input-number v-model:value="model.translate.x" :format="formatFloatValue" round />
    </n-gi>
    <n-gi>
      <n-input-number v-model:value="model.translate.y" :format="formatFloatValue" round />
    </n-gi>
    <n-gi :span="2" class="vl-inspector-subtitle">
      <span>Rotate</span>
    </n-gi>
    <n-gi :span="2">
      <n-slider v-model:value="model.rotate" :step="1" :min="0" :max="360" :marks="marks" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi, NInputNumber, NSlider } from "naive-ui";
import { computed } from "vue";

interface TransformModel {
  scale: {
    x: number;
    y: number;
  };
  translate: {
    x: number;
    y: number;
  };
  rotate: number;
}

interface Props {
  model: TransformModel;
  formatFloatValue: (value: number | null) => string;
}

const marks = computed(() => {
  return {
    0: "0°",
    180: "180°",
    360: "360°"
  };
});

defineProps<Props>();
</script>

<style scoped>
.vl-inspector-subtitle {
  text-align: left;
}
</style>

