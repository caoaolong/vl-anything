import type { Svg } from "@svgdotjs/svg.js";

/**
 * 清除现有的网格
 * @param canvas SVG 画布实例
 */
function clearGrid(canvas: Svg) {
  const gridGroup = canvas.findOne("#grid-group");
  if (gridGroup) gridGroup.remove();
}

/**
 * 在 SVG 画布上绘制网格
 * @param canvas SVG 画布实例
 * @param cellX 网格单位宽度（X轴方向）
 * @param cellY 网格单位高度（Y轴方向）
 */
export function showAxis(canvas: Svg, cellX: number = 20, cellY: number = 20) {
  // 清除旧的网格
  clearGrid(canvas);

  // 获取画布的 viewbox 尺寸
  const viewbox = canvas.viewbox();
  const width = viewbox.width;
  const height = viewbox.height;
  const x = viewbox.x;
  const y = viewbox.y;

  // 创建网格组
  const gridGroup = canvas.group().id("grid-group");
  
  // 绘制垂直网格线
  const startX = Math.floor(x / cellX) * cellX;
  const endX = Math.ceil((x + width) / cellX) * cellX;
  for (let i = startX; i <= endX; i += cellX) {
    gridGroup
      .line(i, y, i, y + height)
      .stroke({ color: "#666", width: 0.5, opacity: 0.3 });
  }

  // 绘制水平网格线
  const startY = Math.floor(y / cellY) * cellY;
  const endY = Math.ceil((y + height) / cellY) * cellY;
  for (let i = startY; i <= endY; i += cellY) {
    gridGroup
      .line(x, i, x + width, i)
      .stroke({ color: "#666", width: 0.5, opacity: 0.3 });
  }

  // 将网格组移到最底层
  gridGroup.back();
}

/**
 * 创建视图变化监听器，用于在视图变化时自动更新网格
 * @param canvas SVG 画布实例
 * @returns 包含检查函数和清理函数的对象
 */
export function createViewboxWatcher(canvas: Svg) {
  let lastViewbox = { ...canvas.viewbox() };
  let updateTimer: number | null = null;

  const checkViewboxChange = () => {
    const currentViewbox = canvas.viewbox();
    // 检查 viewbox 是否发生变化
    if (
      currentViewbox.x !== lastViewbox.x ||
      currentViewbox.y !== lastViewbox.y ||
      currentViewbox.width !== lastViewbox.width ||
      currentViewbox.height !== lastViewbox.height
    ) {
      lastViewbox = { ...currentViewbox };
      // 使用防抖，避免频繁更新
      if (updateTimer) {
        clearTimeout(updateTimer);
      }
      updateTimer = window.setTimeout(() => {
        showAxis(canvas);
        updateTimer = null;
      }, 16); // 约 60fps
    }
  };

  const cleanup = () => {
    if (updateTimer !== null) {
      clearTimeout(updateTimer);
      updateTimer = null;
    }
  };

  return {
    check: checkViewboxChange,
    cleanup,
  };
}

/**
 * 显示 viewbox 的边框
 * @param canvas SVG 画布实例
 * @param strokeColor 边框颜色，默认为红色
 * @param strokeWidth 边框宽度，默认为 1
 */
export function showView(canvas: Svg, strokeColor: string = "#ff0000", strokeWidth: number = 1) {
  // 清除旧的 viewbox 边框
  const existingBorder = canvas.findOne("#viewbox-border");
  if (existingBorder) existingBorder.remove();

  // 获取画布的 viewbox 尺寸
  const viewbox = canvas.viewbox();
  const width = viewbox.width;
  const height = viewbox.height;
  const x = viewbox.x;
  const y = viewbox.y;

  // 绘制 viewbox 边框矩形
  const border = canvas
    .rect(width, height)
    .move(x, y)
    .id("viewbox-border")
    .fill("none")
    .stroke({ color: strokeColor, width: strokeWidth });

  // 将边框移到最上层，确保可见
  border.front();

  return border;
}

