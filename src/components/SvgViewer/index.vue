<template>
  <div
    class="svg-viewer"
    :style="{ width, height, backgroundColor: backgroundColor }"
    @wheel="handleWheel"
    @mousedown="handleMouseDown"
  >
    <div
      ref="container"
      class="svg-container"
      :style="{ transform: `translate(${x}px, ${y}px) scale(${scale})` }"
    >
      <!-- SVG会加载到这里 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { drawio_svg_load, drawio_svg_initialize } from "@/utils/loader";

const props = defineProps({
  src: { type: String, required: true },
  width: { type: String, default: "100%" },
  height: { type: String, default: "400px" },
});

const container = ref(null);
const x = ref(0);
const y = ref(0);
const scale = ref(1);
const draw = ref(null);

// 主题状态
const currentTheme = ref("light");

// 根据主题计算背景颜色
const backgroundColor = computed(() => {
  return currentTheme.value === "dark" ? "#1a1a1a" : "#fafbfc";
});

// 获取当前主题
function getCurrentTheme() {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark" ? "dark" : "light";
}

// 监听主题变化
function handleThemeChange() {
  currentTheme.value = getCurrentTheme();
}

// 鼠标平移
let isDragging = false;
let lastX = 0;
let lastY = 0;

function handleMouseDown(e) {
  // 只有中键或按住Ctrl/Cmd键时才平移
  if (e.button === 1 || e.metaKey || e.ctrlKey) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    e.preventDefault();
  }
}

function handleMouseMove(e) {
  if (isDragging) {
    x.value += e.clientX - lastX;
    y.value += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    e.preventDefault();
  }
}

function handleMouseUp() {
  isDragging = false;
}

// 滚轮缩放（按住Ctrl）
const handleWheel = (e) => {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();

  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  const newScale = Math.max(0.1, Math.min(10, scale.value * delta));

  // 以鼠标位置为中心缩放
  if (container.value) {
    const rect = container.value.parentElement?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const svgX = (mouseX - x.value) / scale.value;
      const svgY = (mouseY - y.value) / scale.value;

      x.value = mouseX - svgX * newScale;
      y.value = mouseY - svgY * newScale;
    }
  }

  scale.value = newScale;
};

// 加载SVG
async function loadSvg() {
  if (!container.value) return;
  draw.value = await drawio_svg_load(container, props.src);
  if (draw.value) {
    drawio_svg_initialize(draw.value, localStorage.getItem("theme"));

    // 初始居中显示
    setTimeout(() => {
      const svg = container.value?.querySelector("svg");
      if (svg && container.value?.parentElement) {
        const viewer = container.value.parentElement;
        const svgWidth = svg.viewBox?.baseVal?.width || svg.width?.baseVal?.value || 1000;
        const svgHeight =
          svg.viewBox?.baseVal?.height || svg.height?.baseVal?.value || 1000;
        const viewerWidth = viewer.clientWidth;
        const viewerHeight = viewer.clientHeight;

        // 计算合适的初始缩放
        const fitScale = Math.min(viewerWidth / svgWidth, viewerHeight / svgHeight) * 0.9;
        scale.value = fitScale;

        // 居中
        x.value = (viewerWidth - svgWidth * fitScale) / 2;
        y.value = (viewerHeight - svgHeight * fitScale) / 2;
      }
    }, 100);
  }
}

let themeCheckInterval = null;

onMounted(() => {
  // 初始化主题
  currentTheme.value = getCurrentTheme();

  // 监听localStorage变化（主题切换）
  window.addEventListener("storage", handleThemeChange);

  // 监听自定义主题变化事件（如果通过代码切换主题）
  const checkTheme = async () => {
    const newTheme = getCurrentTheme()
    if (newTheme !== currentTheme.value) {
      currentTheme.value = newTheme
	  await loadSvg()
    }
  };
  // 定期检查主题变化（用于同一页面内的主题切换）
  themeCheckInterval = setInterval(checkTheme, 200);

  loadSvg();

  // 全局鼠标事件用于平移
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
});

watch(
  () => props.src,
  () => {
    loadSvg();
  }
);

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  window.removeEventListener("storage", handleThemeChange);
  if (themeCheckInterval) {
    clearInterval(themeCheckInterval);
  }
});
</script>

<style scoped>
.svg-viewer {
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.svg-container {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
}

.svg-container :deep(svg) {
  display: block;
}
</style>
