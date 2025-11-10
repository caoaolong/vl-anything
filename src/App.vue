<script setup lang="ts">
import { ref, watch } from "vue";
import { DockviewVue } from "dockview-vue";
import { NMenu, NConfigProvider, darkTheme, NFlex, NButton, NButtonGroup, NDivider } from "naive-ui";
import type { DockviewApi, DockviewReadyEvent, DockviewTheme } from "dockview-vue";
import { alignItems, shapeItems } from "@/utils/tools";

const theme = ref<DockviewTheme>({
  name: "dark",
  className: "dockview-theme-dark"
});

const api = ref<DockviewApi | null>(null);

const menuItems = ref([
  {
    label: "文件",
    key: "file"
  },
  {
    label: "编辑",
    key: "edit"
  },
  {
    label: "视图",
    key: "view"
  },
  {
    label: "帮助",
    key: "help"
  }
]);

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
    title: "Scene"
  });
};

const onReady = (event: DockviewReadyEvent) => {
  api.value = event.api;
  loadLayout();
};
</script>

<template>
  <n-config-provider :theme="darkTheme" class="app-container">
    <n-menu :options="menuItems" mode="horizontal"></n-menu>
    <n-flex size="small">
      <n-button-group size="small">
        <n-button quaternary v-for="item in alignItems" :render-icon="item.icon">
        </n-button>
      </n-button-group>
      <n-divider vertical />
      <n-button-group size="small">
        <n-button quaternary v-for="item in shapeItems" :render-icon="item.icon">
        </n-button>
      </n-button-group>
    </n-flex>
    <DockviewVue @ready="onReady" class="dockview" :theme="theme"></DockviewVue>
  </n-config-provider>
</template>

<style scoped>
.dockview {
  width: 100%;
  height: 100%;
}

.app-container {
  width: 100%;
  height: 100%;
}
</style>
