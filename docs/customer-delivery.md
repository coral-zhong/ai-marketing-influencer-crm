# Internal Customer Delivery

Internal SOP for the product owner. This document is not part of the public user onboarding path.

Use it when you want to give the product to a real user.

The product is delivered as two connected parts:

1. Feishu Base template: the user's CRM workspace.
2. GitHub agent package: the AI workflow engine that connects to the copied Base.

## What You Send To A User

Send the user two links:

```text
1. Feishu CRM template:
<your public/copyable Feishu Base template link>

2. Agent package:
https://github.com/coral-zhong/ai-marketing-influencer-crm
```

Then send this instruction:

```text
Copy the Feishu CRM template into your own workspace. Then give your copied Base URL and the GitHub repo link to your AI coding agent or technical helper.
```

## User Installation Flow

1. User opens your Feishu CRM template link.
2. User copies the template into their own Feishu workspace.
3. User opens the copied Base.
4. User copies any Base URL from the copied Base.
5. User gives that copied Base URL and the GitHub repo link to an AI agent.
6. AI agent installs the repo and runs:

```bash
npm run setup:feishu -- --base-url "<copied Feishu Base URL>"
```

7. The setup command discovers the Base token, the Creators table, and the full table map.
8. The AI agent runs:

```bash
npm run verify:local
```

The installation is ready when verification passes.

## What The User Gets

The copied Feishu template gives the user:

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

The GitHub agent package gives the user:

- creator search from website snippets
- creator screening
- campaign task breakdown
- outreach drafting
- send-ready outreach package
- negotiation assistant
- collaboration confirmation
- sample tracking
- content delivery tracking
- performance tracking
- second collaboration recommendation
- content repurpose recommendation

## Beta Delivery Message

Use this message for early users:

```text
Here is the AI Marketing Influencer CRM beta.

Step 1: Copy this Feishu CRM template into your workspace:
<your public/copyable Feishu Base template link>

Step 2: Ask your AI coding agent or technical helper to install the agent package:
https://github.com/coral-zhong/ai-marketing-influencer-crm

Step 3: Give the agent your copied Feishu Base URL and ask it to connect the CRM agent to that Base.

The product helps with creator search, creator screening, outreach drafting, negotiation support, collaboration confirmation, sample tracking, content delivery tracking, performance review, second collaboration recommendation, and content repurpose recommendation.
```

## Current Limitation

This is still an AI-agent-assisted install.

The user needs either:

- an AI coding agent that can run local commands, or
- a technical helper who can install the GitHub repo.

For a fully self-serve product, the next step is a hosted install:

1. User clicks a product install link.
2. User authorizes Feishu OAuth.
3. Hosted backend copies the CRM template or creates the Base.
4. Hosted backend stores the token securely.
5. User never handles local `.env` files or app secrets.

---

# 内部用户交付说明

这是给产品方自己的内部 SOP，不是公开用户 onboarding 文档。

当你想把这个产品交给真实用户时，用这份文档。

这个产品由两部分组成：

1. 飞书多维表格模板：用户实际使用的 CRM 工作台。
2. GitHub agent package：连接模板并执行 AI 工作流的能力。

## 你发给用户什么

发给用户两个链接：

```text
1. 飞书 CRM 模板：
<你的公开/可复制飞书 Base 模板链接>

2. Agent package：
https://github.com/coral-zhong/ai-marketing-influencer-crm
```

再发这句话：

```text
请先把飞书 CRM 模板复制到你自己的飞书空间。然后把复制后的 Base URL 和 GitHub repo 链接交给你的 AI coding agent 或技术助手。
```

## 用户安装流程

1. 用户打开你的飞书 CRM 模板链接。
2. 用户复制模板到自己的飞书空间。
3. 用户打开复制后的 Base。
4. 用户复制任意一个复制后 Base 的浏览器链接。
5. 用户把这个 Base URL 和 GitHub repo 链接交给 AI agent。
6. AI agent 安装 repo，并运行：

```bash
npm run setup:feishu -- --base-url "<copied Feishu Base URL>"
```

7. setup 命令会自动识别 Base token、Creators 表和完整 table map。
8. AI agent 运行：

```bash
npm run verify:local
```

验证通过后，安装完成。

## 用户得到什么

飞书模板给用户：

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

GitHub agent package 给用户：

- 从网站片段搜索达人
- 达人筛选
- Campaign 任务拆解
- Outreach 起草
- Outreach 发送包
- 谈判助手
- 合作确认
- 寄样跟踪
- 内容交付跟踪
- 表现跟踪
- 二次合作推荐
- 内容复用推荐

## 内测用户话术

可以这样发给早期用户：

```text
这是 AI Marketing Influencer CRM 的 beta 版本。

第一步：复制这个飞书 CRM 模板到你的空间：
<你的公开/可复制飞书 Base 模板链接>

第二步：让你的 AI coding agent 或技术助手安装这个 agent package：
https://github.com/coral-zhong/ai-marketing-influencer-crm

第三步：把你复制后的飞书 Base URL 发给 agent，让它把 CRM agent 连接到这份 Base。

这个产品可以帮助你完成达人搜索、达人筛选、outreach 起草、谈判辅助、合作确认、寄样跟踪、内容交付跟踪、表现复盘、二次合作推荐和内容复用推荐。
```

## 当前限制

目前还是 AI-agent-assisted install。

用户需要：

- 一个可以运行本地命令的 AI coding agent，或
- 一个能安装 GitHub repo 的技术助手。

如果要变成完全自助产品，下一步是 hosted install：

1. 用户点击产品安装链接。
2. 用户授权飞书 OAuth。
3. hosted backend 复制 CRM 模板或创建 Base。
4. hosted backend 安全保存 token。
5. 用户不需要处理本地 `.env` 或应用密钥。
