# AI Marketing Influencer CRM

**English** | [中文](#中文)

An AI-assisted influencer marketing CRM that runs inside Feishu.

It helps creator partnership teams manage the workflow from creator discovery to outreach, negotiation, sample tracking, content delivery, performance review, second collaboration, and content reuse.

The product has two parts:

- a Feishu Base template for the CRM workspace
- an agent package that connects AI workflow abilities to the copied Base

## Who This Is For

This is for founders, marketers, ecommerce operators, and creator partnership teams who manage influencer campaigns across spreadsheets, DMs, emails, and scattered notes.

You may need it if:

- you already collect creator leads but do not know who to prioritize
- you spend too much time writing outreach and follow-ups
- you lose track of samples, deadlines, deliverables, and published links
- you want AI help while keeping human approval for external actions
- you want the workflow to live in Feishu

## What You Get

The Feishu CRM template includes workspace tables for:

- campaigns
- creators
- creator search
- outreach
- negotiations
- collaborations
- samples
- content deliverables
- published content
- performance
- recommendations
- agent tasks
- operation guide

The agent can help with:

1. finding creator candidates from website snippets
2. screening creators against a campaign
3. breaking a campaign into tasks
4. drafting outreach
5. preparing a send-ready outreach package
6. assisting negotiation
7. confirming collaboration details
8. tracking samples and content delivery
9. reviewing published content performance
10. recommending second collaborations and content reuse

The product follows one rule:

```text
AI can draft, score, summarize, and recommend.
Humans approve before anything external happens.
```

## How To Install

Start with the Feishu template.

1. Get the Feishu CRM template link from the product owner.
2. Copy the template into your own Feishu workspace.
3. Open the copied Base and copy its browser URL.
4. Give the copied Base URL and this GitHub repo link to your AI coding agent or technical helper.

Copy this prompt:

```text
Install https://github.com/coral-zhong/ai-marketing-influencer-crm for me. I already copied the Feishu CRM template. Connect the agent to this Base URL: <paste my copied Feishu Base URL>.
```

The agent or technical helper will install the package, verify it locally, and connect it to your copied Feishu Base.

Detailed setup guide: [Template-First Install](docs/template-first-install.md)

## Credentials

Trying the agent locally does not require Feishu credentials.

Connecting it to a real Feishu Base requires a Feishu app connection so the agent can write approved results back to your workspace. Do not put secrets into public issues, screenshots, or commits.

## Useful Docs

- [Template-First Install](docs/template-first-install.md)
- [Operation Guide](docs/operation-guide.md)
- [AI Agent Local Install Handoff](docs/ai-agent-local-install.md)

## Safety

The agent should not automatically send outreach, promise payment, confirm collaboration terms, ship samples, approve creator content, or publish reused content.

Those actions should stay human-approved.

## License

MIT

---

# 中文

一个运行在飞书里的 AI 红人营销 CRM。

它帮助红人营销团队管理从达人发现、筛选、outreach、谈判、寄样、内容交付、发布表现复盘，到二次合作和内容复用的完整流程。

这个产品由两部分组成：

- 飞书多维表格模板：用户实际使用的 CRM 工作台
- Agent package：把 AI 工作流能力连接到用户复制后的 Base

## 适合谁

如果你的红人营销现在靠表格、私信、邮件和零散备注撑着，这个产品就是为你准备的。

你可能会需要它，如果：

- 你已经有达人名单，但不知道谁值得优先联系
- 你花很多时间写 outreach 和 follow-up
- 你经常跟丢样品、截止日期、内容交付和发布链接
- 你想用 AI 提效，但不希望 AI 自动替你做对外承诺
- 你希望工作流在飞书里完成

## 你会得到什么

飞书 CRM 模板包含：

- Campaigns
- Creators
- Creator Search
- Outreach
- Negotiations
- Collaborations
- Samples
- Content Deliverables
- Published Content
- Performance
- Recommendations
- Agent Tasks
- Operation Guide

Agent 可以帮你：

1. 从网站片段里发现达人候选
2. 根据 Campaign 筛选达人
3. 拆解 Campaign 任务
4. 起草 outreach
5. 准备可审核的发送包
6. 辅助谈判
7. 确认合作信息
8. 跟踪寄样和内容交付
9. 复盘已发布内容表现
10. 推荐二次合作和内容复用

产品遵守一个简单原则：

```text
AI 可以起草、评分、总结和推荐。
任何对外动作都需要人来确认。
```

## 如何安装

先从飞书模板开始。

1. 从产品方获得飞书 CRM 模板链接。
2. 把模板复制到你自己的飞书空间。
3. 打开复制后的 Base，复制浏览器地址。
4. 把复制后的 Base URL 和这个 GitHub repo 链接交给你的 AI coding agent 或技术助手。

可以直接复制这句话：

```text
Install https://github.com/coral-zhong/ai-marketing-influencer-crm for me. I already copied the Feishu CRM template. Connect the agent to this Base URL: <paste my copied Feishu Base URL>.
```

AI agent 或技术助手会安装 package，运行本地验证，并连接到你复制后的飞书 Base。

详细安装指南：[Template-First Install](docs/template-first-install.md)

## 凭证说明

本地试用 agent 不需要飞书凭证。

连接真实飞书 Base 时，需要配置飞书应用连接，让 agent 可以把审核后的结果写回你的工作台。不要把密钥发到公开 issue、截图或 Git commit 里。

## 有用文档

- [Template-First Install / 模板优先安装](docs/template-first-install.md)
- [Operation Guide / 操作指南](docs/operation-guide.md)
- [AI Agent Local Install Handoff](docs/ai-agent-local-install.md)

## 安全边界

Agent 不应该自动发送 outreach、承诺付款、确认合作条款、安排寄样、审批达人内容或发布复用内容。

这些动作都应该由人来确认。

## License

MIT
