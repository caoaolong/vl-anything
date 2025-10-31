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
        // 设置变换中心点为元素中心
        gsap.set(button.node, { transformOrigin: "center center" })

        button.node.addEventListener('mouseenter', () => {
            gsap.fromTo(button.node,
                { scale: 1 },
                { scale: 1.01, duration: 0.2, ease: "power1.inOut" }
            );
        });

        button.node.addEventListener('mouseleave', () => {
            gsap.to(button.node, {
                scale: 1,
                duration: 0.2,
                ease: "power1.inOut"
            });
        });

        button.addClass("vl-button")
    })

    // gsap.to(".vl-button", {
    //     rotation: 10
    // })
}