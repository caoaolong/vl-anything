import { VectorGraphics } from "./vector_graphics";

export class Size {
	width: number = 0;
	height: number = 0;
	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}
}

export class Radius {
	rx: number = 0;
	ry: number = 0;
	constructor(rx: number, ry: number) {
		this.rx = rx;
		this.ry = ry;
	}
}

export class Rect extends VectorGraphics {
	rect__size: Size = new Size(0, 0);
	rect__radius: Radius = new Radius(0, 0);

	constructor(arg: any) {
		super(arg);
		this.rect__size = new Size(arg.width || 50, arg.height || 50);
	}

	update(attr: Record<string, any>) {
		super.update(attr);
		if (attr.width !== undefined) {
			this.rect__size.width = attr.width;
		}
		if (attr.height !== undefined) {
			this.rect__size.height = attr.height;
		}
		if (attr.rx !== undefined) {
			this.rect__radius.rx = attr.rx;
		}
		if (attr.ry !== undefined) {
			this.rect__radius.ry = attr.ry;
		}
	}
}