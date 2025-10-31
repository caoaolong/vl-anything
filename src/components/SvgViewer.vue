<template>
  <div class="svg-viewer-root" :style="{ width, height, position: 'relative' }">
    <div
      ref="svgWrapper"
      class="svg-viewer-wrapper"
      :style="{ width: '100%', height: '100%' }"
    ></div>
    <div v-if="minimapReady" class="svg-minimap">
      <svg :width="minimapSize" :height="minimapSize">
        <g v-html="minimapSvg" />
        <rect
          :x="minimapViewport.x"
          :y="minimapViewport.y"
          :width="minimapViewport.width"
          :height="minimapViewport.height"
          fill="none"
          stroke="#1abc9c"
          stroke-width="2"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import svgPanZoom from "svg-pan-zoom";

const props = defineProps({
  src: { type: String, required: true },
  width: { type: String, default: "100%" },
  height: { type: String, default: "400px" },
});

const svgWrapper = ref(null);
const panZoomInstance = ref(null);
const minimapReady = ref(false);
const minimapSvg = ref("");
const minimapViewport = ref({ x: 0, y: 0, width: 0, height: 0 });
const minimapSize = 120;

function updateMinimap() {
  if (!panZoomInstance.value) return;
  const svgEl = svgWrapper.value.querySelector("svg");
  if (!svgEl) return;
  // 复制 SVG 内容
  minimapSvg.value = svgEl.outerHTML;
  // 计算视野框
  const realW = svgEl.viewBox.baseVal.width || svgEl.width.baseVal.value;
  const realH = svgEl.viewBox.baseVal.height || svgEl.height.baseVal.value;
  const zoom = panZoomInstance.value.getZoom();
  const pan = panZoomInstance.value.getPan();
  // 计算当前视野在 minimap 上的位置和大小
  minimapViewport.value = {
    x: Math.max(0, (-pan.x / zoom) * (minimapSize / realW)),
    y: Math.max(0, (-pan.y / zoom) * (minimapSize / realH)),
    width: minimapSize / zoom,
    height: minimapSize / zoom,
  };
  minimapReady.value = true;
}

onMounted(async () => {
  // 使用 loader.js 的加载与初始化
  const { drawio_svg_load, drawio_svg_initialize } = await import("@/utils/loader.js");
  await nextTick(); // 确保 svgContainer 已挂载
  const draw = await drawio_svg_load(svgWrapper, props.src);
  await nextTick();
  const svgEl = svgWrapper.value.querySelector("svg");
  if (svgEl) {
    panZoomInstance.value = svgPanZoom(svgEl, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      minZoom: 0.2,
      maxZoom: 10,
    });
    svgEl.addEventListener("pan", updateMinimap);
    svgEl.addEventListener("zoom", updateMinimap);
    updateMinimap();
    if (draw) drawio_svg_initialize(draw);
  }
});

watch(
  () => props.src,
  async (newSrc) => {
    // 支持切换 SVG
    const { drawio_svg_load, drawio_svg_initialize } = await import("@/utils/loader.js");
    const draw = await drawio_svg_load(svgWrapper, newSrc);
    await nextTick();
    const svgEl = svgWrapper.value.querySelector("svg");
    if (svgEl) {
      panZoomInstance.value = svgPanZoom(svgEl, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 0.2,
        maxZoom: 10,
      });
      svgEl.addEventListener("pan", updateMinimap);
      svgEl.addEventListener("zoom", updateMinimap);
      updateMinimap();
      if (draw) drawio_svg_initialize(draw);
    }
  }
);
</script>

<style scoped>
.svg-viewer-root {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.svg-viewer-wrapper {
  width: 100%;
  height: 100%;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e0e0e6;
}
.svg-minimap {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 120px;
  height: 120px;
  background: #fff;
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
  overflow: hidden;
}
</style>
