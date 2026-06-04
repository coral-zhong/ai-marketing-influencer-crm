# AI Marketing Influencer CRM

**English** | [中文](#中文)

An AI-assisted influencer marketing CRM that runs inside Feishu.

It helps creator partnership teams manage the workflow from creator discovery to outreach, negotiation, sample tracking, content delivery, performance review, viral content breakdown, second collaboration, and content reuse.

The product has two parts:

- a Feishu CRM workspace for the marketing team
- a cloud agent that writes reviewable AI output back into Feishu

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
- viral breakdowns
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
10. breaking down winning content into reusable hooks and creative patterns
11. recommending second collaborations and content reuse

The product follows one rule:

```text
AI can draft, score, summarize, and recommend.
Humans approve before anything external happens.
```

## How To Install

The lowest-friction path is a hosted workspace.

1. Ask the product owner for an installed Feishu CRM workspace.
2. Open the CRM in Feishu.
3. Create a Campaign.
4. Create an `Agent Tasks` row for `campaign_plan`.
5. Review the AI output written back into Feishu.

This proves the core product loop:

```text
Campaign in Feishu
-> cloud agent runs
-> AI plan is written back to Feishu
-> human reviews next actions
```

Self-hosting and developer setup are available, but they are not the recommended path for non-technical users.

Builder guide: [Hosted Agent Install](docs/hosted-agent-install.md)

## Credentials

End users should not need to handle Feishu App ID, App Secret, Base tokens, or API keys.

For the current hosted test, the product owner configures the Feishu app and cloud agent. For a public multi-user product, installation should use Feishu OAuth so each user authorizes access without copying secrets.

## Useful Docs

- [Hosted Agent Install](docs/hosted-agent-install.md)
- [Low-Friction Product Plan](docs/low-friction-product-plan.md)
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

它帮助红人营销团队管理从达人发现、筛选、outreach、谈判、寄样、内容交付、发布表现复盘、爆款内容拆解，到二次合作和内容复用的完整流程。

这个产品由两部分组成：

- 飞书 CRM 工作台：营销团队实际操作的地方
- 云端 Agent：把可审核的 AI 结果写回飞书

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
- Viral Breakdowns
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
10. 拆解爆款内容，提取可复用 hook 和创意结构
11. 推荐二次合作和内容复用

产品遵守一个简单原则：

```text
AI 可以起草、评分、总结和推荐。
任何对外动作都需要人来确认。
```

## 如何安装

阻力最低的路径是使用已经安装好的云端工作区。

1. 向产品方获取已经连接好云端 agent 的飞书 CRM。
2. 在飞书里打开 CRM。
3. 创建一个 Campaign。
4. 在 `Agent Tasks` 里创建一条 `campaign_plan` 任务。
5. 在飞书里审核 AI 写回的结果。

这个测试证明的是：

```text
飞书里的 Campaign
-> 云端 agent 执行
-> AI 结果写回飞书
-> 人来审核下一步动作
```

自托管和开发者安装仍然支持，但不应该作为非技术用户的默认路径。

开发者指南：[Hosted Agent Install](docs/hosted-agent-install.md)

## 凭证说明

终端用户不应该处理飞书 App ID、App Secret、Base token 或 API key。

当前云端测试由产品方配置飞书应用和 cloud agent。正式多用户产品应该走飞书 OAuth，让用户授权访问，而不是复制密钥。

## 有用文档

- [Hosted Agent Install / 云端 Agent 安装](docs/hosted-agent-install.md)
- [Low-Friction Product Plan / 低阻力产品方案](docs/low-friction-product-plan.md)
- [Operation Guide / 操作指南](docs/operation-guide.md)
- [AI Agent Local Install Handoff](docs/ai-agent-local-install.md)

## 安全边界

Agent 不应该自动发送 outreach、承诺付款、确认合作条款、安排寄样、审批达人内容或发布复用内容。

这些动作都应该由人来确认。

## License

MIT
