# AI Marketing Influencer CRM

English | [中文](#中文)

AI Marketing Influencer CRM is a Feishu-first influencer marketing operating system.

It is not just a static Base template. The Feishu Base is the control panel, and the agent service helps teams move through the influencer workflow with reviewable AI outputs:

```text
capture creators
-> plan campaign tasks
-> draft outreach and negotiation guidance
-> track collaboration, samples, content, and performance
-> recommend second collaborations and content reuse
-> keep humans in approval points before external action
```

## What This Repo Is For

This public repo lets a new user or an AI agent clone the project and verify that the product workflow runs locally.

The local version is for install testing and product validation. A production user should not need to run a local terminal, maintain a background process, configure ngrok, or manually call API endpoints.

## User-Friendly Install Path

The intended user experience is:

1. Open the Feishu install link from the hosted app.
2. Authorize the Feishu app.
3. The hosted service creates or connects the CRM Base.
4. The agent writes reviewable outputs back into Feishu.
5. The user works inside Feishu, not inside Terminal.

The repo currently includes a tested OAuth install scaffold:

- `GET /api/install/feishu` creates a Feishu OAuth authorization URL.
- `GET /api/install/feishu/callback` validates OAuth callback shape.
- The real production hosted app still needs secure token exchange, token storage, and Feishu Base template creation.

See [Feishu OAuth Hosted Install](docs/feishu-oauth-hosted-install.md).

## Quick Start

If you are a user testing this repo with an AI agent, give the agent this instruction:

```text
Clone this repo and run npm run verify:local. If it passes, summarize the supported workflow capabilities and any remaining hosted-install gaps.
```

Repo:

```text
https://github.com/coral-zhong/ai-marketing-influencer-crm
```

If you are running it yourself:

```bash
git clone https://github.com/coral-zhong/ai-marketing-influencer-crm.git
cd ai-marketing-influencer-crm
npm run verify:local
```

That single command runs the local test suite and smoke test. It does not require Feishu credentials.

Expected result:

```text
tests pass
smoke returns ok=true
writebackMode is demo
```

## Product Capabilities Covered

The local verification covers these workflow capabilities:

| Workflow | Status |
|---|---|
| Creator CSV import | Implemented |
| Creator search from website/source text | Implemented |
| Creator screening | Implemented |
| Campaign planning and task decomposition | Implemented |
| Review-only outreach draft | Implemented |
| Outreach send package with approval gate | Implemented |
| Negotiation assistant | Implemented |
| Collaboration confirmation | Implemented |
| Sample tracking | Implemented |
| Content delivery tracking | Implemented |
| Published content performance tracking | Implemented |
| Second collaboration recommendation | Implemented |
| Content repurpose recommendation | Implemented |
| Feishu OAuth install scaffold | Implemented scaffold |

## Feishu Credentials

You do not need Feishu credentials for local verification.

You need Feishu credentials only when you want the agent to write to a real Feishu Base or when you are building the hosted install app:

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_BASE_TOKEN=
FEISHU_CREATORS_TABLE_ID=
FEISHU_OAUTH_REDIRECT_URI=
FEISHU_OAUTH_SCOPES=
FEISHU_OAUTH_EXPECTED_STATE=
AGENT_API_SECRET=
```

Never commit real credentials. Keep `FEISHU_APP_SECRET` on the hosted server only.

See [Feishu API Credentials Setup](docs/feishu-api-credentials-setup.md).

## For Developers

The API endpoints are intentionally available for local testing, but they are not the user-facing onboarding flow.

For a local install handoff, use [AI Agent Local Install Handoff](docs/ai-agent-local-install.md).

For the workflow map, use [Agent Capability Map](docs/agent-capability-map.md).

For the product checklist, use [Product Build Checklist](docs/product-build-checklist.md).

## Safety Principle

The agent may score, summarize, recommend, and draft. It must not automatically send outreach, promise payment, ship samples, approve content, or publish posts.

---

# 中文

AI Marketing Influencer CRM 是一个以飞书为入口的红人营销工作流系统。

它不是一个单独的静态表格模板。飞书多维表格是操作台，云端 Agent 负责把红人营销流程中的判断、草稿、追踪和推荐写回飞书，并且保留关键人工审批点：

```text
录入/搜索达人
-> 拆解 Campaign 任务
-> 生成 Outreach 与谈判建议
-> 跟踪合作、寄样、内容交付和发布表现
-> 推荐二次合作和内容复用
-> 对外发送、承诺、审批、发布之前保留人工确认
```

## 这个仓库的用途

这个公开仓库用于让新用户或 AI agent 下载项目，并验证产品工作流可以在本地跑通。

本地版本用于安装测试和产品验证。真正面向用户时，用户不应该需要打开 Terminal、常驻本地进程、配置 ngrok，或者手动调用一堆 API。

## 面向用户的理想安装路径

目标用户体验应该是：

1. 用户打开托管应用提供的飞书安装链接。
2. 用户授权飞书应用。
3. 托管服务创建或连接 CRM Base。
4. Agent 把可审核的结果写回飞书。
5. 用户主要在飞书里工作，而不是在 Terminal 里工作。

当前仓库已经包含可测试的 OAuth 安装脚手架：

- `GET /api/install/feishu` 生成飞书 OAuth 授权链接。
- `GET /api/install/feishu/callback` 校验 OAuth callback 的基本形态。
- 真正生产环境仍然需要托管服务完成 token exchange、token 安全存储和飞书 Base 模板创建。

查看：[Feishu OAuth Hosted Install](docs/feishu-oauth-hosted-install.md)。

## 快速开始

如果你是把这个 repo 发给 AI agent 测试，可以直接给它这句话：

```text
Clone this repo and run npm run verify:local. If it passes, summarize the supported workflow capabilities and any remaining hosted-install gaps.
```

仓库链接：

```text
https://github.com/coral-zhong/ai-marketing-influencer-crm
```

如果你自己本地测试：

```bash
git clone https://github.com/coral-zhong/ai-marketing-influencer-crm.git
cd ai-marketing-influencer-crm
npm run verify:local
```

这一个命令会跑完整测试和 smoke test，不需要飞书凭证。

预期结果：

```text
tests pass
smoke returns ok=true
writebackMode is demo
```

## 已覆盖的产品能力

本地验证会覆盖这些工作流能力：

| 工作流 | 状态 |
|---|---|
| 上传/导入达人 CSV | 已实现 |
| 从网站/搜索结果文本提取达人候选 | 已实现 |
| 达人筛选评分 | 已实现 |
| Campaign 创建与任务拆解 | 已实现 |
| Outreach 草稿 | 已实现 |
| 带审批门槛的 Outreach 发送包 | 已实现 |
| 谈判助手 | 已实现 |
| 合作确认 | 已实现 |
| 寄样跟踪 | 已实现 |
| 内容交付跟踪 | 已实现 |
| 已发布内容表现跟踪 | 已实现 |
| 二次合作推荐 | 已实现 |
| 内容复用推荐 | 已实现 |
| 飞书 OAuth 安装脚手架 | 已实现脚手架 |

## 飞书凭证

本地验证不需要飞书凭证。

只有当你希望 Agent 写入真实飞书 Base，或者你要搭建托管安装应用时，才需要配置：

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_BASE_TOKEN=
FEISHU_CREATORS_TABLE_ID=
FEISHU_OAUTH_REDIRECT_URI=
FEISHU_OAUTH_SCOPES=
FEISHU_OAUTH_EXPECTED_STATE=
AGENT_API_SECRET=
```

不要提交真实凭证。`FEISHU_APP_SECRET` 只能保存在托管服务端。

查看：[Feishu API Credentials Setup](docs/feishu-api-credentials-setup.md)。

## 开发者说明

本项目保留 API endpoint，是为了本地测试和未来托管服务接入。它们不是面向普通用户的安装流程。

本地 AI agent 安装测试请看：[AI Agent Local Install Handoff](docs/ai-agent-local-install.md)。

能力地图请看：[Agent Capability Map](docs/agent-capability-map.md)。

产品 checklist 请看：[Product Build Checklist](docs/product-build-checklist.md)。

## 安全原则

Agent 可以评分、总结、推荐和起草内容，但不能自动发送 outreach、承诺付款、寄样、审批内容或发布内容。
