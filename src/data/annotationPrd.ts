export interface AnnotationSection {
  id: number;
  title: string;
  displayContent: string[];
  interaction?: string[];
  function?: string[];
}

export interface AnnotationInsightBlock {
  title: string;
  items: string[];
}

export const annotationSections: AnnotationSection[] = [
  {
    id: 1,
    title: "页面主引导区",
    displayContent: [
      "页面标题：显示“小情绪房间”，建立本页主题识别。",
      "主引导语：告诉用户不用先解释，先从内心天气开始。",
      "辅助引导语：补充“再点一个词”的下一步动作提示。"
    ],
    function: ["先降低开口压力，再把注意力自然带到下面的轻触选择。"]
  },
  {
    id: 2,
    title: "场景氛围图",
    displayContent: [
      "大图场景：雨夜营地作为首屏主要视觉，负责传达陪伴气质。",
      "画面占比：让用户先感到被接住，再进入功能选择。"
    ],
    function: ["用稳定的情绪氛围替代功能堆叠，让首次进入先有安全感。"]
  },
  {
    id: 3,
    title: "场景浮层提示区",
    displayContent: [
      "场景标签：说明这是首开场景。",
      "陪伴短句：用轻量文案接住用户，不要求立刻表达。",
      "内心天气提示：把当前代表场景和用户选择联系起来。"
    ],
    function: ["把视觉场景和当前状态串起来，帮助用户理解这不是普通天气，而是内心天气。"]
  },
  {
    id: 4,
    title: "内心天气选择区",
    displayContent: [
      "首发展示 4 个内心天气：大暴雨、起大雾、阴天乌云、大雪深夜。",
      "默认选中 1 个天气，保证用户一进入就有可继续的起点。"
    ],
    interaction: ["点击不同内心天气后，场景提示和下方短词标签同步切换。"],
    function: ["用隐喻化入口替代抽象情绪分类，降低首次表达的理解成本。"]
  },
  {
    id: 5,
    title: "情绪短词标签区",
    displayContent: [
      "根据当前内心天气展示 4 个最贴近的口头表达。",
      "每个标签都保持口语化，避免让用户像在填表。"
    ],
    interaction: ["用户点击 1 个词后，标签进入高亮态，并触发底部完成反馈。"],
    function: ["帮助用户用最少动作完成第一次情绪上报，而不是要求完整倾诉。"]
  },
  {
    id: 6,
    title: "选择反馈与继续区",
    displayContent: [
      "反馈文案：显示“已选择 内心天气 / 标签”的当前结果。",
      "主按钮：继续，作为本页唯一的前进动作。"
    ],
    interaction: ["未选词时按钮不可点击；完成 1 次标签选择后按钮点亮。"],
    function: ["把本页收成一个最小闭环，明确“这一页已经完成第一次表达”。"]
  }
];

export const annotationInsightBlocks: AnnotationInsightBlock[] = [
  {
    title: "页面定位",
    items: [
      "这一页只聚焦首开场景，不承担识别、共情回应或后续封存说明。",
      "标注说明以页面模块为单位，方便后续直接复制到低保真 PRD。"
    ]
  },
  {
    title: "最小闭环",
    items: [
      "用户进入页面后，先看见场景与引导，再完成“选内心天气 + 选 1 个词”。",
      "继续按钮点亮后，本页目标即达成，不在这一页展开后续深聊。"
    ]
  },
  {
    title: "后续拆分建议",
    items: [
      "如果需要补充动态状态，可以另做“未选择态”和“完成选择态”两张截图。",
      "如果后面要接第二页，再单独补一张“点击继续后的下一步说明页”，不要塞回这一张里。"
    ]
  }
];
