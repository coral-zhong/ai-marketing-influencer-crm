# Hosted Agent Install

This is the builder and internal-test guide for running the cloud agent.

For a low-friction public product, do not expose this setup to end users. Use hosted OAuth and per-user install storage instead. See [Low-Friction Product Plan](low-friction-product-plan.md).

The validated internal-test path is:

```text
Feishu app creates the CRM Base
-> agent runs on Railway
-> Agent Tasks calls the hosted agent
-> hosted agent writes the result back to Feishu
```

## Product Flow

```text
Feishu app-created Base
-> user creates or updates an Agent Tasks row
-> Feishu automation sends an HTTP request
-> hosted agent runs the workflow
-> hosted agent writes the result back to Agent Tasks
-> user reviews the result in Feishu
```

## Deploy The Agent On Railway

Use this path when you want the agent to stay online without running anything on your own laptop.

Before Railway, make sure the repo is on GitHub and the Feishu app has created or connected a test Base locally.

Recommended internal-test command:

```bash
npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"
```

That command updates `.env` locally. Copy the values from `.env` into Railway variables. Do not commit `.env`.

Railway steps:

1. Open [Railway](https://railway.com/).
2. Create a new project.
3. Choose `Deploy from GitHub repo`.
4. Select `coral-zhong/ai-marketing-influencer-crm` or your fork of this repo.
5. Let Railway detect the Node.js app from `package.json`.
6. Keep the start command as:

```bash
npm start
```

7. Add the environment variables below.
8. Deploy.
9. Open the Railway public domain and check `/health`.

Railway will provide its own `PORT` variable. You do not need to set `AGENT_PORT` on Railway.

Required environment variables:

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_BASE_TOKEN=
FEISHU_TABLES_JSON=
AGENT_API_SECRET=
AGENT_DEMO_MODE=false
```

Optional local-only variable:

```bash
AGENT_PORT=3215
```

Do not expose `FEISHU_APP_SECRET` or `AGENT_API_SECRET` to users.

## Railway Health Check

After deployment, open:

```text
https://<your-railway-domain>/health
```

Expected response:

```json
{
  "ok": true,
  "service": "ai-marketing-influencer-crm"
}
```

If `/health` works, the hosted agent is online.

If Feishu writeback fails later, the most likely cause is Feishu permission, not Railway.

## Feishu Writeback Permission

The hosted agent can connect to Feishu in two different ways:

1. App-created Base for internal testing.
2. OAuth user authorization for public installs.

For the current Railway internal test, use the app-created Base path. The Feishu app creates the CRM Base through OpenAPI, then the same app can write back to that Base.

For a public product, do not ask users to add a Feishu app as a Base collaborator. In many Feishu workspaces, the Base sharing panel only accepts users, groups, departments, or user groups. It may not provide a stable way to add a developer app as a document collaborator.

The public install path should use OAuth user authorization. The user copies the template, clicks the hosted install link, authorizes the app, and the hosted backend writes to the copied Base with that user's `user_access_token`.

If the app can read tables but cannot write records, Feishu may return:

```text
91403 Forbidden
```

That usually means the Railway service is online, but the current token identity cannot edit this specific copied Base.

Decision:

- Internal test: create the Base through the app with `npm run setup:feishu -- --create-new-base`.
- Public product: use hosted OAuth and write as the authorized user.

Internal test command:

```bash
npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"
```

After the command succeeds, copy the new `FEISHU_BASE_TOKEN` and `FEISHU_TABLES_JSON` from `.env` into Railway Variables, then redeploy.

## Hosted Endpoint

Feishu automation should call:

```text
POST https://<your-hosted-agent-domain>/api/agent-tasks/run
```

Headers:

```text
content-type: application/json
x-agent-secret: <AGENT_API_SECRET>
```

Request body:

```json
{
  "taskRecordId": "<Agent Tasks record id>",
  "taskType": "campaign_plan",
  "input": {
    "campaign": {
      "campaignName": "Spring TikTok UGC Test",
      "brand": "Demo Brand",
      "productName": "Magnetic power bank",
      "campaignGoal": "Find creators for short tutorial demos",
      "creatorCriteria": "TikTok UGC review creators"
    }
  }
}
```

Supported hosted task types now:

- `campaign_plan`
- `viral_breakdown`

The endpoint writes back:

- `Status`
- `Permission Level`
- `Output Summary`
- `Output JSON`
- `Error Message`

## Feishu Automation Setup

Create an automation in the copied Base:

1. Trigger: when a record is created in `Agent Tasks`.
2. Condition: `Status` is `pending`.
3. Action: send HTTP request.
4. URL: hosted `/api/agent-tasks/run` endpoint.
5. Method: `POST`.
6. Headers: include `content-type` and `x-agent-secret`.
7. Body: include the task record id, task type, and input fields.

For the first live test, use `campaign_plan`.

## First Live Test

1. Create a Campaign row.
2. Create an Agent Tasks row:
   - `Task Type`: `campaign_plan`
   - `Input Record Type`: `Campaign`
   - `Input Record ID`: the Campaign record id
   - `Status`: `pending`
3. Feishu automation calls the hosted agent.
4. The hosted agent writes output back to the Agent Tasks row.
5. User reviews `Output Summary` and `Output JSON`.

## Current Scope

This hosted path currently provides the trigger and writeback foundation. More task types can be routed through the same endpoint without changing the Feishu automation pattern.

---

# 云端 Agent 安装

这是开发者和内测用的 cloud agent 部署文档。

正式对外产品不要把这些配置暴露给终端用户。对外应该走 hosted OAuth 和每个用户自己的安装配置。见 [Low-Friction Product Plan](low-friction-product-plan.md)。

已经验证通过的内测路径是：

```text
飞书应用自动创建 CRM Base
-> agent 跑在 Railway
-> Agent Tasks 调用云端 agent
-> 云端 agent 把结果写回飞书
```

## 产品流程

```text
飞书应用创建的 Base
-> 用户创建或更新 Agent Tasks 记录
-> 飞书自动化发送 HTTP 请求
-> 云端 agent 执行 workflow
-> 云端 agent 写回 Agent Tasks
-> 用户在飞书里 review 结果
```

## 在 Railway 部署 Agent

选择这条路径后，agent 会一直跑在云端，不需要你的电脑常驻开机。

部署 Railway 之前，先确认这个 repo 已经发布到 GitHub，并且飞书应用已经在本地创建或连接了一张测试 Base。

推荐的内测命令：

```bash
npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"
```

这条命令会更新本地 `.env`。把 `.env` 里的值复制到 Railway Variables。不要把 `.env` 提交到 GitHub。

Railway 操作步骤：

1. 打开 [Railway](https://railway.com/)。
2. 新建 project。
3. 选择 `Deploy from GitHub repo`。
4. 选择 `coral-zhong/ai-marketing-influencer-crm`，或者你 fork 后的 repo。
5. Railway 会根据 `package.json` 识别这是 Node.js app。
6. Start command 保持：

```bash
npm start
```

7. 填下面这些环境变量。
8. Deploy。
9. 打开 Railway 生成的公开域名，访问 `/health`。

Railway 会自动提供自己的 `PORT`。在 Railway 上不需要配置 `AGENT_PORT`。

需要配置环境变量：

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_BASE_TOKEN=
FEISHU_TABLES_JSON=
AGENT_API_SECRET=
AGENT_DEMO_MODE=false
```

只在本地运行时才需要：

```bash
AGENT_PORT=3215
```

不要把 `FEISHU_APP_SECRET` 或 `AGENT_API_SECRET` 暴露给用户。

## Railway 健康检查

部署完成后打开：

```text
https://<你的 Railway 域名>/health
```

期望看到：

```json
{
  "ok": true,
  "service": "ai-marketing-influencer-crm"
}
```

如果 `/health` 正常，说明云端 agent 已经在线。

如果后面飞书写回失败，最常见原因不是 Railway，而是飞书权限。

## 飞书写回权限

云端 agent 有两种连接飞书的方式：

1. 内测用：应用通过 API 自动创建 Base。
2. 对外用：用户 OAuth 授权后，用用户身份写回。

当前 Railway 内测建议走“应用自动创建 Base”路径。飞书应用通过 OpenAPI 创建 CRM Base，然后同一个应用可以写回这张 Base。

对外产品不要要求用户把飞书应用添加为 Base 协作者。很多飞书工作区的 Base 分享面板只支持添加用户、群组、部门或用户组，不一定提供稳定的“把开发者应用加为文档协作者”的入口。

正式产品应该走 OAuth 用户授权。用户复制模板后，点击 hosted install 链接授权，后台用这个用户的 `user_access_token` 写回用户复制后的 Base。

如果应用能读取表结构，但不能写入记录，飞书可能返回：

```text
91403 Forbidden
```

这通常说明 Railway 服务已经在线，但当前 token 身份不能编辑这张具体复制出来的 Base。

结论：

- 内测：用 `npm run setup:feishu -- --create-new-base` 让应用自动创建 Base。
- 对外产品：用 hosted OAuth，让 agent 以授权用户身份写回。

内测命令：

```bash
npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"
```

命令成功后，把 `.env` 里新的 `FEISHU_BASE_TOKEN` 和 `FEISHU_TABLES_JSON` 复制到 Railway Variables，然后重新部署。

## 云端 Endpoint

飞书自动化调用：

```text
POST https://<your-hosted-agent-domain>/api/agent-tasks/run
```

Headers:

```text
content-type: application/json
x-agent-secret: <AGENT_API_SECRET>
```

请求 body：

```json
{
  "taskRecordId": "<Agent Tasks record id>",
  "taskType": "campaign_plan",
  "input": {
    "campaign": {
      "campaignName": "Spring TikTok UGC Test",
      "brand": "Demo Brand",
      "productName": "Magnetic power bank",
      "campaignGoal": "Find creators for short tutorial demos",
      "creatorCriteria": "TikTok UGC review creators"
    }
  }
}
```

当前已支持的云端任务类型：

- `campaign_plan`
- `viral_breakdown`

Endpoint 会写回：

- `Status`
- `Permission Level`
- `Output Summary`
- `Output JSON`
- `Error Message`

## 飞书自动化设置

在复制后的 Base 里创建自动化：

1. 触发条件：`Agent Tasks` 新增记录。
2. 条件：`Status` 是 `pending`。
3. 动作：发送 HTTP 请求。
4. URL：云端 `/api/agent-tasks/run` endpoint。
5. Method：`POST`。
6. Headers：包含 `content-type` 和 `x-agent-secret`。
7. Body：包含 task record id、task type 和 input fields。

第一次真实测试建议先用 `campaign_plan`。

## 第一次真实测试

1. 创建一条 Campaign。
2. 创建一条 Agent Tasks：
   - `Task Type`: `campaign_plan`
   - `Input Record Type`: `Campaign`
   - `Input Record ID`: Campaign record id
   - `Status`: `pending`
3. 飞书自动化调用云端 agent。
4. 云端 agent 写回 Agent Tasks。
5. 用户在 `Output Summary` 和 `Output JSON` 里 review 结果。

## 当前范围

这条 hosted 路径目前打通的是触发和写回基础。之后更多 task type 可以继续复用同一个 endpoint，不需要改变飞书自动化模式。
