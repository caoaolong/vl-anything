import mitt from 'mitt'
import { ShapeNode } from "@/utils/scene";

export interface ShapeEvent {
  node: ShapeNode | null;
}

// 定义事件类型
type Events = {
  outlineSelect: string;
  select: ShapeEvent;
  update: ShapeEvent;
  edit: Record<string, any>;
  outline: ShapeEvent;
}

export const bus = mitt<Events>();