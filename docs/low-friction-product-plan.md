# Low-Friction Product Plan

Last updated: 2026-06-04

## Product Definition

AI Marketing Influencer CRM is not an AI-agent builder for Feishu.

It is a workflow product for creator partnership teams:

```text
Create a campaign
-> let AI break it into creator tasks
-> review outreach, negotiation, sample, content, and performance work in Feishu
-> reuse what worked
```

The user should feel they are using a red-hot marketing workflow, not configuring infrastructure.

## Lowest-Friction User Experience

The first user experience should be:

1. Open an already-installed Feishu CRM.
2. Create one Campaign.
3. Create or trigger one Agent Task.
4. See AI output written back into Feishu.
5. Review the output and decide the next action.

The user should not handle:

- Feishu App ID
- Feishu App Secret
- Base token
- table IDs
- Railway variables
- local terminal commands
- ngrok or local always-on runners

## Current Tested Path

This path is working now:

```text
Feishu app creates the CRM Base
-> Railway hosts the cloud agent
-> Agent Tasks calls /api/agent-tasks/run
-> cloud agent runs campaign_plan
-> result is written back to Feishu
```

Verified result:

```json
{
  "endpointStatus": 200,
  "taskStatus": "needs_review",
  "writebackMode": "feishu_openapi",
  "written": true
}
```

This is the right path for internal testing because the Feishu app can write to the Base it created.

## Public Product Path

For public users, do not ask them to create a Feishu developer app or add an app as a Base collaborator.

That creates too much friction and is not reliable across Feishu workspaces.

The public product should work like this:

```text
User opens install link
-> user authorizes Feishu OAuth
-> hosted backend creates or connects the CRM Base
-> backend stores install config securely
-> Feishu/agent task triggers cloud agent
-> cloud agent writes back as the authorized user or installed app
```

The user-facing copy should be:

```text
Connect your Feishu workspace. We will install the CRM and connect the AI workflow for you.
```

Not:

```text
Create a Feishu app, copy App Secret, paste Base Token, configure Railway.
```

## What GitHub Is For

The GitHub repo should be positioned as:

```text
Open-source self-hosting kit and reference implementation.
```

It is useful for:

- technical evaluators
- AI coding agents
- self-hosted teams
- internal testing
- transparency around workflow logic

It should not be the primary onboarding surface for a non-technical marketer.

## First Sellable Demo

The first demo should show one end-to-end workflow:

1. Campaign is created in Feishu.
2. AI creates a campaign plan.
3. The plan writes back to `Agent Tasks`.
4. The user reviews:
   - creator search direction
   - screening criteria
   - outreach next step

This is enough to prove:

```text
The CRM is not just a table.
It is a marketing workflow that AI can help move forward.
```

## Next Build Priority

1. Add Feishu automation for `Agent Tasks`.
2. Route more task types through `/api/agent-tasks/run`.
3. Build hosted OAuth token exchange and install storage.
4. Replace manual Railway variables with per-install config.
5. Add a simple hosted install success page.

## Product Boundary

AI can:

- draft
- score
- summarize
- recommend
- write internal review output

Humans approve:

- sending outreach
- promising payment
- confirming collaboration terms
- shipping samples
- approving creator content
- reusing published content

---

# 低阻力产品方案

最后更新：2026-06-04

## 产品定义

AI Marketing Influencer CRM 不是一个“给飞书加 AI agent 的开发者工具”。

它是一个给红人营销团队使用的工作流产品：

```text
创建 Campaign
-> AI 拆解成达人任务
-> 在飞书里审核 outreach、谈判、寄样、内容交付和表现复盘
-> 把有效内容沉淀成可复用打法
```

用户应该感觉自己在使用一个红人营销工作台，而不是在配置技术基础设施。

## 阻力最低的用户体验

第一次体验应该是：

1. 打开已经安装好的飞书 CRM。
2. 创建一个 Campaign。
3. 创建或触发一条 Agent Task。
4. 在飞书里看到 AI 写回的结果。
5. 审核结果并决定下一步。

用户不应该处理：

- 飞书 App ID
- 飞书 App Secret
- Base token
- table ID
- Railway variables
- 本地 terminal 命令
- ngrok 或本地常驻服务

## 当前已经跑通的路径

现在已经跑通的是：

```text
飞书应用自动创建 CRM Base
-> Railway 托管 cloud agent
-> Agent Tasks 调用 /api/agent-tasks/run
-> cloud agent 执行 campaign_plan
-> 结果写回飞书
```

验证结果：

```json
{
  "endpointStatus": 200,
  "taskStatus": "needs_review",
  "writebackMode": "feishu_openapi",
  "written": true
}
```

这条路径适合内测，因为飞书应用可以写回自己创建的 Base。

## 对外产品路径

对外用户不要让他们创建飞书开发者应用，也不要要求他们把应用加成 Base 协作者。

这两个动作阻力很高，而且在不同飞书空间里不稳定。

正式产品应该是：

```text
用户打开安装链接
-> 用户授权飞书 OAuth
-> hosted backend 创建或连接 CRM Base
-> backend 安全保存安装配置
-> 飞书/Agent Task 触发 cloud agent
-> cloud agent 以授权用户或已安装应用身份写回
```

对用户说：

```text
连接你的飞书工作区，我们会帮你安装 CRM 并连接 AI 工作流。
```

不要对用户说：

```text
创建飞书应用，复制 App Secret，粘贴 Base Token，配置 Railway。
```

## GitHub 的角色

GitHub repo 应该定位成：

```text
开源自托管工具包和参考实现。
```

它适合：

- 技术评估者
- AI coding agent
- 想自托管的团队
- 内部测试
- 公开展示 workflow 逻辑

它不应该是非技术营销用户的主要 onboarding 界面。

## 第一个可销售 Demo

第一个 demo 只需要展示一个完整闭环：

1. 在飞书里创建 Campaign。
2. AI 生成 Campaign Plan。
3. 结果写回 `Agent Tasks`。
4. 用户审核：
   - 达人搜索方向
   - 筛选标准
   - outreach 下一步

这足够证明：

```text
这个 CRM 不只是表格。
它是一个能被 AI 推进的红人营销工作流。
```

## 下一步优先级

1. 配置飞书 `Agent Tasks` 自动化。
2. 把更多 task type 接进 `/api/agent-tasks/run`。
3. 实现 hosted OAuth token exchange 和安装配置存储。
4. 用每个用户自己的 install config 替代手动 Railway variables。
5. 做一个简单的 hosted install success page。

## 产品边界

AI 可以：

- 起草
- 评分
- 总结
- 推荐
- 写内部审核结果

人来批准：

- 发送 outreach
- 承诺付款
- 确认合作条款
- 安排寄样
- 审批达人内容
- 复用已发布内容
