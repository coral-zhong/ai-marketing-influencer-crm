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

## Docs

- [Productization Plan](docs/productization-plan.md)
- [Cloud Agent MVP Spec](docs/cloud-agent-mvp-spec.md)
- [Build-in-Public Positioning Post](docs/positioning-post.md)

## Safety Principle

The agent may score, summarize, recommend, and draft. It must not automatically send outreach, promise payment, ship samples, approve content, or publish posts.

