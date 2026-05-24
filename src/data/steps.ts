import type { PresentationStep, StepId } from "../types";

export const defaultStepId: StepId = "step-03";

export const presentationSteps: PresentationStep[] = [
  {
    id: "step-01",
    indexLabel: "01",
    shortLabel: "极速破冰",
    title: "极速破冰",
    summary: "不用先打很多字，先用低门槛动作碰一下自己的情绪。",
    sampleInput: "我现在有点闷。",
    sampleResponse: "先不用想清楚怎么说，我们只先找到你现在最接近的感受。",
    sceneKeywords: ["滑杆", "天气贴片", "轻触入口"],
    narrative: ["用户不必组织语言。", "交互像先伸手碰一下情绪。"],
    safetyLevel: "L0",
    visualMood: "entry"
  },
  {
    id: "step-02",
    indexLabel: "02",
    shortLabel: "隐性感知识别",
    title: "隐性感知识别",
    summary: "把模糊感受翻译成更细的情绪层次。",
    sampleInput: "像下雨天，闷闷的。",
    sampleResponse: "这不只是难过，也可能带着委屈、压抑和一点防备。",
    sceneKeywords: ["情绪命名", "细粒度", "从雾到词"],
    narrative: ["系统不只看开心或难过。", "重点是把情绪命名清楚。"],
    safetyLevel: "L1",
    visualMood: "mapping"
  },
  {
    id: "step-03",
    indexLabel: "03",
    shortLabel: "极致共情回应",
    title: "极致共情回应",
    summary: "先被理解，再往后走。",
    sampleInput: "我现在说不太清楚，但就是很难受。",
    sampleResponse: "天呐，你像是被困在暴雨里一样吧。先不用解释，我先在这里陪你一会。",
    sceneKeywords: ["被理解", "朋友语气", "先接住"],
    narrative: ["不分析，不说教。", "这是全页最强的承接时刻。"],
    safetyLevel: "L1",
    visualMood: "compassion"
  },
  {
    id: "step-04",
    indexLabel: "04",
    shortLabel: "视觉治愈与转化",
    title: "视觉治愈与转化",
    summary: "通过空间和光把情绪慢慢带离高压。",
    sampleInput: "我现在好像没有刚刚那么紧了。",
    sampleResponse: "我们不着急解决问题，先让这个房间陪你把情绪降下来。",
    sceneKeywords: ["雨夜窗边", "台灯暖光", "逐渐转暖"],
    narrative: ["不靠说理完成变化。", "靠视觉环境陪着情绪降温。"],
    safetyLevel: "L0",
    visualMood: "warmth"
  },
  {
    id: "step-05",
    indexLabel: "05",
    shortLabel: "留白沉淀与隐私封存",
    title: "留白沉淀与隐私封存",
    summary: "把这段情绪安全地放下，而不是突然断掉。",
    sampleInput: "我想先到这里。",
    sampleResponse: "好的，这段小情绪会被安静地放好，你什么时候回来都可以。",
    sceneKeywords: ["留白卡片", "柔和收束", "隐私保护"],
    narrative: ["结束不是中断。", "最后的感受是被安全地放下。"],
    safetyLevel: "L0",
    visualMood: "quiet"
  }
];
