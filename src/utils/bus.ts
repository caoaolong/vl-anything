import mitt from 'mitt'
import type { Shape } from '@svgdotjs/svg.js'

// 定义事件类型
type Events = {
  select: Shape;
  update: Shape;
  edit: Record<string, any>;
}

export const bus = mitt<Events>();