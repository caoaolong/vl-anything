import { Point, Color } from "@svgdotjs/svg.js"

export class Transform {
	scale: Point = new Point(1, 1);
	rotate: number = 0;
	translate: Point = new Point(0, 0);
	constructor(scale: Point, rotate: number, translate: Point) {
		this.scale = scale;
		this.rotate = rotate;
		this.translate = translate;
	}
}

export class Action {
	frame: string = "";
	name: string = "";
	label: string = "";
}

export class VectorGraphics {
	vector_graphics__id: string = "";
	vector_graphics__label: string = "";
	vector_graphics__transform: Transform = new Transform(new Point(1, 1), 0, new Point(0, 0));
	vector_graphics__position: Point = new Point(0, 0);
	vector_graphics__fill: Color = new Color(255, 255, 255);
	vector_graphics__stroke: Color = new Color(0, 0, 0);
	vactor_graphics__actions: Action[] = [];
	constructor(arg: any) {
		this.vector_graphics__id = arg.id;
		this.vector_graphics__label = arg.label || "";
		this.vector_graphics__position = new Point(arg.x || 0, arg.y || 0);
		if (arg.fill !== undefined) {
			this.vector_graphics__fill = new Color(arg.fill);
		}
		if (arg.stroke !== undefined) {
			this.vector_graphics__stroke = new Color(arg.stroke);
		}
		if (arg.transform !== undefined) {
			this.vector_graphics__transform = new Transform(new Point(arg.transform.scaleX || 1, arg.transform.scaleY || 1), arg.transform.rotate || 0, new Point(arg.transform.translateX || 0, arg.transform.translateY || 0));
		}
	}

	update(attr: Record<string, any>) {
		if (attr.label !== undefined) {
			this.vector_graphics__label = attr.label;
		}
		if (attr.x !== undefined) {
			this.vector_graphics__position.x = attr.x;
		}
		if (attr.y !== undefined) {
			this.vector_graphics__position.y = attr.y;
		}
		if (attr.fill !== undefined) {
			this.vector_graphics__fill = new Color(attr.fill);
		}
		if (attr.stroke !== undefined) {
			this.vector_graphics__stroke = new Color(attr.stroke);
		}
		if (attr.transform !== undefined) {
			this.vector_graphics__transform.scale.x = attr.transform.scaleX || 1;
			this.vector_graphics__transform.scale.y = attr.transform.scaleY || 1;
			this.vector_graphics__transform.rotate = attr.transform.rotate || 0;
			this.vector_graphics__transform.translate.x = attr.transform.translateX || 0;
			this.vector_graphics__transform.translate.y = attr.transform.translateY || 0;
		}
	}
}