import { SVG } from '@svgdotjs/svg.js'

export async function load_drawio_svg(container, url) {
    const response = await fetch(url)
    const text = await response.text()
    container.value.innerHTML = text
    const svgEl = container.value.querySelector('svg')
    if (svgEl) {
        return SVG(svgEl)
    }
    return null
}