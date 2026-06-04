# AI Agent Local Install Handoff

Use this document when a user gives this GitHub repo link to an AI agent and asks it to install or verify the project locally.

Repo:

```text
https://github.com/coral-zhong/ai-marketing-influencer-crm
```

## Success Criteria

For a non-technical user, prefer the template-first path:

1. Ask the user to copy the complete Feishu Base template into their own workspace.
2. Ask for the copied Base URL.
3. Install and verify this GitHub repo.
4. Connect the agent to the copied Base with `npm run setup:feishu`.

See [Template-First Install](template-first-install.md).

The local install is successful when this command exits with code `0`:

```bash
npm run verify:local
```

Expected output includes:

```json
{
  "ok": true,
  "checks": ["health", "screen_creator", "import_creators", "campaign_plan", "draft_outreach", "creator_search", "outreach_send_package", "negotiation_assistant", "collaboration_confirmation", "sample_tracking", "content_delivery_tracking", "performance_tracking", "viral_breakdown", "second_collaboration_recommendation", "content_repurpose_recommendation", "feishu_oauth_install", "feishu_existing_base_setup", "feishu_create_base_setup"],
  "fitScore": 100,
  "tier": "A",
  "writebackMode": "demo",
  "importedCreators": 1,
  "duplicateCreators": 1,
  "campaignTasks": ["creator_search_planner", "screen_creator", "draft_outreach"],
  "outreachStatus": "Needs Review",
  "creatorSearchCandidates": 1,
  "sendPackageStatus": "Ready To Send",
  "negotiationStatus": "Needs Review",
  "collaborationStatus": "Ready For Fulfillment",
  "sampleStatus": "Received",
  "contentDeliveryStatus": "Awaiting Review",
  "performanceStatus": "Ready For Review",
  "viralBreakdownStatus": "Ready For Review",
  "viralHook": "I stopped carrying three chargers.",
  "engagementRate": 0.1,
  "secondCollaborationStatus": "Recommended",
  "contentRepurposeStatus": "Recommended",
  "feishuInstallStatus": "Ready",
  "feishuCallbackStatus": "Ready To Exchange Token",
  "parsedBaseToken": "bascnLocalSmoke",
  "parsedCreatorsTableId": "tblLocalCreators",
  "createdBaseToken": "base-local-smoke",
  "createdCreatorsTableId": "tbl_Creators"
}
```

`writebackMode: "demo"` is correct for a local install without Feishu credentials.

## Step 1: Check Runtime

This project requires Node.js 20 or newer.

```bash
node --version
npm --version
```

If Node.js is older than 20, install or switch to Node.js 20+ before continuing.

## Step 2: Clone The Repo

```bash
git clone https://github.com/coral-zhong/ai-marketing-influencer-crm.git
cd ai-marketing-influencer-crm
```

There are currently no third-party npm dependencies, so `npm install` is optional. Running it is harmless but not required for local verification.

## Step 3: Run Local Verification

```bash
npm run verify:local
```

This command runs:

1. `npm test`
2. `npm run smoke`

The smoke test starts the agent on an ephemeral local port, calls `/health`, calls `/api/tasks/screen-creator`, validates the response, and shuts the server down.

## Step 4: Run The Agent Manually

```bash
AGENT_DEMO_MODE=true npm start
```

Then, from another terminal:

```bash
curl -s http://localhost:3215/api/tasks/screen-creator \
  -H "content-type: application/json" \
  -d '{
    "creatorRecordId": "local_demo_creator",
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

Stop the server with `Ctrl+C`.

## Optional: Real Feishu Writeback

Only do this if the user explicitly wants to update a real Feishu Creator record.

Create a local `.env` file. Do not commit it.

```bash
cp .env.example .env
```

Fill:

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_BASE_TOKEN=
FEISHU_CREATORS_TABLE_ID=
FEISHU_OAUTH_REDIRECT_URI=
FEISHU_OAUTH_SCOPES=
FEISHU_OAUTH_EXPECTED_STATE=
AGENT_API_SECRET=
AGENT_PORT=3215
AGENT_DEMO_MODE=false
```

Some AI agent sandboxes cannot reach `open.feishu.cn`. If Feishu network access fails inside the agent environment, prepare the repo and ask the user to run the Feishu setup command on their own computer.

If the user already has a Feishu Base, the agent can parse the Base token and Creators table ID from the Base URL:

```bash
npm run setup:feishu -- --base-url "https://your-domain.feishu.cn/base/BASE_TOKEN_HERE?table=TABLE_ID_HERE"
```

If the user wants the agent to create the CRM Base, the Feishu app needs permission to create and manage Bitable resources. Then run:

```bash
npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"
```

The command updates `.env` with `FEISHU_BASE_TOKEN` and `FEISHU_CREATORS_TABLE_ID`.

Then run:

```bash
source .env
npm start
```

Send a request that includes a real `creatorRecordId`. A successful real writeback returns:

```json
{
  "writeback": {
    "mode": "feishu_openapi",
    "written": true
  }
}
```

## Troubleshooting

### `npm run verify:local` fails because Node is too old

Install Node.js 20+ and rerun the command.

### Port 3215 is already in use

For local manual testing, choose another port:

```bash
AGENT_PORT=3220 AGENT_DEMO_MODE=true npm start
```

### Feishu writeback returns `config_missing`

Check that `FEISHU_CREATORS_TABLE_ID` and `creatorRecordId` are both present.

### Feishu writeback returns an API error

Check that the Feishu app has permission to update Bitable records and has access to the target Base.
