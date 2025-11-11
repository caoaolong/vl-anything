import mitt from 'mitt'
import type { Shape, Text } from '@svgdotjs/svg.js'

export interface ShapeEvent {
  shape: Shape;
  label: Text;
}

// 定义事件类型
type Events = {
  select: ShapeEvent;
  update: ShapeEvent;
  edit: Record<string, any>;
}

export const bus = mitt<Events>();