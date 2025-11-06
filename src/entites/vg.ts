import { VectorGraphics } from "./vector_graphics";
import { Rect } from "./rect";

function FormatLabel(input: string): string {
	return input
		.split('_')                    // 按下划线分割
		.map(word =>
			word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)                              // 每个单词首字母大写
		.join(' ');                    // 用空格连接
}

function EntityProps(vg: VectorGraphics) {
	const props: string[] = Object.getOwnPropertyNames(vg);
	const result: Record<string, Record<string, any>> = {};
	for (const prop of props) {
		let parts = prop.split("__");
		if (parts.length !== 2) {
			console.warn(`Property ${prop} does not follow naming convention <className>__<propertyName>`);
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

export { VectorGraphics, Rect, EntityProps, FormatLabel };