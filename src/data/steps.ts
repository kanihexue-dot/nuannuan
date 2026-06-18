import type { EmotionPhraseOption, EmotionWeatherOption, PresentationStep, StepId } from "../types";

export const defaultStepId: StepId = "step-01";

export const emotionWeatherOptions: EmotionWeatherOption[] = [
  {
    id: "rainstorm",
    label: "大暴雨",
    description: "像情绪一下子砸下来，先找个能躲雨的地方。"
  },
  {
    id: "cloudy",
    label: "阴天",
    description: "闷闷的、不太想说，但心里一直压着。"
  },
  {
    id: "mist",
    label: "起雾",
    description: "不是特别痛，但看不清自己怎么了。"
  }
];

export const emotionPhraseOptions: EmotionPhraseOption[] = [
  {
    id: "annoyed",
    label: "烦死了，但我也不知道为什么",
    mood: "烦躁 / 低落",
    emotion: "委屈 / 防备 / 不被理解"
  },
  {
    id: "tired",
    label: "我就是有点累，不想解释",
    mood: "疲惫 / 压抑",
    emotion: "无力 / 想退开 / 需要被放过"
  },
  {
    id: "fine",
    label: "我说没事，但其实不太好",
    mood: "低落 / 绷住",
    emotion: "孤单 / 失落 / 害怕麻烦别人"
  }
];

export const presentationSteps: PresentationStep[] = [
  {
    id: "step-01",
    indexLabel: "01",
    shortLabel: "极速破冰",
    title: "极速破冰",
    summary: "不用先打很多字，先用低门槛动作碰一下自己的情绪。",
    imageSrc: "/emotion-scenes/1.png",
    sceneKeywords: ["滑杆", "天气贴片", "轻触入口"],
    narrative: ["先用天气和短词完成进入。", "不要求用户立刻解释自己。"],
    detailBlocks: [
      {
        title: "示例输入",
        content: "我现在有点闷。"
      },
      {
        title: "示例回应",
        content: "先不用想清楚怎么说，我们只先找到你现在最接近的感受。"
      }
    ],
    visualMood: "entry"
  },
  {
    id: "step-02",
    indexLabel: "02",
    shortLabel: "隐性感知识别",
    title: "隐性感知识别",
    summary: "把模糊感受翻译成更细的情绪层次。",
    imageSrc: "/emotion-scenes/2.png",
    sceneKeywords: ["情绪命名", "细粒度", "从雾到词"],
    narrative: ["系统不只看开心或难过。", "重点是把情绪命名清楚。"],
    detailBlocks: [
      {
        title: "示例输入",
        content: "已选口头禅：烦死了。"
      },
      {
        title: "示例识别",
        content: "粗粒度 Mood：烦躁 / 低落；细粒度 Emotion：委屈 / 防备 / 不被理解。"
      }
    ],
    visualMood: "mapping"
  },
  {
    id: "step-03",
    indexLabel: "03",
    shortLabel: "极致共情回应",
    title: "极致共情回应",
    summary: "先被接住，再慢慢说也来得及。",
    imageSrc: "/emotion-scenes/3.png",
    sceneKeywords: ["被理解", "朋友语气", "先接住"],
    narrative: ["不分析，不说教。", "这是全页最强的承接时刻。"],
    detailBlocks: [
      {
        title: "示例输入",
        content: "已选口头禅：烦死了。"
      },
      {
        title: "示例回应",
        content: "外面的雨太大了，进来烤烤火吧。烦心事都丢给火堆。"
      }
    ],
    visualMood: "compassion"
  },
  {
    id: "step-04",
    indexLabel: "04",
    shortLabel: "视觉治愈与转化",
    title: "视觉治愈与转化",
    summary: "当情绪被看见，场景也会跟着慢慢变暖。",
    imageSrc: "/emotion-scenes/4.png",
    sceneKeywords: ["雨夜窗边", "台灯暖光", "逐渐转暖"],
    narrative: ["不靠说理完成变化。", "靠视觉环境陪着情绪降温。"],
    detailBlocks: [
      {
        title: "示例变化",
        content: "窗外仍在下雨，营地却更亮、更稳、更像一个避风港。"
      },
      {
        title: "设计目标",
        content: "让用户在视觉和氛围上感到被接住。"
      }
    ],
    visualMood: "warmth"
  },
  {
    id: "step-05",
    indexLabel: "05",
    shortLabel: "留白沉淀与隐私封存",
    title: "留白沉淀与隐私封存",
    summary: "这一刻可以被轻轻留下，也可以安静封存。",
    imageSrc: "/emotion-scenes/5.png",
    sceneKeywords: ["留白卡片", "柔和收束", "隐私保护"],
    narrative: ["结束不是中断。", "最后的感受是被安全地放下。"],
    detailBlocks: [
      {
        title: "示例留白",
        content: "今天就先到这里。"
      },
      {
        title: "示例说明",
        content: "雨夜、小灯和火堆余温，会和这句心情一起被安静收好。"
      }
    ],
    visualMood: "quiet"
  }
];
