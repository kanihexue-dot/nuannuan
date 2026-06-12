window.SHOWCASE_MAP_DATA = {
  "sections": {
    "learn": {
      "title": "学习输入",
      "sourceLayer": "10_Sources",
      "fallbackLayer": "15_Learning_Captures",
      "description": "已经被整理过的课程、文章、讲座和官方文档 Source Note。"
    },
    "output": {
      "title": "项目产出",
      "sourceLayer": "20_Projects",
      "fallbackLayer": null,
      "description": "实际做出来的 demo、组件图、实验记录、过程产物和执行结果。"
    },
    "asset": {
      "title": "知识资产",
      "sourceLayer": "40_Insights / 50_Playbooks",
      "fallbackLayer": "60_Maps",
      "description": "可追溯、可引用、可复用的判断、原则、检查清单和主题地图。"
    },
    "transfer": {
      "title": "可迁移能力",
      "sourceLayer": "50_Playbooks",
      "fallbackLayer": "40_Insights",
      "description": "下次做 AI 产品或 Agent 项目时可以直接复用的方法和判断。"
    }
  },
  "tracks": [
    {
      "title": "AI Builder 工程能力线",
      "nodeIds": [
        "foundation-builder",
        "assistant-prototype-builder",
        "evaluation-builder",
        "stability-builder"
      ]
    },
    {
      "title": "AI 产品经理能力线",
      "nodeIds": [
        "foundation-product",
        "competitive-product",
        "spec-product",
        "evals-product"
      ]
    }
  ],
  "nodes": {
    "foundation-builder": {
      "title": "LLM / Agent 基础",
      "id": "foundation-builder",
      "track": "AI Builder 工程能力线",
      "node": "01",
      "reflection": "把每次知识输入都变成可复用的知识资产",
      "projectOutput": "mindmap",
      "mindMap": "mindmaps/foundation-builder.png",
      "researchCompetitive": "",
      "researchMarket": "",
      "dashboardImage": "",
      "demoImage": "",
      "demoVideo": "",
      "langfuseImage": "",
      "evidence": {
        "learn": [
          "Karpathy LLM OS",
          "Lilian Weng Agent",
          "Anthropic Agents",
          "Software 3.0"
        ],
        "output": [
          "Agent 组件图",
          "工具跑通记录",
          "Builder 最低完成线",
          "第一个最小 Skill"
        ],
        "asset": [
          "[[LLM 不是确定性函数]]",
          "[[Agent 不是单次问答]]",
          "[[AI Skill 设计最小检查清单]]"
        ],
        "transfer": [
          "Agent 复杂度判断",
          "Skill 设计起点",
          "Eval 前置原则",
          "人机协同边界"
        ]
      },
      "evidenceDetail": {
        "learn": {
          "Karpathy LLM OS": "把 LLM 理解为新的软件运行层，提醒 Builder 关注上下文、工具、权限、验证和人类反馈。",
          "Lilian Weng Agent": "用 planning、memory、tools 拆解 Agent，建立多步执行系统的基础框架。",
          "Anthropic Agents": "强调从简单 workflow 开始，只有 eval 证明收益时才增加 agentic 复杂度。",
          "Software 3.0": "把自然语言、上下文和模型行为看成新的软件构建材料。"
        },
        "output": {
          "Agent 组件图": "把 Agent 拆成目标、规划、记忆、工具、反馈和修正，作为后续系统设计底图。",
          "工具跑通记录": "保留 Cursor / Open Core / Open Codex / Hello World 的真实操作记录，证明学习进入可复现状态。",
          "Builder 最低完成线": "用工具跑通、组件图、自测和调用记录定义 Week0 的完成标准。",
          "第一个最小 Skill": "把一个重复动作封装成可调用能力，验证知识沉淀可以变成执行入口。"
        },
        "asset": {
          "[[LLM 不是确定性函数]]": "沉淀为核心判断：LLM 是概率生成系统，产品和工程都必须设计验证与兜底。",
          "[[Agent 不是单次问答]]": "沉淀为 Agent 判断框架：可靠性来自规划、工具、状态和反馈闭环。",
          "[[AI Skill 设计最小检查清单]]": "沉淀为工具设计方法：输入、输出、边界、样例和失败处理必须清楚。"
        },
        "transfer": {
          "Agent 复杂度判断": "下次做 Agent 项目时，先判断 workflow 是否足够，不直接追求全自动。",
          "Skill 设计起点": "从高频、稳定、可验证的任务开始封装，而不是一开始做万能助理。",
          "Eval 前置原则": "只有评测证明复杂度带来收益，才增加规划、多工具和自动执行链路。",
          "人机协同边界": "把人放在验证、授权和异常处理位置，让 AI 负责生成、整理和候选方案。"
        }
      },
      "evidenceMeta": {
        "learn": {},
        "output": {
          "Agent 组件图": {
            "type": "artifact"
          },
          "工具跑通记录": {
            "type": "process"
          },
          "Builder 最低完成线": {
            "type": "decision"
          },
          "第一个最小 Skill": {
            "type": "artifact"
          }
        },
        "asset": {},
        "transfer": {}
      }
    },
    "assistant-prototype-builder": {
      "title": "Skill 与助理原型",
      "id": "assistant-prototype-builder",
      "track": "AI Builder 工程能力线",
      "node": "02",
      "reflection": "Week1 让我把重复任务收成 Skill，第一次感到助理不是聊天框，而是可调用的能力入口。",
      "projectOutput": "architecture",
      "mindMap": "diagrams/assistant-prototype-builder-agent-arch.png",
      "architectureOverview": "diagrams/assistant-arch-overview.png",
      "architectureGallery": [
        {
          "path": "diagrams/assistant-arch-purple.png",
          "title": "测评 Agent 架构图",
          "tone": "purple"
        },
        {
          "path": "diagrams/assistant-arch-green.png",
          "title": "产品设计 Agent 架构图",
          "tone": "green"
        },
        {
          "path": "diagrams/assistant-arch-eval.png",
          "title": "竞品调研 Agent 架构图",
          "tone": "eval"
        }
      ],
      "researchCompetitive": "",
      "researchMarket": "",
      "dashboardImage": "",
      "demoImage": "",
      "demoVideo": "",
      "langfuseImage": "",
      "evidence": {
        "learn": [
          "AI Builder Week 1 V0.5",
          "Open Core / Open Codex 云助理原型",
          "Skill 设计原则",
          "Agent 架构方案对比"
        ],
        "output": [
          "16 个可运行 Skill",
          "Open Core / Open Codex 助理原型",
          "Agent 行为边界",
          "架构方案对比"
        ],
        "asset": [
          "[[AI Skill 设计最小检查清单]]",
          "[[AI 原生产品说明书最小结构]]",
          "[[AI Builder 的学习以交付物为准]]"
        ],
        "transfer": [
          "工具边界定义",
          "最小助理搭建",
          "架构取舍判断",
          "Skill 复用迁移"
        ]
      },
      "evidenceDetail": {
        "learn": {
          "AI Builder Week 1 V0.5": "Week1 要求把想法推进到可评审的 V0.5，并搭出最小助理原型。",
          "Open Core / Open Codex 云助理原型": "用 Open Core 和 Open Codex 作为云助理载体，验证 skills、工具边界和 Agent 行为定义。",
          "Skill 设计原则": "工具名具体、参数少而清楚、输入输出有样例、边界写明、单一职责。",
          "Agent 架构方案对比": "用多方案比较帮助判断助理原型的工具组合、执行边界和复杂度。"
        },
        "output": {
          "16 个可运行 Skill": "把重复任务拆成 16 个可调用能力，证明助理不是只靠聊天提示词运行。",
          "Open Core / Open Codex 助理原型": "完成 Open Core / Open Codex 云助理原型，跑通工具调用、任务执行和边界暴露。",
          "Agent 行为边界": "定义 Persona、Tools、允许边界和禁止边界，减少误调用和过度承诺。",
          "架构方案对比": "比较至少 3 个助理架构方案，选择更适合 V0.5 的实现路径。"
        },
        "asset": {
          "[[AI Skill 设计最小检查清单]]": "为 Skill 设计提供可复用检查项，避免工具定义含糊。",
          "[[AI 原生产品说明书最小结构]]": "把助理原型放进产品说明书中，连接 JTBD、行为边界和 eval set。",
          "[[AI Builder 的学习以交付物为准]]": "强化 Builder 学习必须留下可运行产物和调用记录。"
        },
        "transfer": {
          "工具边界定义": "下次设计工具或 Skill 时，先写清楚能做什么、不能做什么、失败时返回什么。",
          "最小助理搭建": "从一个具体任务出发，先搭最小可运行助理，再扩展能力。",
          "架构取舍判断": "用复杂度、可验证性和用户价值判断是否需要更多工具或 Agent 编排。",
          "Skill 复用迁移": "把一次任务沉淀成下次可直接调用的能力入口。"
        }
      },
      "evidenceMeta": {
        "learn": {},
        "output": {
          "16 个可运行 Skill": {
            "type": "artifact"
          },
          "Open Core / Open Codex 助理原型": {
            "type": "artifact"
          },
          "Agent 行为边界": {
            "type": "doc"
          },
          "架构方案对比": {
            "type": "decision"
          }
        },
        "asset": {},
        "transfer": {}
      }
    },
    "evaluation-builder": {
      "title": "评测体系",
      "id": "evaluation-builder",
      "track": "AI Builder 工程能力线",
      "node": "03",
      "reflection": "Week3 让我停止靠感觉调 prompt，开始用真实失败和 trace 证明产品有没有变好。",
      "projectOutput": "eval-flow",
      "evalDesignFlowImage": "diagrams/eval-design-flow.png",
      "mindMap": "diagrams/evaluation-builder-eval-arch.png",
      "researchCompetitive": "",
      "researchMarket": "",
      "dashboardImage": "",
      "demoImage": "",
      "demoVideo": "",
      "langfuseImage": "",
      "evidence": {
        "learn": [
          "AI Builder Week 3 V1.0",
          "产品契约",
          "Trace grading",
          "LLM Judge 校准"
        ],
        "output": [
          "评测体系 v0",
          "20 条 Eval Set",
          "第一次 Eval Run",
          "错误分类表"
        ],
        "asset": [
          "[[AI 产品评测必须围绕产品承诺]]",
          "[[LLM Judge 不是天然裁判]]",
          "[[AI 产品 Eval v0 五层搭建法]]"
        ],
        "transfer": [
          "产品契约先行",
          "Eval Set 设计",
          "Trace Debug",
          "回归验证"
        ]
      },
      "evidenceDetail": {
        "learn": {
          "AI Builder Week 3 V1.0": "Week3 主线是从 0 到 1 搭建产品评测体系，停止靠感觉调 prompt。",
          "产品契约": "先定义产品承诺完成什么任务、成功标准和失败红线，再设计 eval。",
          "Trace grading": "把 input、output、tool calls、状态、成本和延迟纳入评估视野。",
          "LLM Judge 校准": "把自动评分视为需要校准的工具，而不是天然裁判。"
        },
        "output": {
          "评测体系 v0": "搭出产品契约、场景数据集、trace、grader、错误分类和回归治理的最小结构。",
          "20 条 Eval Set": "用正常、边界、对抗样本代表真实任务，而不是只测模型好不好看。",
          "第一次 Eval Run": "跑通评测流程，获得可以比较和复盘的结果。",
          "错误分类表": "把失败映射到 contract、context、tool、routing、model 或 data 等可修复层。"
        },
        "asset": {
          "[[AI 产品评测必须围绕产品承诺]]": "把 eval 的对象从通用模型能力拉回具体产品任务。",
          "[[LLM Judge 不是天然裁判]]": "提醒自动评分必须和人工判断对齐，避免偏差被包装成客观分数。",
          "[[AI 产品 Eval v0 五层搭建法]]": "把评测体系拆成可执行的五层闭环。"
        },
        "transfer": {
          "产品契约先行": "任何 AI 产品评测都先写清楚任务、成功标准和失败红线。",
          "Eval Set 设计": "用真实、边界和对抗样本构造最小可用评测集。",
          "Trace Debug": "通过执行记录定位失败链路，而不是只看最终输出。",
          "回归验证": "把失败样本沉淀成 regression set，防止修复后反复退化。"
        }
      },
      "evidenceMeta": {
        "learn": {},
        "output": {
          "评测体系 v0": {
            "type": "system"
          },
          "20 条 Eval Set": {
            "type": "doc"
          },
          "第一次 Eval Run": {
            "type": "proof"
          },
          "错误分类表": {
            "type": "process"
          }
        },
        "asset": {},
        "transfer": {}
      }
    },
    "stability-builder": {
      "title": "稳定性工程",
      "id": "stability-builder",
      "track": "AI Builder 工程能力线",
      "node": "04",
      "reflection": "Week4 让我明白：稳定不是不失败，而是失败后知道怎么拦、怎么退、怎么复盘。",
      "projectOutput": "langfuse",
      "mindMap": "",
      "researchCompetitive": "",
      "researchMarket": "",
      "dashboardImage": "",
      "demoImage": "",
      "demoVideo": "",
      "langfuseImage": "diagrams/stability-builder-langfuse.png",
      "langfuseDatasetName": "nuannuan-scene-v21-50-回归",
      "langfuseUrl": "https://cloud.langfuse.com",
      "langfuseDatasetSummary": "在 Langfuse 沉淀 50 条场景回归样本，用输入、预期输出和元数据支撑 trace → eval → fix 的稳定性闭环。",
      "evidence": {
        "learn": [
          "AI Builder Week 4 V1.5",
          "Eval Runner",
          "Trace Logger",
          "Guardrail / Fallback"
        ],
        "output": [
          "稳定性工程闭环",
          "Trace Logger 最小字段",
          "Guardrail 最小闭环",
          "Demo Review"
        ],
        "asset": [
          "[[AI 产品稳定性来自质量工程闭环]]",
          "[[Guardrail 没有 Fallback 就只是拒绝]]",
          "[[Trace Eval Fix 最小闭环]]"
        ],
        "transfer": [
          "失败样本闭环",
          "降级路径设计",
          "稳定性复盘",
          "Demo 可信证明"
        ]
      },
      "evidenceDetail": {
        "learn": {
          "AI Builder Week 4 V1.5": "Week4 承接 eval v0，把系统从能跑推进到更稳。",
          "Eval Runner": "自动跑完样本集并输出分类统计，支撑持续比较。",
          "Trace Logger": "记录输入、核心决策和输出，让失败可以被复盘。",
          "Guardrail / Fallback": "用输入校验、输出审查和降级兜底把系统带入可控状态。"
        },
        "output": {
          "稳定性工程闭环": "把 trace、失败样本、eval、修复、guardrail 和重跑评测串起来。",
          "Trace Logger 最小字段": "至少记录输入、核心决策、输出、失败原因和必要上下文。",
          "Guardrail 最小闭环": "覆盖输入校验、输出审查、低置信度处理和降级兜底。",
          "Demo Review": "用 demo 证明系统如何从 V1.0 happy path 走向 V1.5 稳定。"
        },
        "asset": {
          "[[AI 产品稳定性来自质量工程闭环]]": "稳定性不是单点日志，而是 trace、eval、monitoring、guardrail 的反馈系统。",
          "[[Guardrail 没有 Fallback 就只是拒绝]]": "护栏必须连接可接受的替代路径，不能只会拒绝。",
          "[[Trace Eval Fix 最小闭环]]": "把失败 trace 变成 eval 样本，再通过修复和重跑验证改进。"
        },
        "transfer": {
          "失败样本闭环": "从真实失败中抽样、分类、修复、重跑并沉淀为回归样本。",
          "降级路径设计": "为低置信度、工具失败和高风险场景设计解释、回退或转人工。",
          "稳定性复盘": "用 trace 和 eval 解释系统为什么失败，而不是只调 prompt。",
          "Demo 可信证明": "展示系统如何处理失败和边界，而不只展示成功路径。"
        }
      },
      "evidenceMeta": {
        "learn": {},
        "output": {
          "稳定性工程闭环": {
            "type": "system"
          },
          "Trace Logger 最小字段": {
            "type": "system"
          },
          "Guardrail 最小闭环": {
            "type": "system"
          },
          "Demo Review": {
            "type": "proof"
          }
        },
        "asset": {},
        "transfer": {}
      }
    },
    "foundation-product": {
      "title": "AI 产品基础判断",
      "id": "foundation-product",
      "track": "AI 产品经理能力线",
      "node": "01",
      "reflection": "产品线起点不是堆功能，而是先回答：用户雇用产品完成什么任务，以及 tiny core 是什么。",
      "projectOutput": "research",
      "productJudgmentInsights": [
        {
          "label": "AI 必要性",
          "title": "先判断 AI 是否真的改变工作流",
          "detail": "AI Native 不是普通功能加 AI 按钮，而是让原本需要理解、生成、判断或协作的任务发生质变；如果规则、表单、搜索就能解决，就不应强行 AI 化。"
        },
        {
          "label": "Tiny Core",
          "title": "把 V0.5 压缩到一个不可替代的核心体验",
          "detail": "早期不追求功能完整，而是找到用户愿意反复使用的最小闭环：输入什么、AI 改变哪一步、用户拿到什么结果、失败时如何兜底。"
        },
        {
          "label": "用户任务",
          "title": "从 JTBD 写产品，而不是从功能清单写产品",
          "detail": "用户不是在雇用一个按钮，而是在雇用产品完成某个具体工作。产品判断要说清目标用户、触发场景、成功状态和不做什么。"
        },
        {
          "label": "产品承诺",
          "title": "每个 AI 承诺都要能被验证",
          "detail": "AI 产品的价值不能只停留在“更智能”的口号里，必须落到可观察的成功标准、失败红线、评测样本和人工确认路径。"
        }
      ],
      "mindMap": "",
      "researchCompetitive": "diagrams/foundation-product-competitive.png",
      "researchMarket": "diagrams/foundation-product-market.png",
      "dashboardImage": "",
      "demoImage": "",
      "demoVideo": "",
      "langfuseImage": "",
      "evidence": {
        "learn": [
          "AI Builder Week 1 V0.5",
          "AI 产品判断四问",
          "Tiny Core",
          "JTBD"
        ],
        "output": [
          "AI 产品判断原则",
          "Tiny Core 定义",
          "JTBD 草案",
          "成功状态草案"
        ],
        "asset": [
          "[[AI 产品不是普通功能加 AI 按钮]]",
          "[[AI 原生产品说明书最小结构]]",
          "[[AI 产品人的稀缺价值是决定做什么]]"
        ],
        "transfer": [
          "AI 必要性判断",
          "Tiny Core 收敛",
          "JTBD 表达",
          "产品承诺校验"
        ]
      },
      "evidenceDetail": {
        "learn": {
          "AI Builder Week 1 V0.5": "Week1 从产品判断开始，要求先回答是否需要 AI、AI 改变哪一步和 tiny core 是什么。",
          "AI 产品判断四问": "判断任务是否真的需要 AI、AI 改变工作流哪一步、tiny core 是什么、用户雇用产品完成什么工作。",
          "Tiny Core": "V0.5 阶段先找到不可替代的核心体验，而不是堆 10 个普通功能。",
          "JTBD": "明确用户不是在使用功能，而是在雇用产品完成一个具体工作。"
        },
        "output": {
          "AI 产品判断原则": "形成方向判断：AI 产品不是普通功能加 AI 按钮，必须改变任务或工作流。",
          "Tiny Core 定义": "把早期产品收敛到一个能被真实验证的核心体验。",
          "JTBD 草案": "写清目标用户雇用产品完成什么工作，以及成功状态是什么。",
          "成功状态草案": "定义用户拿到什么结果才算成功，尽量可观察、可验证。"
        },
        "asset": {
          "[[AI 产品不是普通功能加 AI 按钮]]": "支撑产品判断的核心洞察：先判断 AI 是否真的改变任务和工作流。",
          "[[AI 原生产品说明书最小结构]]": "提供从方向到 V0.5 产品说明书的最小结构。",
          "[[AI 产品人的稀缺价值是决定做什么]]": "强化 AI 时代产品人的价值在判断方向、设计工作流和选择验证路径。"
        },
        "transfer": {
          "AI 必要性判断": "判断一个任务是否真的需要 AI，还是规则、表单、搜索就能解决。",
          "Tiny Core 收敛": "把早期方向压缩成一个不可替代的核心体验。",
          "JTBD 表达": "用用户任务而不是功能清单描述产品价值。",
          "产品承诺校验": "在写 PRD 或页面文案前，检查承诺是否能被验证和交付。"
        }
      },
      "evidenceMeta": {
        "learn": {},
        "output": {
          "AI 产品判断原则": {
            "type": "decision"
          },
          "Tiny Core 定义": {
            "type": "decision"
          },
          "JTBD 草案": {
            "type": "doc"
          },
          "成功状态草案": {
            "type": "doc"
          }
        },
        "asset": {},
        "transfer": {}
      }
    },
    "competitive-product": {
      "title": "竞品分析",
      "id": "competitive-product",
      "track": "AI 产品经理能力线",
      "node": "02",
      "reflection": "竞品分析不是功能清单，而是看谁更清楚地处理了任务、不确定性和失败边界。",
      "projectOutput": "dashboard",
      "competitiveInsights": [
        {
          "label": "定位边界",
          "title": "不是 AI 心理医生，而是日常情绪安全承接空间",
          "detail": "目标用户是 12-16 岁初中生，核心痛点不是没人聊天，而是情绪强烈但表达通道失效。产品应聚焦低压力表达、私密空间、非语言情绪投放和风险转接。"
        },
        {
          "label": "App 阵营",
          "title": "moo 日记赢在低摩擦入口",
          "detail": "在 App 端横向评测中，moo 日记平均分 3.58，高于心岛日记 2.42，并在 12/12 维度领先。关键不是更会聊天，而是让用户在 10 秒内完成情绪安置。"
        },
        {
          "label": "LLM 阵营",
          "title": "MiniMax / 星野赢在共情温度，CharacterGLM 赢在安全边界",
          "detail": "MiniMax / 星野综合表现更强，尤其在陪伴克制、结束语、非语言表达上更自然；CharacterGLM 在隐私安全上更稳。但两者在危机干预温和度上都有明显迭代空间。"
        },
        {
          "label": "破局机会",
          "title": "形态 App 化 + 内核 LLM 化 + 双轨 Agent",
          "detail": "最优解不是纯聊天框，也不是传统日记，而是用视觉化 Mood Tracker 完成低压破冰，再用朋友式共情 Agent 承接情绪，用后台哨兵 Agent 处理风险和合规。"
        }
      ],
      "mindMap": "",
      "researchCompetitive": "",
      "researchMarket": "",
      "dashboardImage": "diagrams/competitive-product-report-dashboard.png",
      "demoImage": "",
      "demoVideo": "",
      "langfuseImage": "",
      "evidence": {
        "learn": [
          "Week1 竞品调研",
          "6 维竞品拆解",
          "用户反馈信号",
          "AI 改变工作流"
        ],
        "output": [
          "竞品分析摘要",
          "模式拆解表",
          "机会判断",
          "风险对比"
        ],
        "asset": [
          "[[AI 原生产品说明书最小结构]]",
          "[[AI 产品不是普通功能加 AI 按钮]]",
          "[[AI 产品人的稀缺价值是决定做什么]]"
        ],
        "transfer": [
          "竞品六维拆解",
          "差异化判断",
          "反馈信号识别",
          "AI 工作流判断"
        ]
      },
      "evidenceDetail": {
        "learn": {
          "Week1 竞品调研": "竞品调研关注 Vision、团队、功能、需求、反馈和迭代，而不是只列功能。",
          "6 维竞品拆解": "用 Vision、团队、功能、需求、反馈、迭代看一个产品为什么成立。",
          "用户反馈信号": "从高赞吐槽和好评里识别真实需求、信任问题和差异化机会。",
          "AI 改变工作流": "判断竞品里的 AI 到底改变了哪一步，而不是只看有没有 AI 按钮。"
        },
        "output": {
          "竞品分析摘要": "输出关键竞品、通用模型替代方案、目标用户反馈和反直觉发现。",
          "模式拆解表": "拆出竞品的目标用户、核心任务、AI 交互路径和能力承诺。",
          "机会判断": "判断自己的 tiny core 可以在哪个任务、体验或信任边界上形成差异。",
          "风险对比": "比较竞品如何处理失败、验证、人工确认和用户控制。"
        },
        "asset": {
          "[[AI 原生产品说明书最小结构]]": "竞品分析是 产品说明书的第一步，但服务于后续 JTBD 和验证策略。",
          "[[AI 产品不是普通功能加 AI 按钮]]": "用来判断竞品是否真的改变工作流，而不是包装普通功能。",
          "[[AI 产品人的稀缺价值是决定做什么]]": "支撑从竞品信息中做方向判断，而不是做功能搬运。"
        },
        "transfer": {
          "竞品六维拆解": "用 Vision、团队、功能、需求、反馈、迭代快速建立竞品图谱。",
          "差异化判断": "从竞品缺口、用户吐槽和未被满足的任务中找到机会。",
          "反馈信号识别": "区分真实用户痛点、表层功能抱怨和模型能力限制。",
          "AI 工作流判断": "判断竞品里的 AI 是否改变任务路径、验证方式或用户决策。"
        }
      },
      "evidenceMeta": {
        "learn": {},
        "output": {
          "竞品分析摘要": {
            "type": "doc"
          },
          "模式拆解表": {
            "type": "doc"
          },
          "机会判断": {
            "type": "decision"
          },
          "风险对比": {
            "type": "process"
          }
        },
        "asset": {},
        "transfer": {}
      }
    },
    "spec-product": {
      "title": "产品说明书",
      "id": "spec-product",
      "track": "AI 产品经理能力线",
      "node": "03",
      "reflection": "产品说明书的价值是把模糊想法写成可评审、可验证、可进入 V0.5 的规格，而不是漂亮文档。",
      "projectOutput": "demo",
      "mindMap": "",
      "researchCompetitive": "",
      "researchMarket": "",
      "dashboardImage": "",
      "demoImage": "diagrams/spec-product-demo.png",
      "demoVideo": "demos/spec-product-demo.mp4",
      "langfuseImage": "",
      "outputVersions": {
        "default": "v2",
        "v1": {
          "kicker": "初版",
          "title": "产品说明书 V1",
          "summary": "初版保留产品说明书的早期表达，用来对照新版如何收敛成完整体验流程。",
          "image": "diagrams/spec-product-v1.png"
        },
        "v2": {
          "kicker": "新版",
          "title": "产品说明书 V2",
          "summary": "小情绪房间 V0.5 的五步体验流程，把低摩擦情绪安置、安全红线和陪伴承接合成一张流程图。",
          "image": "diagrams/spec-product-v2.png"
        }
      },
      "evidence": {
        "learn": [
          "AI 原生产品说明书模板",
          "Agent 行为定义",
          "Eval Set 初稿",
          "V0.5 验证策略"
        ],
        "output": [
          "AI 原生产品说明书 v1",
          "Agent 行为边界",
          "最小 Eval Set",
          "未解问题清单"
        ],
        "asset": [
          "[[AI 原生产品说明书最小结构]]",
          "[[产品评测三步法]]",
          "[[Research Preview 是降低承诺的验证策略]]"
        ],
        "transfer": [
          "Spec 结构化表达",
          "Agent 边界设计",
          "早期 Eval 设计",
          "不确定性管理"
        ]
      },
      "evidenceDetail": {
        "learn": {
          "AI 原生产品说明书模板": "Week1 要求把模糊想法整理成可评审、可验证、可进入 V0.5 构建的产品说明书。",
          "Agent 行为定义": "Spec 需要写 Persona、Tools、允许边界和禁止边界，不能只写“帮用户完成任务”。",
          "Eval Set 初稿": "Week1 不追求复杂技术评测，但要能验证产品价值。",
          "V0.5 验证策略": "说明哪几个 case 能证明这个 AI 产品有价值，失败时如何降级。"
        },
        "output": {
          "AI 原生产品说明书 v1": "把竞品、JTBD、成功状态、Agent 行为、Eval Set 和验证策略组织成一份规格。",
          "Agent 行为边界": "明确助理能做什么、不能做什么、何时需要人工确认。",
          "最小 Eval Set": "覆盖正常、边界、对抗样本，服务于产品价值验证。",
          "未解问题清单": "保留不确定性和下一步验证点，避免把 spec 写成假确定。"
        },
        "asset": {
          "[[AI 原生产品说明书最小结构]]": "将 Week1 产品判断沉淀为可执行规格模板。",
          "[[产品评测三步法]]": "连接 Week1 的轻量验证和后续 Week3 的正式评测体系。",
          "[[Research Preview 是降低承诺的验证策略]]": "支撑早期发布策略：降低承诺，获取真实反馈。"
        },
        "transfer": {
          "Spec 结构化表达": "把模糊想法转成可评审、可验证、可执行的规格。",
          "Agent 边界设计": "明确允许、禁止、失败和人工确认节点，降低过度自动化风险。",
          "早期 Eval 设计": "用少量真实样本验证产品价值，而不是证明模型聪明。",
          "不确定性管理": "在 spec 中显式保留风险、假设和下一步验证点。"
        }
      },
      "evidenceMeta": {
        "learn": {},
        "output": {
          "AI 原生产品说明书 v1": {
            "type": "doc"
          },
          "Agent 行为边界": {
            "type": "doc"
          },
          "最小 Eval Set": {
            "type": "doc"
          },
          "未解问题清单": {
            "type": "process"
          }
        },
        "asset": {},
        "transfer": {}
      }
    },
    "evals-product": {
      "title": "产品评测",
      "id": "evals-product",
      "track": "AI 产品经理能力线",
      "node": "04",
      "reflection": "产品评测让我把“产品承诺”变成可评测的标准，而不是继续争论模型聪不聪明。",
      "projectOutput": "mindmap",
      "mindMap": "mindmaps/evals-product.png",
      "researchCompetitive": "",
      "researchMarket": "",
      "dashboardImage": "",
      "demoImage": "",
      "demoVideo": "",
      "langfuseImage": "",
      "evidence": {
        "learn": [
          "产品评测三步法",
          "AI Builder Week 3 V1.0",
          "产品契约",
          "场景样本"
        ],
        "output": [
          "产品承诺验证",
          "场景样本库",
          "失败红线定义",
          "产品评测 v0"
        ],
        "asset": [
          "[[AI 产品评测必须围绕产品承诺]]",
          "[[产品评测三步法]]",
          "[[AI 产品 Eval v0 五层搭建法]]"
        ],
        "transfer": [
          "承诺到指标",
          "样本设计",
          "失败红线管理",
          "产品反馈循环"
        ]
      },
      "evidenceDetail": {
        "learn": {
          "产品评测三步法": "用少量标注样本、LLM evaluator 对齐和 eval harness 加快产品反馈循环。",
          "AI Builder Week 3 V1.0": "Week3 将 Week1 的轻量 eval 扩展成正式评测体系。",
          "产品契约": "评测要围绕产品承诺、成功标准和失败红线展开。",
          "场景样本": "正常、边界、对抗样本代表真实用户任务，而不是通用 benchmark。"
        },
        "output": {
          "产品承诺验证": "把“产品说能完成什么”转成可评测的任务、标准和红线。",
          "场景样本库": "建立正常、边界、对抗样本，覆盖用户真实任务。",
          "失败红线定义": "明确哪些输出不可接受，哪些场景必须降级或转人工。",
          "产品评测 v0": "用轻量 eval harness 比较配置变化、提示词变化和产品路径变化。"
        },
        "asset": {
          "[[AI 产品评测必须围绕产品承诺]]": "评测对象是产品对用户的承诺，不是通用模型榜单。",
          "[[产品评测三步法]]": "提供早期产品 eval 的可执行步骤。",
          "[[AI 产品 Eval v0 五层搭建法]]": "将 产品评测扩展为完整评测体系。"
        },
        "transfer": {
          "承诺到指标": "把产品承诺翻译成可观察、可判断、可复盘的评测标准。",
          "样本设计": "用真实任务、边界情况和对抗场景验证产品价值。",
          "失败红线管理": "定义不可接受输出和降级路径，避免只看平均体验。",
          "产品反馈循环": "用 eval 结果指导产品决策，而不是只生成分数。"
        }
      },
      "evidenceMeta": {
        "learn": {},
        "output": {
          "产品承诺验证": {
            "type": "proof"
          },
          "场景样本库": {
            "type": "doc"
          },
          "失败红线定义": {
            "type": "decision"
          },
          "产品评测 v0": {
            "type": "system"
          }
        },
        "asset": {},
        "transfer": {}
      }
    }
  }
};
