# Hosted Agent Install

This is the recommended path for a real user experience.

The user copies the Feishu CRM template. The agent runs in the cloud. Feishu automation calls the hosted agent when an `Agent Tasks` record is created.

## Product Flow

```text
Feishu Base template
-> user creates or updates an Agent Tasks row
-> Feishu automation sends an HTTP request
-> hosted agent runs the workflow
-> hosted agent writes the result back to Agent Tasks
-> user reviews the result in Feishu
```

## Deploy The Agent On Railway

Use this path when you want the agent to stay online without running anything on your own laptop.

Before Railway, make sure the repo is on GitHub and your copied Feishu Base URL has already been connected locally once:

```bash
npm run setup:feishu -- --base-url "<copied Feishu Base URL>"
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

If Feishu writeback fails later, the most likely cause is Feishu permission, not Railway. The Feishu app must have permission to edit the copied Base.

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

这是更接近真实用户体验的路径。

用户复制飞书 CRM 模板。Agent 运行在云端。飞书自动化在 `Agent Tasks` 新增记录时调用云端 agent。

## 产品流程

```text
飞书 Base 模板
-> 用户创建或更新 Agent Tasks 记录
-> 飞书自动化发送 HTTP 请求
-> 云端 agent 执行 workflow
-> 云端 agent 写回 Agent Tasks
-> 用户在飞书里 review 结果
```

## 在 Railway 部署 Agent

选择这条路径后，agent 会一直跑在云端，不需要你的电脑常驻开机。

部署 Railway 之前，先确认这个 repo 已经发布到 GitHub，并且你已经在本地用复制后的飞书 Base URL 连接过一次：

```bash
npm run setup:feishu -- --base-url "<复制后的飞书 Base URL>"
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

如果后面飞书写回失败，最常见原因不是 Railway，而是飞书权限。你的飞书应用需要有复制后 Base 的编辑权限。

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
