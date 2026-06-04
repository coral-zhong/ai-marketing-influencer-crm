# Feishu Connection Setup

Use this guide when connecting AI Marketing Influencer CRM to a real Feishu Base.

For local trial mode, no Feishu credentials are needed. For real writeback, the agent needs permission to access your Feishu workspace.

## What The User Provides

The user should only need to provide:

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
```

Then choose one path:

- Existing Base: paste a Feishu Base URL.
- New Base: ask the agent to create a new CRM Base.

`AGENT_API_SECRET` is not from Feishu. It is a private shared secret for the local agent endpoint. The AI agent can generate any long random value, for example:

```bash
AGENT_API_SECRET=ai-crm-local-random-private-string
```

## Feishu App Permissions

In Feishu Open Platform, enable permissions for:

- creating Bitable/Base resources
- viewing, commenting, editing, and managing Bitable/Base
- updating Bitable/Base records

Depending on the Feishu console language, these may appear as:

- 创建多维表格
- 查看、评论、编辑和管理多维表格
- 多维表格记录更新

After changing permissions, publish or release the app changes if Feishu asks you to do so.

Official Feishu references:

- Create Bitable app: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/create
- Create Bitable table: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/create
- Create Bitable view: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/create
- Update Bitable record: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update

## Important: Where The Feishu API Call Runs

If the AI agent is running inside a restricted sandbox, it may not be able to access `open.feishu.cn` even when the Feishu credentials are correct.

That is an environment limitation, not a credential problem.

In that case, let the agent prepare the repo and `.env`, then run the final Feishu setup command on the user's own computer. The local command will call Feishu OpenAPI and write the returned Base values back into `.env`.

## Path A: Existing Feishu Base

Ask the user for the browser URL of the `Creators` table.

Example:

```text
https://your-domain.feishu.cn/base/bascnxxxx?table=tblxxxx
```

The agent can parse:

- `FEISHU_BASE_TOKEN=bascnxxxx`
- `FEISHU_CREATORS_TABLE_ID=tblxxxx`

Run:

```bash
npm run setup:feishu -- --base-url "https://your-domain.feishu.cn/base/bascnxxxx?table=tblxxxx"
```

The command updates `.env` and prints a safe summary:

```json
{
  "ok": true,
  "mode": "existing_base_url",
  "baseToken": "bascnxxxx",
  "creatorsTableId": "tblxxxx"
}
```

## Path B: Create A New CRM Base

If the user does not have a Base, the agent can create one through Feishu OpenAPI.

Run:

```bash
npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"
```

The agent will:

1. get `tenant_access_token` using `FEISHU_APP_ID` and `FEISHU_APP_SECRET`
2. create a new Feishu Base
3. create tables from `schema/minimal-crm.schema.json`
4. create fields and select options
5. create schema views
6. return the created `baseToken`, `creatorsTableId`, `tables`, and `views`

The command updates `.env` and prints a safe summary:

```json
{
  "ok": true,
  "mode": "created",
  "baseToken": "bascnxxxx",
  "creatorsTableId": "tblCreators",
  "tables": {
    "Campaigns": "tblCampaigns",
    "Creators": "tblCreators",
    "Agent Tasks": "tblAgentTasks"
  }
}
```

## Local `.env`

```bash
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
FEISHU_BASE_TOKEN=parsed_or_created_base_token
FEISHU_CREATORS_TABLE_ID=parsed_or_created_creators_table_id
AGENT_API_SECRET=generated_private_string
AGENT_PORT=3215
AGENT_DEMO_MODE=false
```

Do not commit `.env`.

## Real Writeback Check

After setup:

```bash
source .env
npm start
```

Then ask the agent to run a writeback check against a real Creator row. A successful response includes:

```json
{
  "writeback": {
    "mode": "feishu_openapi",
    "written": true
  }
}
```

## Hosted Install Path

For a fully managed product, users should not copy `FEISHU_APP_SECRET` into a local install.

The hosted path should use:

1. Feishu OAuth authorization
2. hosted token exchange
3. secure tenant/user install storage
4. automatic Base creation or template copy
5. cloud-hosted agent runtime
