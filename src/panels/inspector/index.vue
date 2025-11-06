<template>
  <n-config-provider :theme="darkTheme">
    <n-collapse>
      <n-collapse-item title="Inspector Panel" name="1">
        <div>This is the inspector panel content.</div>
      </n-collapse-item>
    </n-collapse>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem, NConfigProvider, darkTheme } from "naive-ui";
import { onMounted } from "vue";
import { VectorGraphics, Rect, EntityProps } from "@/entites/vg";

onMounted(() => {
	var vg = new VectorGraphics();
	console.log(EntityProps(vg));

	var rect = new Rect();
	console.log(EntityProps(rect));
})
</script>