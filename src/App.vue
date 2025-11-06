<script setup lang="ts">
import { ref, watch } from "vue";
import { DockviewVue } from "dockview-vue";
import type { DockviewApi, DockviewReadyEvent } from "dockview-vue";
import type { Shape } from "@svgdotjs/svg.js";

const api = ref<DockviewApi | null>(null);

watch(api, (newApi) => {
  if (!newApi) return;
  const disposable = newApi.onDidLayoutChange(() => {
    const layout = newApi.toJSON();
    localStorage.setItem("dockview_persistence_layout", JSON.stringify(layout));
  });
  return () => disposable.dispose();
});

const loadLayout = () => {
  const layoutString = localStorage.getItem("dockview_persistence_layout");
  if (layoutString) {
    const layout = JSON.parse(layoutString);
    api.value?.fromJSON(layout);
    console.log(api.value?.panels);
    return;
  }

  api.value?.addPanel({
    id: "inspector",
    component: "InspectorPanel",
    title: "Inspector"
  });

  api.value?.addPanel({
    id: "scene",
    component: "ScenePanel",
    title: "Scene",
    params: {
      onSelect: (shape: Shape) => {
        console.log(shape);
      }
    }
  });
};

const onReady = (event: DockviewReadyEvent) => {
  api.value = event.api;
  loadLayout();
};
</script>

<template>
  <DockviewVue @ready="onReady" class="dockview-theme-abyss dockview"></DockviewVue>
</template>

<style scoped>
.dockview {
  width: 100%;
  height: 100%;
}
</style>
