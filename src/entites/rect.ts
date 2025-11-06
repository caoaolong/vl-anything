import { VectorGraphics } from "./vector_graphics";

export class Rect extends VectorGraphics {
	rect__width: number = 0;
	rect__height: number = 0;

	constructor(arg: any) {
		super(arg);
		this.rect__width = arg.width || 50;
		this.rect__height = arg.height || 50;
	}
}