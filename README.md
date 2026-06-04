# AI Marketing Influencer CRM

An AI influencer CRM that installs into Feishu, captures creators, and runs cloud agents that write reviewable campaign work back into your team's workspace.

This is not positioned as a standalone CRM template. The Feishu Base is the control panel. The product value is the loop:

```text
capture creator
-> run AI marketing agent
-> write fit score, risks, strengths, and next action back to Feishu
-> human reviews before any external action
```

## Current MVP

The first validation loop is intentionally narrow:

```text
Creator capture
-> screen_creator cloud agent
-> Feishu writeback
-> Needs Review
```

The user should not need to run Node locally, configure launchd, expose ngrok, or read terminal logs.

## Product Layers

| Layer | Role |
|---|---|
| Feishu CRM | Creator records, campaign context, task state, approval workflow |
| Creator capture | Fast intake through Feishu form, Base row, or future browser capture |
| Cloud Agent | Screens creators and writes useful outputs back to Feishu |
| Human review | Keeps outreach, commitments, payments, and content approvals manual |

## Repository Status

This repo is the public productization workspace for the MVP. It will contain:

- Feishu schema docs
- Cloud agent MVP spec
- deployment notes
- self-hosting guidance
- public positioning material

Local developer automation is intentionally not the default path.

## Quick Start

Fastest local verification:

```bash
npm run verify:local
```

Run the Cloud Agent MVP locally:

```bash
npm test
npm start
```

In another terminal, send a demo screening request:

```bash
curl -s http://localhost:3215/api/tasks/screen-creator \
  -H "content-type: application/json" \
  -d '{
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

Optional request protection:

```bash
AGENT_API_SECRET="replace-me" npm start
```

Then include:

```bash
-H "x-agent-secret: replace-me"
```

The current public MVP returns deterministic screening output and a demo writeback status. Direct Feishu OpenAPI writeback is intentionally isolated behind `src/feishuClient.js` for the next implementation step.

Import a small creator CSV:

```bash
curl -s http://localhost:3215/api/creators/import \
  -H "content-type: application/json" \
  -d '{
    "csv": "Creator Name,Platform,Profile URL,Category\nMaya Tech Finds,TikTok,https://example.com/maya,UGC tech review\nAlex Home Lab,YouTube,https://example.com/alex,Home tech"
  }'
```

Plan a Campaign into agent tasks:

```bash
curl -s http://localhost:3215/api/campaigns/plan \
  -H "content-type: application/json" \
  -d '{
    "campaign": {
      "campaignName": "Spring TikTok UGC Test",
      "brand": "Demo Brand",
      "productName": "Magnetic power bank",
      "campaignGoal": "Find creators who can make short tutorial demos.",
      "creatorCriteria": "TikTok UGC review creators with clear product demos."
    }
  }'
```

Draft review-only outreach:

```bash
curl -s http://localhost:3215/api/outreach/draft \
  -H "content-type: application/json" \
  -d '{
    "creator": {
      "name": "Maya Tech Finds",
      "platform": "TikTok",
      "category": "UGC tech review"
    },
    "campaign": {
      "brand": "Demo Brand",
      "productName": "Magnetic power bank",
      "campaignGoal": "Find creators who can make short tutorial demos."
    }
  }'
```

Extract creator candidates from website/search result text:

```bash
curl -s http://localhost:3215/api/creators/search \
  -H "content-type: application/json" \
  -d '{
    "campaign": {
      "creatorCriteria": "UGC tech review creators"
    },
    "sources": [
      {
        "url": "https://example.com/top-tech-creators",
        "text": "Maya Tech Finds - TikTok product demos. Profile: https://www.tiktok.com/@mayatechfinds"
      }
    ]
  }'
```

Prepare an approved outreach send package:

```bash
curl -s http://localhost:3215/api/outreach/send-package \
  -H "content-type: application/json" \
  -d '{
    "approvalStatus": "Approved",
    "channel": "email",
    "recipient": "maya@example.com",
    "subject": "Demo Brand x Maya Tech Finds",
    "message": "Hi Maya,\nWould you be open to reviewing a brief?",
    "creator": { "name": "Maya Tech Finds" },
    "campaign": { "brand": "Demo Brand", "productName": "Magnetic power bank" }
  }'
```

Assist a negotiation reply without making commitments:

```bash
curl -s http://localhost:3215/api/negotiation/assist \
  -H "content-type: application/json" \
  -d '{
    "creator": { "name": "Maya Tech Finds" },
    "campaign": {
      "brand": "Demo Brand",
      "productName": "Magnetic power bank",
      "offerRange": "$100-$200 plus sample"
    },
    "inboundMessage": "Can you pay $500?"
  }'
```

Confirm an approved collaboration into a fulfillment-ready draft:

```bash
curl -s http://localhost:3215/api/collaborations/confirm \
  -H "content-type: application/json" \
  -d '{
    "approvalStatus": "Approved",
    "creator": { "name": "Maya Tech Finds" },
    "campaign": { "campaignName": "Spring TikTok UGC Test", "productName": "Magnetic power bank" },
    "terms": {
      "deliverables": "1 TikTok video",
      "offer": "$150 plus sample",
      "deadline": "2026-07-01"
    }
  }'
```

Track sample status:

```bash
curl -s http://localhost:3215/api/samples/track \
  -H "content-type: application/json" \
  -d '{
    "collaboration": {
      "collaborationName": "Maya Tech Finds x Spring TikTok UGC Test",
      "creatorName": "Maya Tech Finds"
    },
    "sample": {
      "trackingNumber": "1Z999",
      "carrier": "UPS",
      "deliveredAt": "2026-06-08",
      "latestEvent": "Delivered"
    }
  }'
```

Track content delivery status:

```bash
curl -s http://localhost:3215/api/content/delivery-track \
  -H "content-type: application/json" \
  -d '{
    "collaboration": {
      "collaborationName": "Maya Tech Finds x Spring TikTok UGC Test",
      "creatorName": "Maya Tech Finds"
    },
    "content": {
      "deliverableName": "TikTok demo video",
      "dueDate": "2026-07-01",
      "submittedAt": "2026-06-29",
      "submittedUrl": "https://example.com/submitted-video"
    },
    "today": "2026-06-30"
  }'
```

## Feishu Writeback

To enable real Feishu writeback, configure:

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_BASE_TOKEN=
FEISHU_CREATORS_TABLE_ID=
AGENT_API_SECRET=
```

The `screen_creator` endpoint also needs `creatorRecordId` in the request body so it knows which Creator row to update.

The Feishu client uses:

- `POST /open-apis/auth/v3/tenant_access_token/internal`
- `PUT /open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id`

Official references:

- [Get tenant_access_token](https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal)
- [Update Bitable record](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update)

## Docs

- [Productization Plan](docs/productization-plan.md)
- [Cloud Agent MVP Spec](docs/cloud-agent-mvp-spec.md)
- [Install Test Runbook](docs/install-test-runbook.md)
- [AI Agent Local Install Handoff](docs/ai-agent-local-install.md)
- [Feishu API Credentials Setup](docs/feishu-api-credentials-setup.md)
- [Influencer Marketing Workflow Roadmap](docs/influencer-marketing-workflow-roadmap.md)
- [Agent Capability Map](docs/agent-capability-map.md)
- [Build-in-Public Positioning Post](docs/positioning-post.md)
- [Product Build Checklist](docs/product-build-checklist.md)

## Schema

- [Minimal Feishu CRM Schema](schema/minimal-crm.schema.json)

## Safety Principle

The agent may score, summarize, recommend, and draft. It must not automatically send outreach, promise payment, ship samples, approve content, or publish posts.
