import { SVG } from '@svgdotjs/svg.js'
import { gsap } from 'gsap'

export async function drawio_svg_load(container, url) {
	const response = await fetch(url)
	const text = await response.text()
	container.value.innerHTML = text
	const svgEl = container.value.querySelector('svg')
	if (svgEl) {
		return SVG(svgEl)
	}
	return null
}

// 放大
function zoom_in(node) {
	gsap.fromTo(node,
		{ scale: 1 },
		{ scale: 1.01, duration: 0.2, ease: "power1.inOut" }
	);
}

// 缩小
function zoom_out(node) {
	gsap.to(node, {
		scale: 1,
		duration: 0.2,
		ease: "power1.inOut"
	});
}

function is_empty_object(obj) {
	return (
		obj &&
		typeof obj === 'object' &&
		!Array.isArray(obj) &&
		Reflect.ownKeys(obj).length === 0
	);
}

function pick_color_from_theme_style(regex, str, theme = 'light') {
  const m = str.match(regex);
  if (!m) return str; // 不是 light-dark() 结构
  const light = m[1].trim();
  const dark  = m[2].trim();
  return theme === 'dark' ? dark : light;
}

// 主题适配
function theme_adapte(node, theme) {
	const style = node.css()
	if (is_empty_object(style)) return

	const result = {}
	const regex = /light-dark\(\s*((?:\([^)]*\)|[^,])*)\s*,\s*((?:\([^)]*\)|[^)])*)\s*\)/
	for (const [key, value] of Object.entries(style)) {
		const match = value.match(regex)
		if (match) {
			// match[1] 是 light 模式颜色, match[2] 是 dark 模式颜色
			result[key] = pick_color_from_theme_style(regex, value, theme)
			console.log(result[key])
		} else {
			// 如果不是 light-dark() 结构，直接使用原值
			result[key] = value;
		}
	}
	node.css(result)
}

export function drawio_svg_initialize(draw, theme) {
	theme = theme || "light"
	// 适配当前主题
	draw.find("*").each(node => {
		theme_adapte(node, theme)
	})

	draw.find('[data-cell-id*="button"]').each(button => {
		// 设置变换中心点为元素中心
		gsap.set(button.node, { transformOrigin: "center center" })

		// 添加鼠标事件
		button.node.addEventListener('mouseenter', function () { zoom_in(this) });
		button.node.addEventListener('mouseleave', function () { zoom_out(this) });
		button.node.addEventListener('mousedown', function () { zoom_out(this) });
		button.node.addEventListener('mouseup', function () { zoom_in(this) });

		// 设置样式
		button.addClass("vl-button")
	})

	// gsap.to(".vl-button", {
	//     rotation: 10
	// })
}