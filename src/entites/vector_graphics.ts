export class VectorGraphics {
	vector_graphics__x: number = 0;
	vector_graphics__y: number = 0;


	constructor(arg: any) {
		this.vector_graphics__x = arg.x || 0;
		this.vector_graphics__y = arg.y || 0;
	}
}