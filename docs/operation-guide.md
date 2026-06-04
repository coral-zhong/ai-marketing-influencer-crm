# Operation Guide

This guide explains how to use the AI Marketing Influencer CRM after it is installed in Feishu.

It is written for founders, marketers, and operators. You do not need to understand the codebase to use the workflow.

## Why The First Template Includes Many Tables

The recommended install starts from a complete Feishu Base template.

The template includes the main workflow tables:

- `Campaigns`
- `Creators`
- `Creator Search`
- `Outreach`
- `Negotiations`
- `Collaborations`
- `Samples`
- `Content Deliverables`
- `Published Content`
- `Performance`
- `Viral Breakdowns`
- `Recommendations`
- `Agent Tasks`
- `Operation Guide`

This is intentional. A first-time user should be able to copy the template and immediately see the whole influencer marketing workflow.

`Campaigns` is the campaign brief. It stores the brand, product, goal, target market, creator criteria, allowed claims, and claims to avoid. The agent uses this table to understand what kind of creators and content fit the campaign.

`Creators` is the main CRM table. It stores creator profiles, screening status, fit score, tier, risks, strengths, collaboration recommendation, and the latest agent summary. Most day-to-day work happens here.

`Agent Tasks` is the review queue and activity log. It records what the agent was asked to do, which record it worked on, whether the task is pending, done, failed, or needs review, and what output it produced.

`Creator Search`, `Outreach`, `Negotiations`, `Collaborations`, `Samples`, `Content Deliverables`, `Published Content`, `Performance`, `Viral Breakdowns`, and `Recommendations` hold the later workflow stages so users do not need to design the CRM structure themselves.

`Operation Guide` explains how to move through the workflow inside the Base.

## Daily Workflow

1. Create a campaign in `Campaigns`.
2. Add the brand, product, campaign goal, creator criteria, and claims guidance.
3. Add or import creators into `Creators`.
4. Mark creators as `To Screen` when they are ready for agent review.
5. Let the agent screen creators and write back fit score, tier, risks, strengths, and recommendation.
6. Review creators marked `Needs Review`.
7. Move approved creators to outreach.
8. Ask the agent to draft outreach and prepare a send package.
9. Approve messages before anything is sent outside the CRM.
10. Use the agent to support negotiation, collaboration confirmation, sample tracking, content delivery, performance review, viral content breakdown, and reuse decisions.

## Human Review Rules

The agent can help draft, score, summarize, and recommend.

The agent should not automatically:

- send outreach
- promise payment
- confirm a collaboration
- ship a sample
- approve creator content
- publish or reuse content

Those actions should stay human-approved.

## What To Check After Installation

After setup, open the Feishu Base and confirm:

- `Campaigns` exists
- `Creators` exists
- `Outreach` exists
- `Samples` exists
- `Content Deliverables` exists
- `Performance` exists
- `Viral Breakdowns` exists
- `Recommendations` exists
- `Agent Tasks` exists
- `Operation Guide` exists
- `Creators` has views such as `To Screen` and `Needs Review`
- `.env` has `FEISHU_BASE_TOKEN` and `FEISHU_CREATORS_TABLE_ID` if real Feishu writeback is enabled

If an AI agent says it cannot access `open.feishu.cn`, the credentials may still be correct. Some agent sandboxes block that network request. In that case, run the final Feishu setup command on your own computer.

## Suggested First Test

Use one real or realistic creator.

1. Create a campaign.
2. Add one creator to `Creators`.
3. Ask the agent to screen that creator against the campaign.
4. Check whether the creator gets a fit score, tier, strengths, risks, and recommendation.
5. Review the result manually.

The first test is successful when the CRM helps you make a better next-step decision about the creator.

---

# 中文操作指南

这份文档解释安装完成后，如何在飞书里使用 AI Marketing Influencer CRM。

它是写给创始人、市场团队和运营同学看的。你不需要懂代码，也可以理解这套工作流。

## 为什么第一次安装就是完整模板？

推荐安装方式是先复制一个完整的飞书 Base 模板。

模板里包含主要工作流表：

- `Campaigns`
- `Creators`
- `Creator Search`
- `Outreach`
- `Negotiations`
- `Collaborations`
- `Samples`
- `Content Deliverables`
- `Published Content`
- `Performance`
- `Viral Breakdowns`
- `Recommendations`
- `Agent Tasks`
- `Operation Guide`

这是有意设计的。第一次安装时，用户应该复制模板后就能马上看到完整红人营销工作流。

`Campaigns` 是活动 brief。它记录品牌、产品、活动目标、目标市场、达人标准、允许使用的卖点，以及需要避免的表达。Agent 会用这张表理解这次 Campaign 需要什么样的达人和内容。

`Creators` 是主要的达人 CRM。它记录达人资料、筛选状态、匹配分数、达人等级、风险、优势、合作建议，以及最近一次 Agent 输出。日常大部分工作都在这张表里完成。

`Agent Tasks` 是 Agent 的任务队列和执行记录。它记录 Agent 被要求做什么、处理哪条记录、任务是待处理/已完成/失败/需要人工审核，以及 Agent 产出的结果。

`Creator Search`、`Outreach`、`Negotiations`、`Collaborations`、`Samples`、`Content Deliverables`、`Published Content`、`Performance`、`Viral Breakdowns` 和 `Recommendations` 承接后面的流程阶段，用户不需要自己设计 CRM 结构。

`Operation Guide` 用来在 Base 里解释每一步怎么走。

## 日常怎么用

1. 在 `Campaigns` 里创建一个 Campaign。
2. 填好品牌、产品、活动目标、达人标准和内容表达要求。
3. 在 `Creators` 里新增或导入达人。
4. 把需要 Agent 筛选的达人状态改成 `To Screen`。
5. 让 Agent 对达人进行筛选，并写回匹配分数、等级、风险、优势和合作建议。
6. 查看 `Needs Review` 里的达人。
7. 把通过审核的达人推进到 outreach。
8. 让 Agent 起草 outreach，并准备发送包。
9. 所有对外消息都先人工确认，再发送。
10. 后续可以继续让 Agent 辅助谈判、确认合作、跟踪寄样、跟踪内容交付、分析发布表现、拆解爆款内容，并推荐二次合作或内容复用。

## 人工审核原则

Agent 可以帮你起草、评分、总结和推荐。

Agent 不应该自动替你：

- 发送 outreach
- 承诺付款
- 确认合作
- 安排寄样
- 审批达人内容
- 发布或复用内容

这些动作都应该由人来确认。

## 安装后检查什么？

安装完成后，打开飞书 Base，确认：

- 有 `Campaigns`
- 有 `Creators`
- 有 `Outreach`
- 有 `Samples`
- 有 `Content Deliverables`
- 有 `Performance`
- 有 `Viral Breakdowns`
- 有 `Recommendations`
- 有 `Agent Tasks`
- 有 `Operation Guide`
- `Creators` 里有 `To Screen` 和 `Needs Review` 等视图
- 如果开启真实飞书写回，`.env` 里已经有 `FEISHU_BASE_TOKEN` 和 `FEISHU_CREATORS_TABLE_ID`

如果 AI agent 说它访问不了 `open.feishu.cn`，不一定是凭证错了。有些 agent 沙箱会拦截这个网络请求。这种情况下，让 agent 准备好 repo，然后你在自己的电脑上运行最后一步飞书 setup 命令。

## 建议的第一次测试

先用一个真实或接近真实的达人测试。

1. 创建一个 Campaign。
2. 在 `Creators` 里添加一个达人。
3. 让 Agent 根据 Campaign 筛选这个达人。
4. 检查是否写回了匹配分数、等级、优势、风险和合作建议。
5. 人工 review 这个结果。

第一次测试成功的标准是：这套 CRM 能不能帮你更快判断这个达人下一步该怎么处理。
