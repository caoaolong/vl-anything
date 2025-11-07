import { Point } from "@svgdotjs/svg.js"

export class VectorGraphics {
	vector_graphics__id: string = "";
	vector_graphics__position: Point = new Point(0, 0);
	constructor(arg: any) {
		this.vector_graphics__id = arg.id;
		this.vector_graphics__position = new Point(arg.x || 0, arg.y || 0);
	}

	update(attr: Record<string, any>) {
		if (attr.x !== undefined) {
			this.vector_graphics__position.x = attr.x;
		}
		if (attr.y !== undefined) {
			this.vector_graphics__position.y = attr.y;
		}
	}
}