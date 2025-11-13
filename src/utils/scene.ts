import type { Svg } from "@svgdotjs/svg.js";
import { Text } from "@svgdotjs/svg.js";
import { Shape } from "@svgdotjs/svg.js";

export class ShapeNode {
  shape: Shape | null = null;
  label: Text | null = null;
  children: ShapeNode[] = [];
  constructor(shape: Shape | null, label: Text | null) {
    this.shape = shape;
    this.label = label;
  }

  addChild(child: ShapeNode) {
    this.children.push(child);
  }

  removeChild(child: ShapeNode) {
    this.children = this.children.filter(c => c !== child);
  }
}

/**
 * 清除现有的网格
 * @param canvas SVG 画布实例
 */
function clearGrid(canvas: Svg) {
  const gridRect = canvas.findOne("#grid-rect");
  const gridPattern = canvas.findOne("#grid-pattern");
  if (gridRect) gridRect.remove();
  if (gridPattern) gridPattern.remove();
}

/**
 * 在 SVG 画布上绘制网格（使用 Pattern）
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

  // 计算 pattern 的偏移，使网格线对齐到整数坐标
  const offsetX = x % cellX;
  const offsetY = y % cellY;

  // 创建 Pattern 定义
  const pattern = canvas
    .pattern(cellX, cellY, (add) => {
      // 绘制垂直网格线（在 pattern 的右边界）
      add.line(cellX, 0, cellX, cellY).stroke({ color: "#666", width: 0.5, opacity: 0.3 });
      // 绘制水平网格线（在 pattern 的下边界）
      add.line(0, cellY, cellX, cellY).stroke({ color: "#666", width: 0.5, opacity: 0.3 });
    })
    .id("grid-pattern");

  // 设置 pattern 的 transform 来对齐网格
  pattern.attr({
    patternTransform: `translate(${-offsetX}, ${-offsetY})`,
    patternUnits: "userSpaceOnUse",
  });

  // 创建一个大矩形填充整个可见区域，使用 pattern 填充，并移到最底层
  canvas
    .rect(width, height)
    .move(x, y)
    .id("grid-rect")
    .fill(pattern)
    .back();
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

  // 绘制 viewbox 边框矩形，并移到最上层确保可见
  canvas
    .rect(width, height)
    .move(x, y)
    .id("viewbox-border")
    .fill("none")
    .stroke({ color: strokeColor, width: strokeWidth })
    .front();
}