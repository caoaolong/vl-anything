import { VectorGraphics } from "./vector_graphics";
import { Rect } from "./rect";
import type { Shape } from "@svgdotjs/svg.js";

const ConstantMapper: Record<string, any> = {
	"vector_graphics__x": 0,
	"vector_graphics__y": 0,
	"rect__width": 50,
	"rect__height": 50
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

export { VectorGraphics, Rect, EntityProps, FormatLabel, CreateShapeProps, ConstantMapper };