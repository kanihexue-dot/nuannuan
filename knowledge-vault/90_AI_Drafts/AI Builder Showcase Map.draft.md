# AI Builder Showcase Map

status: draft
source_of_truth: false
purpose: 展示页映射层草稿，用来把 Obsidian 知识资产映射到 HTML 展示结构。

> 这是 dry-run 草稿，不写入正式 `60_Maps`。正式采用前需要确认执行。

## LLM / Agent 基础

id: foundation-builder
track: AI Builder 工程能力线
node: 01

### Learning input
- Karpathy LLM OS :: 把 LLM 理解为新的软件运行层，提醒 Builder 关注上下文、工具、权限、验证和人类反馈。
- Lilian Weng Agent :: 用 planning、memory、tools 拆解 Agent，建立多步执行系统的基础框架。
- Anthropic Agents :: 强调从简单 workflow 开始，只有 eval 证明收益时才增加 agentic 复杂度。
- Software 3.0 :: 把自然语言、上下文和模型行为看成新的软件构建材料。

### Project output
- Agent 组件图 :: type=artifact :: 把 Agent 拆成目标、规划、记忆、工具、反馈和修正，作为后续系统设计底图。
- 工具跑通记录 :: type=process :: 保留 Cursor / OpenClaw / Hello World 的真实操作记录，证明学习进入可复现状态。
- Builder 最低完成线 :: type=decision :: 用工具跑通、组件图、自测和调用记录定义 Week0 的完成标准。
- 第一个最小 Skill :: type=artifact :: 把一个重复动作封装成可调用能力，验证知识沉淀可以变成执行入口。

### Knowledge assets
- [[LLM 不是确定性函数]] :: 沉淀为核心判断：LLM 是概率生成系统，产品和工程都必须设计验证与兜底。
- [[Agent 不是单次问答]] :: 沉淀为 Agent 判断框架：可靠性来自规划、工具、状态和反馈闭环。
- [[AI Skill 设计最小检查清单]] :: 沉淀为工具设计方法：输入、输出、边界、样例和失败处理必须清楚。

### Transferable capability
- Agent 复杂度判断 :: 下次做 Agent 项目时，先判断 workflow 是否足够，不直接追求全自动。
- Skill 设计起点 :: 从高频、稳定、可验证的任务开始封装，而不是一开始做万能助理。
- Eval 前置原则 :: 只有评测证明复杂度带来收益，才增加规划、多工具和自动执行链路。
- 人机协同边界 :: 把人放在验证、授权和异常处理位置，让 AI 负责生成、整理和候选方案。

## Skill 与助理原型

id: assistant-prototype-builder
track: AI Builder 工程能力线
node: 02

### Learning input
- AI Builder Week 1 V0.5 :: Week1 要求把想法推进到可评审的 V0.5，并搭出最小助理原型。
- OpenClaw 个人助理 v1 :: 用个人助理作为可运行载体，验证 skills、工具边界和 Agent 行为定义。
- Skill 设计原则 :: 工具名具体、参数少而清楚、输入输出有样例、边界写明、单一职责。
- Agent 架构方案对比 :: 用多方案比较帮助判断助理原型的工具组合、执行边界和复杂度。

### Project output
- 3 个可运行 Skill :: type=artifact :: 把重复任务拆成可调用能力，证明助理不是只靠聊天提示词运行。
- OpenClaw 助理原型 :: type=artifact :: 完成一个能调用工具、执行任务并暴露边界的个人助理 v1。
- Agent 行为边界 :: type=doc :: 定义 Persona、Tools、允许边界和禁止边界，减少误调用和过度承诺。
- 架构方案对比 :: type=decision :: 比较至少 3 个助理架构方案，选择更适合 V0.5 的实现路径。

### Knowledge assets
- [[AI Skill 设计最小检查清单]] :: 为 Skill 设计提供可复用检查项，避免工具定义含糊。
- [[AI-Native Product Spec 最小结构]] :: 把助理原型放进产品规格中，连接 JTBD、行为边界和 eval set。
- [[AI Builder 的学习以交付物为准]] :: 强化 Builder 学习必须留下可运行产物和调用记录。

### Transferable capability
- 工具边界定义 :: 下次设计工具或 Skill 时，先写清楚能做什么、不能做什么、失败时返回什么。
- 最小助理搭建 :: 从一个具体任务出发，先搭最小可运行助理，再扩展能力。
- 架构取舍判断 :: 用复杂度、可验证性和用户价值判断是否需要更多工具或 Agent 编排。
- Skill 复用迁移 :: 把一次任务沉淀成下次可直接调用的能力入口。

## 评测体系

id: evaluation-builder
track: AI Builder 工程能力线
node: 03

### Learning input
- AI Builder Week 3 V1.0 :: Week3 主线是从 0 到 1 搭建产品评测体系，停止靠感觉调 prompt。
- 产品契约 :: 先定义产品承诺完成什么任务、成功标准和失败红线，再设计 eval。
- Trace grading :: 把 input、output、tool calls、状态、成本和延迟纳入评估视野。
- LLM Judge 校准 :: 把自动评分视为需要校准的工具，而不是天然裁判。

### Project output
- 评测体系 v0 :: type=system :: 搭出产品契约、场景数据集、trace、grader、错误分类和回归治理的最小结构。
- 20 条 Eval Set :: type=doc :: 用正常、边界、对抗样本代表真实任务，而不是只测模型好不好看。
- 第一次 Eval Run :: type=proof :: 跑通评测流程，获得可以比较和复盘的结果。
- 错误分类表 :: type=process :: 把失败映射到 contract、context、tool、routing、model 或 data 等可修复层。

### Knowledge assets
- [[AI 产品评测必须围绕产品承诺]] :: 把 eval 的对象从通用模型能力拉回具体产品任务。
- [[LLM Judge 不是天然裁判]] :: 提醒自动评分必须和人工判断对齐，避免偏差被包装成客观分数。
- [[AI 产品 Eval v0 五层搭建法]] :: 把评测体系拆成可执行的五层闭环。

### Transferable capability
- 产品契约先行 :: 任何 AI 产品评测都先写清楚任务、成功标准和失败红线。
- Eval Set 设计 :: 用真实、边界和对抗样本构造最小可用评测集。
- Trace Debug :: 通过执行记录定位失败链路，而不是只看最终输出。
- 回归验证 :: 把失败样本沉淀成 regression set，防止修复后反复退化。

## 稳定性工程

id: stability-builder
track: AI Builder 工程能力线
node: 04

### Learning input
- AI Builder Week 4 V1.5 :: Week4 承接 eval v0，把系统从能跑推进到更稳。
- Eval Runner :: 自动跑完样本集并输出分类统计，支撑持续比较。
- Trace Logger :: 记录输入、核心决策和输出，让失败可以被复盘。
- Guardrail / Fallback :: 用输入校验、输出审查和降级兜底把系统带入可控状态。

### Project output
- 稳定性工程闭环 :: type=system :: 把 trace、失败样本、eval、修复、guardrail 和重跑评测串起来。
- Trace Logger 最小字段 :: type=system :: 至少记录输入、核心决策、输出、失败原因和必要上下文。
- Guardrail 最小闭环 :: type=system :: 覆盖输入校验、输出审查、低置信度处理和降级兜底。
- Demo Review :: type=proof :: 用 demo 证明系统如何从 V1.0 happy path 走向 V1.5 稳定。

### Knowledge assets
- [[AI 产品稳定性来自质量工程闭环]] :: 稳定性不是单点日志，而是 trace、eval、monitoring、guardrail 的反馈系统。
- [[Guardrail 没有 Fallback 就只是拒绝]] :: 护栏必须连接可接受的替代路径，不能只会拒绝。
- [[Trace Eval Fix 最小闭环]] :: 把失败 trace 变成 eval 样本，再通过修复和重跑验证改进。

### Transferable capability
- 失败样本闭环 :: 从真实失败中抽样、分类、修复、重跑并沉淀为回归样本。
- 降级路径设计 :: 为低置信度、工具失败和高风险场景设计解释、回退或转人工。
- 稳定性复盘 :: 用 trace 和 eval 解释系统为什么失败，而不是只调 prompt。
- Demo 可信证明 :: 展示系统如何处理失败和边界，而不只展示成功路径。

## AI 产品基础判断

id: foundation-product
track: AI 产品经理能力线
node: 01

### Learning input
- AI Builder Week 1 V0.5 :: Week1 从产品判断开始，要求先回答是否需要 AI、AI 改变哪一步和 tiny core 是什么。
- AI 产品判断四问 :: 判断任务是否真的需要 AI、AI 改变工作流哪一步、tiny core 是什么、用户雇用产品完成什么工作。
- Tiny Core :: V0.5 阶段先找到不可替代的核心体验，而不是堆 10 个普通功能。
- JTBD :: 明确用户不是在使用功能，而是在雇用产品完成一个具体工作。

### Project output
- AI 产品判断原则 :: type=decision :: 形成方向判断：AI 产品不是普通功能加 AI 按钮，必须改变任务或工作流。
- Tiny Core 定义 :: type=decision :: 把早期产品收敛到一个能被真实验证的核心体验。
- JTBD 草案 :: type=doc :: 写清目标用户雇用产品完成什么工作，以及成功状态是什么。
- 成功状态草案 :: type=doc :: 定义用户拿到什么结果才算成功，尽量可观察、可验证。

### Knowledge assets
- [[AI 产品不是普通功能加 AI 按钮]] :: 支撑产品判断的核心洞察：先判断 AI 是否真的改变任务和工作流。
- [[AI-Native Product Spec 最小结构]] :: 提供从方向到 V0.5 产品规格的最小结构。
- [[AI 产品人的稀缺价值是决定做什么]] :: 强化 AI 时代产品人的价值在判断方向、设计工作流和选择验证路径。

### Transferable capability
- AI 必要性判断 :: 判断一个任务是否真的需要 AI，还是规则、表单、搜索就能解决。
- Tiny Core 收敛 :: 把早期方向压缩成一个不可替代的核心体验。
- JTBD 表达 :: 用用户任务而不是功能清单描述产品价值。
- 产品承诺校验 :: 在写 PRD 或页面文案前，检查承诺是否能被验证和交付。

## 竞品分析

id: competitive-product
track: AI 产品经理能力线
node: 02

### Learning input
- Week1 竞品调研 :: 竞品调研关注 Vision、团队、功能、需求、反馈和迭代，而不是只列功能。
- 6 维竞品拆解 :: 用 Vision、团队、功能、需求、反馈、迭代看一个产品为什么成立。
- 用户反馈信号 :: 从高赞吐槽和好评里识别真实需求、信任问题和差异化机会。
- AI 改变工作流 :: 判断竞品里的 AI 到底改变了哪一步，而不是只看有没有 AI 按钮。

### Project output
- 竞品分析摘要 :: type=doc :: 输出关键竞品、通用模型替代方案、目标用户反馈和反直觉发现。
- 模式拆解表 :: type=doc :: 拆出竞品的目标用户、核心任务、AI 交互路径和能力承诺。
- 机会判断 :: type=decision :: 判断自己的 tiny core 可以在哪个任务、体验或信任边界上形成差异。
- 风险对比 :: type=process :: 比较竞品如何处理失败、验证、人工确认和用户控制。

### Knowledge assets
- [[AI-Native Product Spec 最小结构]] :: 竞品分析是 Product Spec 的第一步，但服务于后续 JTBD 和验证策略。
- [[AI 产品不是普通功能加 AI 按钮]] :: 用来判断竞品是否真的改变工作流，而不是包装普通功能。
- [[AI 产品人的稀缺价值是决定做什么]] :: 支撑从竞品信息中做方向判断，而不是做功能搬运。

### Transferable capability
- 竞品六维拆解 :: 用 Vision、团队、功能、需求、反馈、迭代快速建立竞品图谱。
- 差异化判断 :: 从竞品缺口、用户吐槽和未被满足的任务中找到机会。
- 反馈信号识别 :: 区分真实用户痛点、表层功能抱怨和模型能力限制。
- AI 工作流判断 :: 判断竞品里的 AI 是否改变任务路径、验证方式或用户决策。

## Product Spec

id: spec-product
track: AI 产品经理能力线
node: 03

### Learning input
- AI-Native Product Spec 模板 :: Week1 要求把模糊想法整理成可评审、可验证、可进入 V0.5 构建的产品规格。
- Agent 行为定义 :: Spec 需要写 Persona、Tools、允许边界和禁止边界，不能只写“帮用户完成任务”。
- Eval Set 初稿 :: Week1 不追求复杂技术评测，但要能验证产品价值。
- V0.5 验证策略 :: 说明哪几个 case 能证明这个 AI 产品有价值，失败时如何降级。

### Project output
- AI-Native Product Spec v1 :: type=doc :: 把竞品、JTBD、成功状态、Agent 行为、Eval Set 和验证策略组织成一份规格。
- Agent 行为边界 :: type=doc :: 明确助理能做什么、不能做什么、何时需要人工确认。
- 最小 Eval Set :: type=doc :: 覆盖正常、边界、对抗样本，服务于产品价值验证。
- 未解问题清单 :: type=process :: 保留不确定性和下一步验证点，避免把 spec 写成假确定。

### Knowledge assets
- [[AI-Native Product Spec 最小结构]] :: 将 Week1 产品判断沉淀为可执行规格模板。
- [[Product Evals 三步法]] :: 连接 Week1 的轻量验证和后续 Week3 的正式评测体系。
- [[Research Preview 是降低承诺的验证策略]] :: 支撑早期发布策略：降低承诺，获取真实反馈。

### Transferable capability
- Spec 结构化表达 :: 把模糊想法转成可评审、可验证、可执行的规格。
- Agent 边界设计 :: 明确允许、禁止、失败和人工确认节点，降低过度自动化风险。
- 早期 Eval 设计 :: 用少量真实样本验证产品价值，而不是证明模型聪明。
- 不确定性管理 :: 在 spec 中显式保留风险、假设和下一步验证点。

## Product Evals

id: evals-product
track: AI 产品经理能力线
node: 04

### Learning input
- Product Evals 三步法 :: 用少量标注样本、LLM evaluator 对齐和 eval harness 加快产品反馈循环。
- AI Builder Week 3 V1.0 :: Week3 将 Week1 的轻量 eval 扩展成正式评测体系。
- 产品契约 :: 评测要围绕产品承诺、成功标准和失败红线展开。
- 场景样本 :: 正常、边界、对抗样本代表真实用户任务，而不是通用 benchmark。

### Project output
- 产品承诺验证 :: type=proof :: 把“产品说能完成什么”转成可评测的任务、标准和红线。
- 场景样本库 :: type=doc :: 建立正常、边界、对抗样本，覆盖用户真实任务。
- 失败红线定义 :: type=decision :: 明确哪些输出不可接受，哪些场景必须降级或转人工。
- Product Eval v0 :: type=system :: 用轻量 eval harness 比较配置变化、提示词变化和产品路径变化。

### Knowledge assets
- [[AI 产品评测必须围绕产品承诺]] :: 评测对象是产品对用户的承诺，不是通用模型榜单。
- [[Product Evals 三步法]] :: 提供早期产品 eval 的可执行步骤。
- [[AI 产品 Eval v0 五层搭建法]] :: 将 Product Eval 扩展为完整评测体系。

### Transferable capability
- 承诺到指标 :: 把产品承诺翻译成可观察、可判断、可复盘的评测标准。
- 样本设计 :: 用真实任务、边界情况和对抗场景验证产品价值。
- 失败红线管理 :: 定义不可接受输出和降级路径，避免只看平均体验。
- 产品反馈循环 :: 用 eval 结果指导产品决策，而不是只生成分数。
