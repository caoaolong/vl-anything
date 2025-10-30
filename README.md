## VL-Anything — 基于 draw.io + HTML/CSS/JS 的课件框架

一份轻量的课件/演示框架，使用 draw.io 绘制幻灯（导出为 SVG），并通过原生 HTML/CSS/JS（以及少量第三方库：SVG.js、GSAP、jQuery UI）把 SVG 嵌入页面并添加交互与动画。适合制作交互式课件、教学演示与可动化的静态幻灯。

## 主要特性
- 以 draw.io 作为编辑器，直接把导出的 SVG 嵌入网页作为幻灯内容。
- 使用 `data-cell-id`（或 SVG 中的 id/class）快速选取图形元素并绑定事件。
- 集成 GSAP（动画）与 SVG.js（SVG 操作）以实现平滑动画与 DOM 操作。
- 无需构建工具，直接打开 HTML 或通过本地静态服务器运行。

## 项目结构（工作区摘录）

- `demo.drawio.svg` — 使用 draw.io 导出的示例 SVG（在根目录）。
- `demo.html`（根目录）— 示例页面（已做过一个修复用于正确加载 CSS）。
- `example/demo.html` — 另一个示例，包含 jQuery UI 对话框和演示动画。
- `css/gsap.css` — 主题样式与控件样式。
- `js/gsap.min.js`、`js/svg.min.js` — 第三方库（GSAP、SVG.js）。
- `jquery-ui/`、`font/` 等文件夹 — 用于示例 UI（可选）。

（注意：项目根目录下可能包含多个示例，请根据需要打开对应的 `demo.html`。）

## 快速开始

1. 克隆或下载本仓库到本地（假设路径为 `d:\project\vl-anything`）。
2. 推荐通过一个本地静态服务器运行（以避免浏览器的本地文件跨域或 fetch 限制）：

PowerShell 示例（项目根目录下运行）：

```powershell
Set-Location 'd:\project\vl-anything'
# 如果你安装了 Python 3:
python -m http.server 8000
# 然后在浏览器打开: http://localhost:8000/demo.html 或 http://localhost:8000/example/demo.html
```

3. 或者直接双击 `demo.html` 打开（某些浏览器对本地 fetch 跨域有限制，推荐使用服务器方式）。

## 使用说明（把 draw.io SVG 变成可交互幻灯）

1. 在 draw.io 中设计幻灯内容。
2. 给你想要交互的元素添加自定义属性或 id（例如 `data-cell-id="button"` 或 `id="next-btn"`）。
3. 导出为 SVG 文件（File → Export → SVG），并把文件放到本项目根目录（例如 `demo.drawio.svg`）。
4. 在页面（如 `demo.html` 或 `example/demo.html`）中通过 fetch 加载该 SVG，然后插入到容器：

```js
const response = await fetch('/demo.drawio.svg')
const text = await response.text()
document.getElementById('container').innerHTML = text

const draw = SVG('#container svg')
const button = draw.findOne('[data-cell-id="button"]')
button.on('click', () => { /* 你的逻辑 */ })
```

5. 用 GSAP 做动画，例如：

```js
gsap.to('.box', { x: 200, duration: 1 })
```

## 关键点与建议
- link 标签的 `type` 请使用 `type="text/css"` 或直接省略（现代浏览器默认识别）。
- 在 HTML 中使用绝对路径（以 `/` 开头）或相对路径时要注意运行方式：直接从文件系统打开时 `fetch('/demo.drawio.svg')` 会失败，推荐使用本地服务器。
- 避免在 id 中使用空格（例如 `id="box green"` 会导致选择器或脚本异常）。如需多个类，请使用 `class="box green"`。
- draw.io 导出的 SVG 有时会包含大量嵌入样式或脚本，建议检查并清理不必要的元数据以减小体积并避免冲突。

## 常见问题排查
- “样式没有生效”：检查 `link` 标签路径与 `type` 是否正确，清缓存或启用 DevTools → Network → Disable cache，然后刷新。
- “fetch 加载 SVG 返回 404”：确认路径正确，且运行在支持静态资源的服务器上（如上面的 python server）。
- “选择不到元素”：确认在 SVG 中该元素存在 `id` 或 `data-cell-id`，并且脚本在插入 SVG 后执行（可在 `DOMContentLoaded` 或 fetch 成功后执行绑定）。

## 可扩展的方向（建议）
- 为每一页/幻灯片添加导航控制（next/prev），并在 SVG 内部分组以实现页间动画。
- 将常用交互封装为小型模块（例如 `slides.js`）以便复用。
- 添加单元测试或示例数据集以便教学演示模板复用。

## 许可证
请在本仓库新增 LICENSE 文件并记录项目许可。当前 README 不包含具体版权声明，请根据需要添加（例如 MIT、Apache-2.0 等）。

---

如果你希望，我可以：
- 把 `link` 标签中的 `type` 移除并把 CSS link 放到 `<head>` 更靠前（避免闪烁）；
- 帮你把 `example/demo.html` 中的资源路径调整为相对路径以方便直接打开文件而不启用服务器；
- 或者我可以启动本地静态服务器并在终端中帮你确认 `gsap.css` 是否成功加载（需要我运行命令）。

告诉我你接下来希望我帮你做哪一项。
