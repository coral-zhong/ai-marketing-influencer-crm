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

The product should not be explained as "adding an AI agent to Feishu Base." That is a developer framing.

The user-facing promise is:

> Create a campaign in Feishu. Let AI turn it into creator tasks, drafts, review notes, and follow-up recommendations.

## Product Tiers

| Tier | Purpose | Public Default |
|---|---|---|
| Hosted Feishu CRM + Cloud Agent | Main product experience | Yes |
| Feishu template only | Preview the workflow | No |
| GitHub self-hosting kit | Developer/self-hosted mode | No |

The public product should avoid local runtime, launchd, ngrok, and hidden terminal logs.

It should also avoid asking users for Feishu App ID, App Secret, Base tokens, or table IDs.

## Current Validation Status

The cloud writeback loop has been validated:

```text
Railway hosted agent
-> /api/agent-tasks/run
-> campaign_plan workflow
-> Feishu OpenAPI
-> write back to Agent Tasks
```

Verified result:

```json
{
  "endpointStatus": 200,
  "taskStatus": "needs_review",
  "writebackMode": "feishu_openapi",
  "written": true
}
```

The reliable internal-test path is app-created Base:

```text
Feishu app creates the Base
-> same app writes back to that Base
```

The copied-template path is useful for previewing the CRM, but it should not be the main writeback path until hosted OAuth is complete.

## Second-Batch Validation Goal

The next validation should answer:

> Can a new user open an installed Feishu CRM, create one Campaign, trigger one Agent Task, and see one useful agent result written back?

First loop:

```text
Campaign row
-> campaign_plan
-> write recommended creator tasks and outreach direction
-> mark Needs Review
```

## Minimum Setup Fields

For the user-facing product:

| Field | Why It Is Needed |
|---|---|
| Feishu authorization | Install/connect the CRM and write records |
| First campaign or product context | Make AI output relevant |

For builders and internal tests only:

| Field | Why It Is Needed |
|---|---|
| Feishu App ID / App Secret | Create a test Base and write through OpenAPI |
| Railway variables | Host the agent |
| Base token / table map | Point one deployment at one test Base |

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

It should not make GitHub cloning the first step for a non-technical marketer.

## Next Product Step

Build this lower-friction path:

```text
Hosted install page
-> Feishu OAuth
-> create CRM Base or connect selected Base
-> save per-install config
-> show success page with Feishu CRM link
-> Feishu automation triggers cloud agent
```

This turns the current internal test into a product install.
