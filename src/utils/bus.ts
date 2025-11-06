import mitt from 'mitt'
import type { Shape } from '@svgdotjs/svg.js'

// 定义事件类型
type Events = {
  select: Shape;
}

export const bus = mitt<Events>();