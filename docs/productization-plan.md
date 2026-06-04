# Productization Plan

Last updated: 2026-06-04

## Core Decision

This product should not be sold as a standalone Feishu Base template.

The product value is the bundle:

1. **Creator capture**: users can quickly save creators, videos, links, and candidate notes into the system.
2. **Cloud Agent processing**: AI screens creators, breaks down videos, drafts briefs, drafts outreach, tracks delivery, and recommends follow-up actions.
3. **Feishu CRM control panel**: Feishu Base remains the familiar workspace for status, approvals, records, reminders, and human review.

Positioning:

> AI Influencer CRM that installs into your Feishu and runs marketing agents in the cloud.

## Product Tiers

| Tier | Purpose | Public Default |
|---|---|---|
| Feishu + Cloud Agent | Main product experience | Yes |
| Feishu-native template | Lightweight preview or fallback | No |
| Local runner | Developer/self-hosted mode | No |

The public product should avoid local runtime, launchd, ngrok, and hidden terminal logs.

## Second-Batch Validation Goal

The next validation should answer:

> Can a new user fill a few setup fields, get the CRM installed into their Feishu, capture one creator, and see one useful agent result written back?

First loop:

```text
Creator capture
-> screen_creator
-> write Fit Score, Risks, Strengths, Recommended Next Action
-> mark Needs Review
```

## Minimum Setup Fields

| Field | Why It Is Needed |
|---|---|
| Feishu authorization / tenant access | Create or copy the CRM and write records |
| Base name | Create the user's workspace |
| First campaign or product context | Make screening output relevant |
| LLM billing mode | User-provided API key or hosted trial quota |

## Creator Capture MVP

Recommended first capture paths:

1. Feishu form intake
2. Manual paste into Base
3. Later browser or share extension

Capture fields:

| Field | Required |
|---|---|
| Creator Name | Yes |
| Platform | Yes |
| Profile URL | Yes |
| Example Video URL | Optional |
| Niche / Category | Optional |
| Notes | Optional |
| Campaign Context | Optional if there is an active Campaign record |

## Cloud Agent Architecture

```text
Feishu Base / Form
  -> Feishu automation or webhook
  -> Cloud Agent API
  -> Agent worker
  -> LLM provider
  -> Feishu Base writeback
```

If Feishu Base automation supports outbound HTTP requests, Feishu can trigger the cloud agent directly. If not, cloud polling against the user's Agent Tasks table is acceptable because polling still runs in the cloud, not on the user's machine.

## GitHub Repo Role

The GitHub project should be positioned as:

> Open-source reference implementation and self-hosting kit for the AI Marketing Influencer CRM cloud agent.

It should not make local launchd the default path.

