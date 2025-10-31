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

export function drawio_svg_initialize(draw) {
	draw.find('[data-cell-id*="button"]').each(button => {
		button.addClass("vl-button")
	})

	gsap.to(".vl-button", {
		rotation: 10
	})
}