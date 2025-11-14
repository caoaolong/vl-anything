import { VectorGraphics } from "./vector_graphics";
import { Rect, Size, Radius } from "./rect";
import { Point, Color } from "@svgdotjs/svg.js";
import type { Shape, Rect as RectShape } from "@svgdotjs/svg.js";
import { Transform } from "./vector_graphics";
import type { Text } from "@svgdotjs/svg.js";

const ConstantMapper: Record<string, any> = {
	"vector_graphics__label": "",
	"vector_graphics__transform": new Transform(new Point(1, 1), 0, new Point(0, 0)),
	"vector_graphics__position": new Point(0, 0),
	"vector_graphics__fill": new Color(255, 255, 255),
	"vector_graphics__stroke": new Color(0, 0, 0),
	"rect__size": new Size(50, 50),
	"rect__radius": new Radius(0, 0)
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
			result[className]![field] = vg[prop as keyof VectorGraphics];
		}
	}
	return result;
}

function UpdateShape(shape: Shape, label: Text, model: Record<string, any>) {
	label.text(model["vector_graphics__label"]).cx(shape.cx()).cy(shape.cy());

	const transform: Transform = model["vector_graphics__transform"];
	const position: Point = model["vector_graphics__position"];
	const size: Size = model["rect__size"];
	const radius: Radius = model["rect__radius"];
	const fill: string = model["vector_graphics__fill"];
	const stroke: string = model["vector_graphics__stroke"];
	if (position) shape.move(position.x, position.y);
	if (size) shape.size(size.width, size.height);
	if (radius) (shape as RectShape).radius(radius.rx, radius.ry);
	if (fill) shape.fill(fill);
	if (stroke) shape.stroke(stroke);
	if (transform) shape.transform({
		scaleX: transform.scale.x,
		scaleY: transform.scale.y,
		rotate: transform.rotate,
		translateX: transform.translate.x,
		translateY: transform.translate.y
	});
}

export { VectorGraphics, Rect, Size, Radius, EntityProps, FormatLabel, FormatClassName, CreateShapeProps, ConstantMapper, UpdateShape };