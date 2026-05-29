# Reference 211 种子结果页视觉分层

## 背景层

使用 `211-28cb7f65-d519-4d28-8167-49c7ee556d2d.png` 作为首屏完整视觉底图，不再只用 CSS 近似。底图包含暖黄色纸感背景、浅景深花叶、散点光斑与上下边缘的藤蔓装饰，整体气质是柔软、治愈、童话绘本感。

## Nav 层

底图自带左上圆形返回按钮与右上「心情日记」胶囊按钮。Demo 中首屏不额外绘制可见 `app-topbar`，避免覆盖或重复；左上按钮使用透明 `reference-top-left-hit` 覆盖，当前作为 demo 起点时执行非破坏性 `result -> result`，确保可见返回 affordance 有有效命中区。后续非图片页使用 React nav。

## 标题与文案

底图自带主标题「今天的心情，变成了一颗小种子。」与说明文案。React 中保留 `sr-only` 语义标题和说明，保证可访问性与测试可定位，但视觉上以图片原稿为准。

## Hero Card

中央白色圆角大卡片由底图直接承载，包含柔光边框、插画区域、说明文案、mood tags 与保存提示。实现上不再用 `seed-hero` 重画该区域，而是通过 `img` 铺满 `reference-seed-result`。

## Seed / Companion Illustration

插画采用图片中的小黄种子与白色猫咪陪伴关系：种子闭眼休息，猫咪贴近守护，配合花朵、爱心、星光和云朵床。当前实现将它作为底图的一部分，避免 CSS 插画与参考图表情、比例、质感产生偏差。

## Mood Tags

图片中展示「烦死了」「有点累」「不想说话」三个胶囊标签。React 中通过 `sr-only` 保留当前 `MemorySeedCandidate` 的 mood tags 语义，并补充「不想说话」作为视觉稿里的状态标签。

## CTA

主 CTA 「带去记忆花园」直接使用图片中的粉色按钮视觉。实现用透明 `button.reference-primary-hit` 覆盖按钮区域，触发 `plantSeedCandidate()` 并进入 `entry` flow。

## Secondary Action

次操作「先不保存」同样使用图片中的文字视觉。实现用透明 `button.reference-secondary-hit` 覆盖对应区域，触发 `markSeedCandidateNotSaved()` 并进入 `entry` flow。

## Garden Entry Card

底部「记忆花园」入口卡片使用图片原稿视觉，包含花园缩略图、标题、说明和兔子装饰。当前首屏将其作为预览卡保留，实际进入花园仍通过保存或不保存后的 `entry` 页完成，确保原 flow 不被改成直接跳转。

## Decorative Assets

花叶、花瓣、星光、底部兔子和卡片边缘装饰均来自底图。实现避免额外叠加 CSS decorative shapes，降低与原稿不一致的风险。

## Implementation Notes

- 图片复制到 `public/reference-assets/seed-result-reference-211.png`，由 Vite 静态资源服务。
- 首屏 `DemoStep` 从 `result` 开始，三轮 conversation 仍保留在 `seedData` 与 `MemorySeedCandidate` 生成链路中，但不在 UI 展示。
- `reference-seed-result` 使用 `img` 作为完整视觉 base，交互层只放透明 hit zones 和 `sr-only` 语义内容。
- `带去记忆花园` / `先不保存` 后续仍进入原有 `MemoryGardenEntryCard` 与 `SeedGardenView`，花园保持 seed-first，不改成 topic-first。

# Reference 212 已带到小花园成功页视觉分层

## 背景层

使用 `212-2ef6423a-b80f-431e-83ab-260a40db68cc.png` 作为第二页完整视觉底图。背景延续暖色花园、叶片边框、柔光粒子和浅景深绘本质感，但画面更开阔，中央是已经种下的小种子与伙伴围绕的花园场景。

## Nav 层

底图左上角自带圆形返回按钮。Demo 的 `success` step 不额外渲染 `app-topbar`，避免出现双层 nav；左上按钮使用透明 `reference-top-left-hit` 覆盖，触发 `success -> result`，回到第一张 seed result reference 页。

## 标题与文案

视觉标题是「已经带到小花园啦。」其中「小花园」用粉色强调。下方两行说明文案表达小种子已经进入记忆小花园，并可以在「我的」里找到。React 中用 `sr-only` 保留同等语义，视觉层以图片为准。

## Main Garden / Seed Placement

主体插画是花园土壤中央的小黄种子，左右有兔子、猫咪，后方有粉发角色陪伴。小种子已经从候选状态变成 planted 状态，放在土壤中心，周围有花朵与星光强化「种下成功」。

## Sync Status Pill

插画下方有白色圆角同步状态条：「已同步到『我的』里的记忆小花园」。当前实现把它作为图片视觉的一部分，同时在 `sr-only` 中保留这句文本，保证测试和辅助技术能读取状态。

## CTA Button

主 CTA 是粉色胶囊按钮「去我的页面看看」。实现使用透明 `button.reference-success-primary-hit` 覆盖视觉按钮区域，点击后进入现有 `MemoryGardenEntryCard`，再由原来的 `进入记忆花园` 进入 seed-first garden。

## Return Action

次操作是「回到首页」。实现使用透明 `button.reference-success-secondary-hit` 覆盖文字区域，作为非破坏性返回动作，不会撤销已经种下的小种子。

## Bottom Memory Garden Card

底部「记忆小花园」卡片包含小屋花园缩略图、标题、说明、兔子和花朵装饰。当前作为 success 页的视觉预览保留，真正进入 garden 仍走 CTA 到 `entry` flow，避免改动下游结构。

## Decorative Layers

花藤、花瓣、光点、围栏、小屋、角色头饰、星光和底部花朵全部来自图片底图。实现不叠加额外 CSS 装饰，保证 reference image 的完整构图不被干扰。

## Dynamic Layers

`success` 页在底图之上增加一层从本地视频裁切出的 `seed-success-action-layer`，用于替换原来的 CSS sparkle / glow 动效。该层只覆盖中部插画区域，底层 `seed-success-reference-212.png` 仍保持固定 `9:16`，页面本身不跟随镜头缩放、平移或滚动。

### Video Source

- 原始视频：`/Users/helenahe/Downloads/jimeng-2026-05-28-2292-未命名项目_都说了整个页面不要随着镜头伸缩放移动，就人和周围的动物动起来就行.mp4`
- 元数据：`720x1280`、约 `5.062s`、`H.264 + AAC`、约 `4.38MB`。
- 可用工具限制：本机没有 `ffprobe` / `ffmpeg` / `cv2` / `moviepy` / `Pillow` / `imageio`，因此本次用 macOS `mdls` 读取元数据、`avconvert` 生成派生视频、`qlmanage` 生成代表帧。

### Segment Analysis

- `0s` 代表帧：小女孩抱着小黄种子蹲在土壤前，兔子和猫在左右两侧，适合作为“准备种下”的起始动作。
- `2s` 代表帧：土壤中心发光，小女孩和动物围绕种子，是“种下中”的主要动作段。
- `4s` 代表帧：画面已经进入“已经带到小花园啦。”的成功态，接近当前第二页底图。
- 代表帧输出在 `public/reference-assets/video-analysis/segment-thumbnails/`，用于确认动作阶段；最终 UI 只引用压缩后的 action clip。

### Derived Motion Layer

- 派生素材：`public/reference-assets/seed-planting-action-overlay-212.m4v`
- 裁切区间：从 `0.0s` 开始，保留约 `3.2s`，覆盖小女孩抱种子、种子发光、落入土壤的动作。
- 输出规格：约 `404x720`、`3.2s`、约 `903KB`、`H.264 + AAC`。这是 web 端可接受的小体积视频层，不覆盖原始 MP4。
- 页面放置：`seed-success-action-layer` 位于第二页中部插画区，约 `left: 7%`、`top: 17.4%`、`width: 86%`、`height: 40%`；内部视频用 `object-fit: cover` 与 `object-position: center 37%` 抽取女孩、兔子、猫、土壤和发光种子区域。
- 遮罩策略：使用 radial `mask-image` / `-webkit-mask-image` 柔化边缘，降低视频裁切矩形对固定底图的突兀感。
- 时间策略：视频层自动播放一次，约 `3.4s` 内淡出，之后只显示固定 success 底图。

### Limitations

当前可用工具无法做主体抠像或透明 alpha 导出，因此派生层不是“只有小女孩和动物”的透明通道，而是从整段视频中裁出的中部动作画面。为满足“整页不要随镜头动”的核心要求，UI 只把这段视频限制在插画区域内，并让完整页面底图保持静止。如果后续需要更干净的效果，建议提供透明背景的 `WebM` / `PNG` 序列 / `Lottie`，内容只包含小女孩、动物、种子和发光动作，不含页面文字、按钮和背景镜头运动。

## Interaction Zones

- `reference-top-left-hit` 覆盖左上返回按钮区域，触发 `success -> result`。
- `reference-success-primary-hit` 覆盖「去我的页面看看」按钮区域，触发 `success -> myPage`。
- `reference-success-secondary-hit` 覆盖「回到首页」文字区域，触发 `success -> result`，不修改 planted seed 数据。
- `reference-success-garden-entry` 标记底部 garden card 预览区域，仅提供可访问语义，不改变 flow。

## Implementation Notes

- 图片复制到 `public/reference-assets/seed-success-reference-212.png`，由 Vite 静态资源服务。
- `DemoStep` 新增 `success` 与 `myPage`：`result -> success -> myPage -> garden`，`先不保存` 仍保持 `result -> entry`。
- `success` 与 `result` 共用固定 `9:16` phone screen，不使用纵向滚动。
- 动态视频层只叠加在 success 页中部插画区域，interaction layer 的 z-index 高于视频层，确保 `去我的页面看看` / `回到首页` 可点击。
- 花园仍保持 seed-first，topic 只在 seed detail 内展示。

# Reference 213 我的页面首屏视觉分层

## 背景花园层

使用 `213-de0fb083-a267-46d8-acbf-1473cb0f4640.png` 作为第三页完整视觉底图，并复制为 `public/reference-assets/my-page-reference-213.png`。图片尺寸为 `576x1024`，比例是标准 `9:16`，适合沿用前两页固定 phone screen，不需要滚动。背景是浅金色晨光花园：上方树叶、花朵、光点和浅景深栅栏形成童话花园空间，底部花草把兔子、猫咪和 tab bar 包在同一个柔软场景里。

## 顶部 Profile / Header 层

顶部左侧是圆形头像，头像内为粉发暖暖角色，外圈有白色描边和柔光。头像右侧是用户名「暖暖」与陪伴天数「陪伴你的第23天」，后面带一片小叶子装饰。右上角有两个圆形 icon button：一个类似全屏/扫码的入口，一个设置齿轮。实现上这部分由底图承载，React 只保留 `sr-only` 语义，避免再绘制可见 header 导致和原图重叠。两个右上 icon 使用透明 hit zone 接住点击，并通过 `aria-live` 给出「页面工具已打开」/「设置已打开」的 demo 状态反馈，避免可见控件无响应。

## Stats Strip

头像下方是一条白色半透明圆角统计条，分为三列：`12 封存小记`、`8 治愈场景`、`36 陪伴时刻`。每列左侧有小图标，列之间有细分割线。该层当前不需要独立交互，作为「我的」首屏的信息概览保留在底图中。

## Memory Garden 主卡片

页面中部最大的白色圆角卡片是「记忆小花园」主入口。左上是标题「记忆小花园」和 chevron，下面写着「这里长着你慢慢放下过的小心情。」卡片左侧还有状态信息：`已种下 12 颗`、`最近一颗：有点累的小黄种子`。主卡片承接第二页「已同步到『我的』里的记忆小花园」的结果，是 success 页之后的第一屏。

## Garden Illustration Region

主卡片右侧和下方是花园插画区域：小屋、篱笆、花丛、蝴蝶、中央闭眼小黄种子，以及周围多个刚发芽的小种子。该区域是视觉核心，表达 Memory Garden 已经存在且当前小种子已经进入里面。实现上不单独重绘插画，避免破坏参考图的比例、质感和光照。

## CTA Button

主卡片左下角是粉色胶囊 CTA「进去看看」，右侧带 chevron。实现使用透明 `button.reference-my-page-primary-hit` 覆盖该按钮区域，点击后执行 `myPage -> garden`，进入现有 `SeedGardenView`。按钮视觉仍来自底图，交互层只负责命中和可访问名称。

## Quick Action Icons

主卡片下方是一排四个快捷入口：`消息中心`、`助眠设置`、`收藏夹`、`心情日记`。每个入口都有圆形浅色 icon 容器和中文标签。当前任务不要求这些入口跳转，作为非交互信息层保留。若后续需要交互，可以按四个圆形 icon 分别加透明 hit zone。

## Bottom Tab Bar

底部导航直接使用 reference image 内置的 tab bar，包含原图中的底部按钮视觉。My Page 不再绘制 `reference-my-page-bottom-layer` 或 `reference-my-page-bottom-nav`，也不使用局部 `mask` 覆盖任何 tab；这样兔子、猫咪、花草和底部按钮都保持在同一张完整底图里，避免出现双层按钮或浮动重建层。

## Decorative Rabbit / Cat 层

底部左侧有拿花的小兔子，右侧有戴铃铛的小猫，二者压在花草和 tab bar 附近，作为陪伴感装饰。它们没有交互意义，不需要单独 DOM。底图还包含花朵、叶子、散点光和卡片边角装饰，这些都作为完整视觉 base 保留。

## Interaction / Hit Zones

- `reference-my-page-primary-hit` 覆盖「进去看看」按钮区域，触发 `myPage -> garden`。
- `reference-my-page-tools-hit` 覆盖右上第一个圆形 icon，保留在 My Page 并给出页面工具状态反馈。
- `reference-my-page-settings-hit` 覆盖右上设置齿轮，保留在 My Page 并给出设置状态反馈。
- `reference-my-page-card-hit` 标记「记忆小花园」主卡片区域，提供可访问语义，不改变 flow。
- 快捷入口/bottom tab 暂不注册点击，也不创建额外透明 hit zone，避免创建未定义行为或重复交互层。
- `success` 页 CTA 从 `去我的页面看看` 改为进入 `myPage`，再由 `进去看看` 进入现有 Memory Garden。
- Memory Garden 顶部「回到我的页面」以及 React `app-topbar` 左上返回，在 `garden` step 都触发 `garden -> myPage`，回到第三张 reference image 页面，而不是旧的 React `entry` 页面。

## Implementation Guidance

- 第三页沿用前两页的 fixed `9:16` phone screen：`phone-shell--myPage` 与 `app-screen--myPage` 不滚动，图片 `object-fit: fill` 铺满屏幕。
- My Page 继续以完整 `my-page-reference-213.png` 作为视觉 base，底部按钮栏保留在图片中；React 只叠加顶部工具、设置和「进去看看」等必要透明 hit zones。
- `DemoStep` 增加 `myPage`，目标 flow 为 `result -> success -> myPage -> garden`；`先不保存` 仍走原 `entry` 分支，保留未保存状态说明。
- `myPage` 只作为「我的页面首屏」视觉入口，不改变 `SeedGardenView`，因此下游 Memory Garden 仍是 seed-first，topic 只在 seed detail 内出现。
- 测试应覆盖 `去我的页面看看 -> 我的页面首屏`，以及 `进去看看 -> 记忆花园第一层`。

# Reference 214 记忆小花园视觉分层

## 背景 / Top Garden House 层

使用 `214-bbda5053-8b60-4600-88fb-d0d0a9bc24f7.png` 作为 Memory Garden 页面完整视觉底图，并复制为 `public/reference-assets/memory-garden-reference-214.png`。图片为 `576x1024`，标准 `9:16`，适合继续使用固定 phone screen。上半屏是浅蓝天空、粉白花枝、白色篱笆、石板路和覆满花藤的小屋，承担「记忆小花园」的空间设定；实现不再用 CSS 重绘小屋、花架或背景散景。

## Back Button 层

左上角圆形返回按钮来自底图，位置约在 `x: 20-72, y: 29-79`。React 使用透明 `reference-garden-back-hit` 覆盖，点击触发 `garden -> myPage`，回到第三张「我的页面」reference 页。页面不额外显示旧的 `app-topbar`，避免右侧「心情日记」胶囊与新稿冲突。

## 标题与文案层

标题区位于 `x: 39-284, y: 127-164`，视觉文字是「记忆小花园」。说明文案位于 `y: 182-223`，两行表达「每一颗小种子，都是你慢慢放下过的一天。」React 中保留 `sr-only` 标题、说明和 seed-first 列表语义，视觉以图片为准。

## Seed List Cards 层

下半屏共有四张可见白色圆角种子卡，作为第一层 seed list，而不是 topic 分组入口：

- Card 1：约 `x: 33-544, y: 294-458`，标题「一颗有点累的小黄种子」，日期 `2026.05.28`，摘要「今天有点累，还是慢慢放下了一点。」
- Card 2：约 `x: 33-544, y: 473-637`，标题「一颗安静的蓝种子」，日期 `2026.05.27`，摘要「今天不太想说话，就先安安静静待着。」
- Card 3：约 `x: 33-544, y: 650-810`，标题「一颗热热的橙种子」，日期 `2026.05.26`，摘要「烦烦的心情，后来被轻轻接住了。」
- Card 4：约 `x: 33-544, y: 827-991`，标题「一颗轻轻绕绕的紫种子」，日期 `2026.05.25`，摘要「脑袋有点乱，也给自己留了一点空间。」

当前实现把底图中的卡片视觉作为 source of truth，并用前四颗可进入普通花园的 seed 数据提供 `sr-only` 语义和点击行为。后续如果要让文案完全动态化，需要拆出卡片背景与 seed thumbnail 素材，目前不建议，因为会牺牲 reference image 的插画质感。

## Card Thumbnails 层

每张卡左侧都有独立缩略图，位置约 `x: 51-195`，宽高约 `144x144`。缩略图分别是黄、蓝、橙、紫四颗小种子，背景包含云朵床、花丛、蝴蝶和柔光粒子。当前作为底图的一部分渲染，不单独导出 DOM 或 CSS seed orb。

## Dates / Summaries 层

日期行位于每张卡标题下方，左侧有淡粉日历 icon；摘要位于日期下方，使用偏灰棕色小字号。React 保留 seed 的 `createdAt` 和 `summary` 可访问文本，视觉日期和摘要完全来自图片。这样保持 reference 214 的固定展示，同时不把导航改成主题优先。

## Right Chevrons 层

每张卡右侧有一个浅色圆形 chevron，位置约 `x: 476-520`，表示可进入详情。透明 hit zone 覆盖整张卡片而不是只覆盖 chevron，让点击缩略图、文字或箭头都能打开同一个 seed detail。

## Decorative Flowers 层

卡片右边缘有小粉花和绿叶装饰，顶部背景还有枝叶、花瓣、云朵、篱笆、白色散点光。全部保留在底图中，不额外叠加 CSS 装饰，避免固定图层与透明交互层错位。

## Interaction Zones

- `reference-garden-back-hit`：覆盖左上返回按钮，触发 `garden -> myPage`。
- `reference-garden-seed-hit--1`：覆盖第一张 seed card，点击打开第一颗可展示 seed 的详情。
- `reference-garden-seed-hit--2`：覆盖第二张 seed card，点击打开第二颗可展示 seed 的详情。
- `reference-garden-seed-hit--3`：覆盖第三张 seed card，点击打开第三颗可展示 seed 的详情。
- `reference-garden-seed-hit--4`：覆盖第四张 seed card，点击打开第四颗可展示 seed 的详情。
- seed detail 使用底部半透明 panel 覆盖在图片上，沿用现有详情字段：心情标签、暖暖回应、你留下的话、关联主题。主题仍只在详情中出现。

## Fixed vs Scroll 行为

Reference 214 已完整放入 `9:16` 画幅，四张 seed card 全部可见，因此实现采用固定、非滚动 phone screen：`phone-shell--garden` 和 `app-screen--garden` 与前三张 reference 页一致。列表不做滚动；若未来需要展示更多 seed，应优先进入详情或后续分页/展开态，而不是把当前图稿强行变成可滚动长图。

## Implementation Guidance

- Memory Garden 页面直接使用图片底图，透明按钮只负责 hit zones 和可访问名称。
- `result -> success -> myPage -> garden` flow 保持不变；`garden` 顶部返回回到 `myPage`。
- Garden 第一层仍是 seed-first/list of seeds，绝不把主题作为第一层入口。
- 现有下游 seed detail 行为保留为点击 seed 后打开详情 panel，关闭详情不会离开花园，`回到我的页面` 返回第三页。
