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

## Docs

- [Productization Plan](docs/productization-plan.md)
- [Cloud Agent MVP Spec](docs/cloud-agent-mvp-spec.md)
- [Install Test Runbook](docs/install-test-runbook.md)
- [Build-in-Public Positioning Post](docs/positioning-post.md)

## Schema

- [Minimal Feishu CRM Schema](schema/minimal-crm.schema.json)

## Safety Principle

The agent may score, summarize, recommend, and draft. It must not automatically send outreach, promise payment, ship samples, approve content, or publish posts.
