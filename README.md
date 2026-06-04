# AI Marketing Influencer CRM

**English** | [中文](#中文)

An AI-powered influencer marketing workspace that lives inside Feishu.

Give it a creator, a campaign, or a piece of published content. It helps you decide what to do next: who to contact, what to say, whether to negotiate, whether the sample arrived, whether the content is late, whether the post performed well, and whether the creator or content is worth reusing.

This repository is the installable product package. A user can give this GitHub link to an AI agent or technical helper and get the CRM agent running without manually piecing the workflow together.

## Who This Is For

This is for founders, marketers, ecommerce operators, and creator partnership teams who run influencer campaigns in spreadsheets, DMs, emails, and scattered notes.

You might need this if:

- You already collect creator leads but do not know who is actually worth contacting.
- You spend too much time writing outreach and follow-ups.
- You lose track of samples, deliverables, deadlines, and published links.
- You want AI help, but you still want a human to approve messages, offers, and reuse decisions.
- You want the workflow in Feishu, not in a developer terminal.

## What You Get

A Feishu-first CRM workflow for influencer marketing:

- Creator intake and screening
- Campaign planning and task breakdown
- Outreach draft generation
- Send-ready outreach package with approval gate
- Negotiation assistant
- Collaboration confirmation
- Sample tracking
- Content delivery tracking
- Published content performance tracking
- Second collaboration recommendation
- Content repurpose recommendation
- Feishu OAuth install entry point for hosted installation

The product is designed around a simple rule:

```text
AI can draft, score, summarize, and recommend.
Humans approve before anything external happens.
```

## Install With An AI Agent

Give this repo to an AI coding agent and ask it to install the product for you.

Copy this:

```text
Install https://github.com/coral-zhong/ai-marketing-influencer-crm for me and tell me when it is ready to connect to my Feishu Base.
```

The AI agent or technical helper will handle the setup steps and tell you when the CRM is ready to connect to Feishu.

After installation, you can connect it to Feishu so the agent can write reviewable creator, campaign, outreach, fulfillment, and performance outputs back into your CRM Base.

The Feishu setup has two paths:

- Paste an existing Feishu Base link. The agent can read the Base token and Creators table ID from the URL.
- Ask the agent to create a new CRM Base. It can create the Base, tables, fields, select options, and views through the Feishu API.

If your AI agent runs inside a restricted sandbox and cannot reach `open.feishu.cn`, let it prepare the repo and then run the final Feishu setup command on your own computer:

```bash
npm run setup:feishu -- --base-url "https://your-domain.feishu.cn/base/bascnxxxx?table=tblxxxx"
```

or:

```bash
npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"
```

## What It Can Do

Once installed, the agent can help with:

1. Import and search creator candidates.
2. Screen a creator against a campaign.
3. Break a campaign into tasks.
4. Draft outreach.
5. Prepare an approved send package.
6. Assist negotiation without making commitments.
7. Confirm a collaboration.
8. Track samples and content delivery.
9. Track published content performance.
10. Recommend second collaborations and content reuse.
11. Prepare the Feishu OAuth install entry point.

## Connect To Feishu

For trying it locally: **No Feishu credentials are needed.**

For real writeback to your workspace, the local install needs:

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- either an existing Feishu Base link or permission to create a new Base

`AGENT_API_SECRET` is not a Feishu credential. It is a private shared secret for the local agent endpoint. Your AI agent can generate a random value for it.

For a hosted install path, the user should not copy secrets manually. The hosted app should handle authorization through Feishu OAuth.

Setup guide: [Feishu API Credentials Setup](docs/feishu-api-credentials-setup.md).

## For Builders And Agents

Useful docs:

- [Operation Guide](docs/operation-guide.md)
- [AI Agent Local Install Handoff](docs/ai-agent-local-install.md)
- [Agent Capability Map](docs/agent-capability-map.md)
- [Product Build Checklist](docs/product-build-checklist.md)
- [Feishu OAuth Hosted Install](docs/feishu-oauth-hosted-install.md)
- [Minimal Feishu CRM Schema](schema/minimal-crm.schema.json)

## Privacy And Safety

- Trying it locally does not need real Feishu credentials.
- Real secrets should never be committed to this repo.
- `FEISHU_APP_SECRET` belongs on the hosted server only.
- The agent should not automatically send outreach, promise payment, ship samples, approve creator content, or publish reused content.

## License

MIT

---

# 中文

一个运行在飞书里的 AI 红人营销 CRM。

你给它一个达人、一个 Campaign，或者一条已经发布的内容，它会帮你判断下一步：该不该联系、怎么写 outreach、怎么谈判、样品有没有到、内容有没有逾期、发布效果好不好、这个达人值不值得二次合作、这条内容值不值得复用。

这个 GitHub 仓库是可安装的产品包。用户可以把这个链接交给 AI agent 或技术助手，让它完成安装、验证和飞书写回配置。

## 这个产品适合谁

如果你的红人营销现在靠表格、私信、邮件和零散备注撑着，这个产品就是为你准备的。

你可能会需要它，如果：

- 你已经有达人名单，但不知道谁值得优先联系。
- 你花很多时间写 outreach 和 follow-up。
- 你经常跟丢样品、内容截止日期、发布链接和表现数据。
- 你想用 AI 提效，但不希望 AI 自动替你发消息、承诺报价或审批内容。
- 你希望工作流在飞书里完成，而不是在 Terminal 里完成。

## 你会得到什么

一个以飞书为中心的红人营销工作流：

- 达人导入与筛选
- Campaign 规划和任务拆解
- Outreach 草稿生成
- 带审批门槛的发送包
- 谈判助手
- 合作确认
- 寄样跟踪
- 内容交付跟踪
- 已发布内容表现跟踪
- 二次合作推荐
- 内容复用推荐
- 面向托管安装的飞书 OAuth 入口

产品遵守一个简单原则：

```text
AI 可以起草、评分、总结和推荐。
任何对外动作都需要人来确认。
```

## 让 AI Agent 帮你安装

把这个 GitHub 仓库发给你的 AI coding agent，让它替你安装产品。

复制这句话给它：

```text
Install https://github.com/coral-zhong/ai-marketing-influencer-crm for me and tell me when it is ready to connect to my Feishu Base.
```

AI agent 或技术助手会处理安装步骤，并告诉你什么时候可以连接飞书。

安装完成后，你可以把它连接到飞书，让 Agent 把达人、Campaign、Outreach、履约和表现分析结果写回你的 CRM Base。

连接飞书有两条路径：

- 粘贴一个已有飞书多维表格链接。Agent 可以自动从 URL 里识别 Base token 和 Creators table ID。
- 让 Agent 新建一个 CRM Base。它可以通过飞书 API 创建 Base、数据表、字段、选项字段和视图。

如果你的 AI agent 运行在受限沙箱里，访问不了 `open.feishu.cn`，让它先准备好 repo，然后你在自己的电脑上运行最后一步：

```bash
npm run setup:feishu -- --base-url "https://your-domain.feishu.cn/base/bascnxxxx?table=tblxxxx"
```

或者：

```bash
npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"
```

## 它能做什么

安装后，Agent 可以帮你：

1. 导入和搜索达人候选。
2. 根据 Campaign 筛选达人。
3. 把 Campaign 拆成任务。
4. 生成 outreach 草稿。
5. 准备带审批门槛的发送包。
6. 辅助谈判，但不自动承诺。
7. 确认合作。
8. 跟踪寄样和内容交付。
9. 跟踪已发布内容表现。
10. 推荐二次合作和内容复用。
11. 准备飞书 OAuth 安装入口。

## 连接飞书需要什么？

本地试用：**不需要飞书凭证。**

如果要写入你的真实飞书空间，本地安装需要：

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- 一个已有飞书 Base 链接，或允许 Agent 新建 Base

`AGENT_API_SECRET` 不是飞书凭证。它只是本地 agent 接口的访问密码，可以让 AI agent 自动生成一个随机值。

如果走托管安装路径，用户不应该手动复制密钥。授权应该通过飞书 OAuth 完成。

配置指南：[Feishu API Credentials Setup](docs/feishu-api-credentials-setup.md)。

## 给开发者和 AI agent

有用文档：

- [Operation Guide / 操作指南](docs/operation-guide.md)
- [AI Agent Local Install Handoff](docs/ai-agent-local-install.md)
- [Agent Capability Map](docs/agent-capability-map.md)
- [Product Build Checklist](docs/product-build-checklist.md)
- [Feishu OAuth Hosted Install](docs/feishu-oauth-hosted-install.md)
- [Minimal Feishu CRM Schema](schema/minimal-crm.schema.json)

## 隐私和安全

- 本地试用不需要真实飞书凭证。
- 真实密钥不要提交到这个仓库。
- `FEISHU_APP_SECRET` 只能保存在托管服务端。
- Agent 不能自动发送 outreach、承诺付款、寄样、审批达人内容或发布复用内容。

## License

MIT
