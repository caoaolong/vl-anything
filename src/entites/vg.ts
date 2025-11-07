import { VectorGraphics } from "./vector_graphics";
import { Rect, Size } from "./rect";
import { Point } from "@svgdotjs/svg.js";
import type { Shape } from "@svgdotjs/svg.js";

const ConstantMapper: Record<string, any> = {
	"vector_graphics__position": new Point(0, 0),
	"rect__size": new Size(50, 50)
}

const shapeMapper: Record<string, (arg: any) => VectorGraphics> = {
	"rect": (arg: any) => new Rect(arg)
}

function FormatLabel(input: string): string {
	return input
		.split('_')                    // 按下划线分割
		.map(word =>
			word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)                              // 每个单词首字母大写
		.join(' ');                    // 用空格连接
}

function FormatClassName(input: string): string {
	return input
		.split('_')                    // 按下划线分割
		.map(word =>
			word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)                              // 每个单词首字母大写
		.join('');
}

function CreateShapeProps(shape: Shape, arg: any): VectorGraphics | null {
	const constructor = shapeMapper[shape.type];
	if (!constructor) return null;
	return constructor(arg);
}

function EntityProps(vg: VectorGraphics): Record<string, Record<string, any>> {
	const props: string[] = Object.getOwnPropertyNames(vg);
	const result: Record<string, Record<string, any>> = {};
	for (const prop of props) {
		let parts = prop.split("__");
		if (parts.length !== 2) {
			continue;
		}
		const [className, field] = parts;
		if (className && field) {
			// const displayClassName = formatLabel(className);
			if (!result[className]) {
				result[className] = {};
			}
			// const displayFieldName = formatLabel(field);
			result[className][field] = vg[prop as keyof VectorGraphics];
		}
	}
	return result;
}

function UpdateShape(shape: Shape, model: Record<string, any>) {
	const position: Point = model["vector_graphics__position"];
	const size: Size = model["rect__size"];
	if (position) shape.move(position.x, position.y);
	if (size) shape.size(size.width, size.height);
}

export { VectorGraphics, Rect, Size, EntityProps, FormatLabel, FormatClassName, CreateShapeProps, ConstantMapper, UpdateShape };