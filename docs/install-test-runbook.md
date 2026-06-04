# Install Test Runbook

Use this runbook to test whether the MVP can be understood and operated without the local developer automation stack.

## Goal

Prove this loop:

```text
clean Feishu CRM
-> captured creator
-> Cloud Agent screen_creator request
-> reviewable output
```

## Prerequisites

- A clean Feishu Base named `AI Influencer CRM - Cloud Agent Install Test`
- The fields from [`schema/minimal-crm.schema.json`](../schema/minimal-crm.schema.json)
- A running Cloud Agent endpoint

For local smoke testing:

```bash
npm test
AGENT_DEMO_MODE=true npm start
```

## Step 1: Create MVP Tables

Create these Feishu Base tables:

- `Campaigns`
- `Creators`
- `Agent Tasks`

Use the schema file as the source of truth for fields, select options, and core views.

## Step 2: Add Campaign Context

Add one `Campaigns` row:

| Field | Example |
|---|---|
| Campaign Name | Spring TikTok UGC Test |
| Brand | Demo Brand |
| Product Name | Magnetic power bank |
| Campaign Goal | Find creators who can make short tutorial-style TikTok demos. |
| Target Market | US |
| Creator Criteria | TikTok UGC review creators with clear product demos. |
| Claims Allowed | Portable charger, magnetic attachment, everyday carry. |
| Claims To Avoid | Medical, safety, or guaranteed battery-life claims. |
| Status | Active |

## Step 3: Capture One Creator

Add one `Creators` row:

| Field | Example |
|---|---|
| Creator Name | Maya Tech Finds |
| Platform | TikTok |
| Profile URL | `https://example.com/maya` |
| Example Video URL | `https://example.com/video` |
| Category | UGC tech review |
| Notes | Strong short-form product demo style. |
| Creator Status | To Screen |

## Step 4: Trigger The Agent

Local demo request:

```bash
curl -s http://localhost:3215/api/tasks/screen-creator \
  -H "content-type: application/json" \
  -d '{
    "creatorRecordId": "manual_install_test_creator",
    "creator": {
      "name": "Maya Tech Finds",
      "platform": "TikTok",
      "profileUrl": "https://example.com/maya",
      "exampleVideoUrl": "https://example.com/video",
      "category": "UGC tech review",
      "notes": "Strong short-form product demo style."
    },
    "campaign": {
      "campaignGoal": "Find creators who can make short tutorial-style TikTok demos.",
      "creatorCriteria": "TikTok UGC review creators with clear product demos."
    }
  }'
```

## Step 5: Review Expected Output

The response should include:

- `fitScore`
- `tier`
- `scoreConfidence`
- `strengths`
- `risks`
- `recommendedCollaboration`
- `screeningSummary`
- `writeback`

For the public MVP, `writeback.mode` is `demo` unless real Feishu credentials and direct writeback are implemented.

## Pass Condition

The install test passes when a non-technical operator can understand:

1. where creators are captured
2. what the agent produced
3. whether the result needs human review
4. whether any error occurred

The test fails if the operator must understand local polling, launchd, ngrok, hidden logs, or terminal-only failures.

