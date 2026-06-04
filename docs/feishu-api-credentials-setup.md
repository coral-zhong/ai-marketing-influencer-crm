# Feishu API Credentials Setup

This guide explains how to configure real Feishu writeback for the AI Marketing Influencer CRM.

Local demo mode does not need Feishu credentials. Real writeback does.

## What You Are Setting Up

The agent needs permission to update your Feishu Base.

To do that, you will create a Feishu custom app, give it Base permissions, and provide these values locally:

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_BASE_TOKEN=
FEISHU_CREATORS_TABLE_ID=
AGENT_API_SECRET=
```

## Before You Start

You need:

- a Feishu account
- permission to create a custom Feishu app
- a Feishu Base using the MVP schema
- a `Creators` table inside that Base

If you only want to test the repo locally, stop here and run:

```bash
npm run verify:local
```

## Step 1: Create A Feishu Custom App

1. Open the Feishu Open Platform:

   [https://open.feishu.cn](https://open.feishu.cn)

2. Go to the developer console.

3. Create a new custom app.

4. Copy the app credentials:

   - `App ID`
   - `App Secret`

These become:

```bash
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
```

Keep `App Secret` private. Do not paste it into GitHub, public docs, screenshots, or committed files.

## Step 2: Enable Base / Bitable Permissions

In the Feishu app settings, enable permissions that allow the app to read and update Base records.

At minimum, the app needs permission to update records in Feishu Base / Bitable.

The agent uses this API:

```text
PUT /open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id
```

Official reference:

[Update Bitable record](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update)

Depending on your Feishu console language, the permission may appear as one of these:

- update records
- edit and manage Base
- view, comment, edit, and manage Bitable
- 多维表格记录更新
- 查看、评论、编辑和管理多维表格

After changing permissions, publish or release the app changes if Feishu asks you to do so.

## Step 3: Give The App Access To Your Base

The app must be able to access the specific Base you want to update.

Open your Feishu Base and add the app as a collaborator if your workspace requires it.

The app should have enough permission to update the `Creators` table.

If the app has API scopes but no access to the Base itself, writeback may still fail.

## Step 4: Get Your Base Token

Open your Feishu Base in the browser.

The URL usually looks like:

```text
https://your-domain.feishu.cn/base/BASE_TOKEN_HERE?table=tblxxxx
```

Copy the part after `/base/`.

That value becomes:

```bash
FEISHU_BASE_TOKEN=BASE_TOKEN_HERE
```

In Feishu API docs, this is also called `app_token` for Bitable.

## Step 5: Get The Creators Table ID

Open the `Creators` table in your Feishu Base.

Look at the URL. It usually includes:

```text
?table=TABLE_ID_HERE
```

The table ID often starts with `tbl`.

That value becomes:

```bash
FEISHU_CREATORS_TABLE_ID=TABLE_ID_HERE
```

## Step 6: Create A Local `.env` File

In the cloned repo:

```bash
cp .env.example .env
```

Open `.env` and fill:

```bash
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
FEISHU_BASE_TOKEN=your_base_token
FEISHU_CREATORS_TABLE_ID=your_creators_table_id
AGENT_API_SECRET=choose-a-private-random-string
AGENT_PORT=3215
AGENT_DEMO_MODE=false
```

Important:

- `.env` is ignored by git.
- Do not commit `.env`.
- `AGENT_API_SECRET` protects your local agent endpoint from random requests.

## Step 7: Start The Agent With Credentials

Load the environment variables and start the server:

```bash
source .env
npm start
```

You should see:

```text
AI Marketing Influencer CRM agent listening on :3215
```

## Step 8: Send A Real Writeback Test

You need a real Creator record ID from your Feishu `Creators` table.

Create a test Creator row first. Then copy its record ID.

Send:

```bash
curl -s http://localhost:3215/api/tasks/screen-creator \
  -H "content-type: application/json" \
  -H "x-agent-secret: $AGENT_API_SECRET" \
  -d '{
    "creatorRecordId": "PASTE_REAL_CREATOR_RECORD_ID_HERE",
    "creator": {
      "name": "Maya Tech Finds",
      "platform": "TikTok",
      "profileUrl": "https://example.com/maya",
      "exampleVideoUrl": "https://example.com/video",
      "category": "UGC tech review"
    },
    "campaign": {
      "campaignGoal": "Find creators for short tutorial demos",
      "creatorCriteria": "TikTok UGC review creators"
    }
  }'
```

Successful real writeback returns:

```json
{
  "ok": true,
  "writeback": {
    "mode": "feishu_openapi",
    "written": true
  }
}
```

Then check the Creator row in Feishu. The agent should update fields such as:

- `Fit Score`
- `Tier`
- `Score Confidence`
- `Strengths`
- `Risks`
- `Recommended Collaboration`
- `Screening Summary`
- `Creator Status`

## Troubleshooting

### `writeback.mode` is `demo`

Your agent is still running in demo mode, or credentials are missing.

Check:

```bash
echo $AGENT_DEMO_MODE
echo $FEISHU_APP_ID
echo $FEISHU_BASE_TOKEN
echo $FEISHU_CREATORS_TABLE_ID
```

`AGENT_DEMO_MODE` should be `false` for real writeback.

### `writeback.mode` is `config_missing`

The agent is missing either:

- `FEISHU_CREATORS_TABLE_ID`
- `creatorRecordId`

### Feishu API permission error

Check:

1. The app has Base/Bitable record update permission.
2. The app has been published or released after permission changes.
3. The app has access to the target Base.
4. The `FEISHU_BASE_TOKEN` and `FEISHU_CREATORS_TABLE_ID` are correct.

### Field not found error

Your `Creators` table is missing one or more expected fields.

Compare your Base with:

```text
schema/minimal-crm.schema.json
```

### Invalid secret error

Your request is missing the agent endpoint secret.

Include:

```bash
-H "x-agent-secret: $AGENT_API_SECRET"
```

## Why This Is Still Not One-Click

This setup still requires API credentials because the agent is writing into a private Feishu workspace.

For a true one-click product, the next version should use:

1. a hosted app
2. OAuth authorization
3. automatic Base creation or copying
4. cloud-hosted agent runtime

That would let users click authorize instead of manually copying `APP_ID`, `APP_SECRET`, `BASE_TOKEN`, and `TABLE_ID`.

