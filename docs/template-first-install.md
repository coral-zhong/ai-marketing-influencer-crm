# Template-First Install

This is the recommended install path for non-technical users.

The user starts with a complete Feishu Base template, then connects the GitHub repo for the agent capabilities.

## What The User Does

1. Open the shared Feishu Base template.
2. Make a copy into their own Feishu workspace.
3. Open the copied Base and copy the browser URL.
4. Give the GitHub repo link and the copied Base URL to an AI agent or technical helper.
5. The agent installs the local service, verifies it, and connects the CRM agent to the copied Base.

Copy this prompt:

```text
Install https://github.com/coral-zhong/ai-marketing-influencer-crm for me. I already copied the Feishu CRM template. Connect the agent to this Base URL: <paste my Feishu Base URL>.
```

## What The Template Contains

The full template includes:

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

The template is the product workspace. The GitHub repo provides the agent service, install verification, Feishu writeback boundary, and workflow logic.

## What The GitHub Repo Adds

The repo adds:

- creator search from website snippets
- creator screening
- campaign task breakdown
- outreach drafting
- outreach send package
- negotiation assistant
- collaboration confirmation
- sample tracking
- content delivery tracking
- published content performance tracking
- viral content breakdown
- second collaboration recommendation
- content repurpose recommendation
- Feishu setup command for connecting the copied Base

## Why This Is Better For First-Time Users

Copying a template lets the user see the whole CRM immediately.

They do not need to wait for a script to create tables before understanding the product. They can inspect the workflow, views, and operation guide first, then connect the agent.

The API-created Base path still exists for developer installs and internal tests, but template-first should be the default public install path.

For automatic Feishu triggers, deploy the agent as a hosted service. See [Hosted Agent Install](hosted-agent-install.md).

## Connecting The Copied Base

After the user copies the template, run:

```bash
npm run setup:feishu -- --base-url "https://your-domain.feishu.cn/base/bascnxxxx?table=tblxxxx"
```

This writes the Base token and Creators table ID into `.env`.

For full-template installs, the setup also stores the complete table map in `FEISHU_TABLES_JSON`. If the Operation Guide table was created before seed records were added to this repo, run:

```bash
npm run seed:guide
```

This writes the default workflow steps into the copied or created `Operation Guide` table.

If the AI agent cannot access `open.feishu.cn`, this is usually an agent sandbox network limitation. Run the command on the user's own computer.

If `npm run seed:guide` or real writeback returns `Forbidden`, the copied Base exists but the Feishu app does not have edit access to that copied document. Open the copied Base in Feishu, share it with the integration app as a document collaborator, and give it edit or manage permission. Feishu documents describe this as adding the app to the document collaborators / document app permissions.

---

# 模板优先安装

这是推荐给非技术用户的默认安装路径。

用户先复制一个完整的飞书多维表格模板，再连接 GitHub 里的 agent 能力。

## 用户需要做什么

1. 打开共享的飞书 CRM Base 模板。
2. 复制到自己的飞书空间。
3. 打开复制后的 Base，并复制浏览器里的 Base 链接。
4. 把 GitHub repo 链接和复制后的 Base 链接发给 AI agent 或技术助手。
5. Agent 安装本地服务、完成验证，并把 CRM agent 连接到这个 Base。

可以直接复制这句话：

```text
Install https://github.com/coral-zhong/ai-marketing-influencer-crm for me. I already copied the Feishu CRM template. Connect the agent to this Base URL: <paste my Feishu Base URL>.
```

## 模板里包含什么

完整模板包含：

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

模板是用户看到和操作的产品工作台。GitHub repo 提供 agent 服务、安装验证、飞书写回边界和红人营销 workflow 逻辑。

## GitHub Repo 负责什么

repo 提供：

- 从网站片段搜索达人
- 达人筛选
- Campaign 任务拆解
- Outreach 起草
- Outreach 发送包
- 谈判助手
- 合作确认
- 寄样跟踪
- 内容交付跟踪
- 已发布内容表现跟踪
- 爆款内容拆解
- 二次合作推荐
- 内容复用推荐
- 连接复制后 Base 的飞书 setup 命令

## 为什么第一次安装推荐这条路径

复制模板以后，用户会马上看到完整 CRM。

他们不需要等脚本创建表格以后才理解产品，也不需要一开始就面对 API 创建流程。用户可以先查看完整工作流、视图和操作指南，再连接 agent。

自动创建 Base 的路径仍然保留，适合开发者安装和内部测试；但公开对外时，默认应该走模板优先。

如果需要飞书自动触发 agent，需要把 agent 部署成云端服务。见 [Hosted Agent Install](hosted-agent-install.md)。

## 连接复制后的 Base

用户复制模板后，运行：

```bash
npm run setup:feishu -- --base-url "https://your-domain.feishu.cn/base/bascnxxxx?table=tblxxxx"
```

这会把 Base token 和 Creators table ID 写入 `.env`。

对于完整模板安装，setup 也会把完整表格映射写入 `FEISHU_TABLES_JSON`。如果 Operation Guide 表是在这个 repo 增加种子内容之前创建的，可以运行：

```bash
npm run seed:guide
```

这会把默认 workflow 步骤写入复制或创建出来的 `Operation Guide` 表。

如果 AI agent 访问不了 `open.feishu.cn`，通常是 agent 沙箱网络限制。让用户在自己的电脑上运行这条命令即可。

如果 `npm run seed:guide` 或真实写回返回 `Forbidden`，说明复制后的 Base 存在，但飞书应用还没有这份复制文档的编辑权限。打开复制后的 Base，在分享/协作者里把对应集成应用加入为文档协作者，并授予可编辑或可管理权限。飞书文档里通常称为给应用开通云文档权限，或把应用添加为文档协作应用。
