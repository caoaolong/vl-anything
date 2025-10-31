<template>
  <div class="demo-page">
    <svg-viewer src="/demo.drawio.svg" width="100%" height="100%" />
  </div>
</template>

<script setup>
import SvgViewer from "@/components/SvgViewer/index.vue";
</script>

<style scoped>
.demo-page {
  width: 100%;
  height: calc(100vh - 64px - 48px);
  min-height: 600px;
  padding: 0;
  margin: -24px;
}
</style>
