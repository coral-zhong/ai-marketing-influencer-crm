# Feishu Agent Task Automation

This guide configures Feishu Base automation so a new `Agent Tasks` row can call the hosted agent.

## What The Automation Does

```text
Agent Tasks row is created or changed to pending
-> Feishu sends an HTTP POST request
-> Railway agent reads the task and related Campaign from Feishu
-> Railway agent writes the result back to Agent Tasks
```

## Before You Start

You need:

- a hosted agent URL
- an `AGENT_API_SECRET`
- an app-created or OAuth-connected Feishu CRM Base
- one Campaign row
- one Agent Tasks row that points to that Campaign record ID

Hosted endpoint:

```text
https://ai-marketing-influencer-crm-production.up.railway.app/api/agent-tasks/run
```

## Create The Automation In Feishu

1. Open the CRM Base in Feishu.
2. Open `Agent Tasks`.
3. Click `自动化`.
4. Create a new automation.
5. Choose a trigger:
   - recommended: record is created or updated and `Status` is `pending`
   - fallback: record is created
6. Add an action: `发送 HTTP 请求`.
7. Method: `POST`.
8. URL:

```text
https://ai-marketing-influencer-crm-production.up.railway.app/api/agent-tasks/run
```

9. Headers:

```text
content-type: application/json
x-agent-secret: <AGENT_API_SECRET>
```

10. Body:

```json
{
  "taskRecordId": "<insert current record id variable>"
}
```

In the Feishu body editor, use the variable picker to insert the current `Agent Tasks` record ID. Do not type a fake record ID manually.

## First Test

Create a Campaign row.

Create an Agent Tasks row:

| Field | Value |
|---|---|
| Task Name | Railway campaign plan test |
| Task Type | campaign_plan |
| Input Record Type | Campaign |
| Input Record ID | the Campaign record ID |
| Status | pending |
| Permission Level | review |

When the automation runs, the same Agent Tasks row should update:

- `Status`: `needs_review`
- `Output Summary`: campaign plan summary
- `Output JSON`: structured recommended tasks
- `Error Message`: empty

## If It Fails

If the HTTP request fails, check:

- Railway `/health` returns `ok: true`
- `x-agent-secret` matches Railway `AGENT_API_SECRET`
- `taskRecordId` is the Feishu record ID, not the row title
- `Input Record ID` points to a real Campaign record
- Railway variables point to the same Base

---

# 飞书 Agent Tasks 自动化

这份指南用于在飞书多维表格里配置自动化，让新增的 `Agent Tasks` 记录可以调用云端 agent。

## 自动化会做什么

```text
Agent Tasks 新增或变成 pending
-> 飞书发送 HTTP POST 请求
-> Railway agent 从飞书读取任务和对应 Campaign
-> Railway agent 把结果写回 Agent Tasks
```

## 开始前需要准备

你需要：

- 云端 agent URL
- `AGENT_API_SECRET`
- 一张应用创建或 OAuth 连接过的飞书 CRM Base
- 一条 Campaign 记录
- 一条指向该 Campaign record ID 的 Agent Tasks 记录

云端 endpoint：

```text
https://ai-marketing-influencer-crm-production.up.railway.app/api/agent-tasks/run
```

## 在飞书里创建自动化

1. 打开飞书 CRM Base。
2. 打开 `Agent Tasks`。
3. 点击 `自动化`。
4. 新建自动化。
5. 选择触发条件：
   - 推荐：记录新增或更新，并且 `Status` 是 `pending`
   - 备选：记录新增时触发
6. 添加动作：`发送 HTTP 请求`。
7. Method：`POST`。
8. URL：

```text
https://ai-marketing-influencer-crm-production.up.railway.app/api/agent-tasks/run
```

9. Headers：

```text
content-type: application/json
x-agent-secret: <AGENT_API_SECRET>
```

10. Body：

```json
{
  "taskRecordId": "<插入当前记录 ID 变量>"
}
```

在飞书 body 编辑器里，用变量选择器插入当前 `Agent Tasks` 的记录 ID。不要手动输入一个假的 record ID。

## 第一次测试

先创建一条 Campaign。

再创建一条 Agent Tasks：

| 字段 | 值 |
|---|---|
| Task Name | Railway campaign plan test |
| Task Type | campaign_plan |
| Input Record Type | Campaign |
| Input Record ID | Campaign 那一行的 record ID |
| Status | pending |
| Permission Level | review |

自动化运行后，同一条 Agent Tasks 应该被更新：

- `Status`: `needs_review`
- `Output Summary`: campaign plan 摘要
- `Output JSON`: 结构化推荐任务
- `Error Message`: 空

## 如果失败

优先检查：

- Railway `/health` 返回 `ok: true`
- `x-agent-secret` 和 Railway 的 `AGENT_API_SECRET` 一致
- `taskRecordId` 是飞书 record ID，不是行标题
- `Input Record ID` 指向真实 Campaign record
- Railway variables 指向同一张 Base
