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

The easiest path is to give this repo to an AI coding agent and ask it to install and verify the product for you.

Copy this:

```text
Install https://github.com/coral-zhong/ai-marketing-influencer-crm for me. Run npm run verify:local to confirm the product works, then explain which Feishu credentials are needed if I want real writeback to my own Base.
```

That is the only verification command a technical helper or AI agent needs to run for the basic install test.

You do not need to manually call API endpoints. You do not need to paste technical requests. You do not need Feishu credentials just to confirm that the product installs and runs.

## What The Install Test Proves

The install test checks that the product workflow can run end to end.

It verifies that the agent can:

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
11. Generate and validate the Feishu OAuth install entry point.

## How A Real User Should Experience It

The intended product experience is not:

```text
open terminal
run local server
copy API keys
paste technical requests
debug config errors
```

The intended product experience is:

```text
click Feishu install link
authorize the app
open the CRM Base
add creators and campaigns
review AI suggestions inside Feishu
approve only when ready
```

This repo already contains the workflow logic, local install verification, Feishu writeback boundary, and OAuth install entry point. For a fully managed experience, deploy it as a hosted Feishu app so authorization, token storage, and Base setup happen for the user.

## Do I Need Feishu API Credentials?

For install verification: **No.**

For a real installation that writes to your own Feishu Base: **Yes, unless you use a hosted OAuth app.**

For the hosted install path: the user should not copy API credentials manually. The hosted app should handle authorization through Feishu OAuth.

If you are setting up the developer version, see [Feishu API Credentials Setup](docs/feishu-api-credentials-setup.md).

If you are building the hosted install flow, see [Feishu OAuth Hosted Install](docs/feishu-oauth-hosted-install.md).

## Product Status

This is a working product repository. It includes the installable agent service, workflow logic, tests, Feishu writeback boundary, and documentation needed for an AI agent or technical helper to set it up.

Included:

- AI-agent-assisted installation and verification
- Feishu writeback boundary
- Core influencer CRM workflow endpoints
- Review-first safety model
- Feishu OAuth install entry point
- English and Chinese user-facing README

Optional upgrades for a smoother managed product:

- Hosted Feishu OAuth token exchange
- Secure tenant/user install storage
- One-click Feishu Base creation or template copy
- A friendly install success page
- Production deployment of the agent service

## For Builders And Agents

Useful docs:

- [AI Agent Local Install Handoff](docs/ai-agent-local-install.md)
- [Agent Capability Map](docs/agent-capability-map.md)
- [Product Build Checklist](docs/product-build-checklist.md)
- [Feishu OAuth Hosted Install](docs/feishu-oauth-hosted-install.md)
- [Minimal Feishu CRM Schema](schema/minimal-crm.schema.json)

## Privacy And Safety

- Install verification does not need real Feishu credentials.
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

最简单的方法，是把这个 GitHub 仓库发给你的 AI coding agent，让它替你安装和验证产品。

复制这句话给它：

```text
Install https://github.com/coral-zhong/ai-marketing-influencer-crm for me. Run npm run verify:local to confirm the product works, then explain which Feishu credentials are needed if I want real writeback to my own Base.
```

基础安装测试只需要这一条验证命令。

你不需要手动调用 API。你不需要复制一堆技术请求。你也不需要为了确认产品能安装运行而准备飞书凭证。

## 安装测试证明什么

安装测试会验证这个红人营销工作流可以跑通。

它会检查 Agent 是否能：

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
11. 生成并校验飞书 OAuth 安装入口。

## 真正用户应该怎么使用

理想体验不是：

```text
打开 Terminal
启动本地服务
复制 API key
粘贴技术请求
自己排查配置错误
```

理想体验是：

```text
点击飞书安装链接
授权应用
打开 CRM Base
添加达人和 Campaign
在飞书里审核 AI 建议
确认后再对外执行
```

这个 repo 已经包含工作流逻辑、安装验证、飞书写回边界和 OAuth 安装入口。如果要做成更顺滑的全托管体验，可以部署成托管飞书应用，让授权、token 保存和 Base 创建都由服务端自动处理。

## 我需要飞书 API 凭证吗？

安装验证：**不需要。**

如果你要让开发者版本写入自己的真实飞书 Base：**需要，除非你使用托管 OAuth 应用。**

托管安装路径：用户不应该手动复制 API 凭证。授权应该通过飞书 OAuth 完成。

开发者配置请看：[Feishu API Credentials Setup](docs/feishu-api-credentials-setup.md)。

托管安装流程请看：[Feishu OAuth Hosted Install](docs/feishu-oauth-hosted-install.md)。

## 产品状态

这是一个真实可安装的产品仓库。它包含 Agent 服务、红人营销工作流、测试、飞书写回边界和让 AI agent 帮用户安装所需的文档。

已经包含：

- AI agent 辅助安装和验证
- 飞书写回边界
- 核心红人 CRM 工作流
- 人工审核优先的安全模型
- 飞书 OAuth 安装入口
- 中英文 README

如果要进一步升级成完全托管的低摩擦产品，可以继续补：

- 托管服务完成 Feishu OAuth token exchange
- 安全保存用户/租户安装状态
- 一键创建或复制飞书 Base 模板
- 友好的安装成功页面
- 云端部署 Agent 服务

## 给开发者和 AI agent

有用文档：

- [AI Agent Local Install Handoff](docs/ai-agent-local-install.md)
- [Agent Capability Map](docs/agent-capability-map.md)
- [Product Build Checklist](docs/product-build-checklist.md)
- [Feishu OAuth Hosted Install](docs/feishu-oauth-hosted-install.md)
- [Minimal Feishu CRM Schema](schema/minimal-crm.schema.json)

## 隐私和安全

- 安装验证不需要真实飞书凭证。
- 真实密钥不要提交到这个仓库。
- `FEISHU_APP_SECRET` 只能保存在托管服务端。
- Agent 不能自动发送 outreach、承诺付款、寄样、审批达人内容或发布复用内容。

## License

MIT
