# Agent Capability Map

Last updated: 2026-06-04

This map links the influencer marketing workflow to agent tasks, Feishu tables, and product maturity.

| Workflow Stage | Agent Capability | Input | Writes To | Human Approval Required | Status |
|---|---|---|---|---|---|
| Data Preparation | `import_creators` | CSV or pasted creator rows | `Creators` | No, unless deleting/merging | Planned |
| Data Preparation | `normalize_creator_profile` | raw creator record | `Creators` | No | Planned |
| Data Preparation | `screen_creator` | creator + campaign context | `Creators`, `Agent Tasks` | Yes before outreach | Implemented MVP |
| Campaign Creation | `campaign_planner` | product/campaign notes | `Campaigns`, `Agent Tasks` | Yes | Planned |
| Campaign Creation | `decompose_campaign_tasks` | campaign row | `Agent Tasks` | Yes before activation | Planned |
| Creator Search | `creator_search_planner` | campaign task | `Agent Tasks` | Yes before broad search | Planned |
| Creator Search | `capture_creator` | profile URL / search result | `Creators` | No | Partially covered by MVP endpoint shape |
| Creator Search | `capture_video` | video URL / source result | `Videos` | No | Planned |
| Outreach | `draft_outreach` | creator + campaign | `Outreach` | Yes before send | Planned |
| Outreach | `draft_follow_up` | outreach record | `Outreach` | Yes before send | Planned |
| Negotiation | `negotiation_assistant` | reply/context | `Outreach`, `Collaborations` | Yes | Planned |
| Fulfillment | `create_collaboration_from_approval` | approved outreach | `Collaborations` | Yes | Planned |
| Fulfillment | `sample_tracking_agent` | collaboration + logistics | `Collaborations`, `Agent Tasks` | Yes before external message | Planned |
| Content Delivery | `content_delivery_agent` | collaboration/content status | `Content Assets` | Yes for approval | Planned |
| Content Delivery | `content_monitoring_agent` | published URL | `Content Assets`, `Performance` | No for internal tracking | Planned |
| Review | `summarize_performance` | performance metrics | `Performance` | No | Planned |
| Review | `recommend_next_actions` | performance + creator history | `Performance`, `Creators` | Yes before rehire | Planned |
| Reuse | `second_collaboration_agent` | performance record | `Collaborations`, `Agent Tasks` | Yes | Planned |
| Reuse | `content_repurpose_agent` | content asset + performance | `Content Assets` | Yes before reuse | Planned |

## Status Definitions

- `Implemented MVP`: runnable in the public repo.
- `Partially covered`: data model or endpoint shape exists, but production behavior is incomplete.
- `Planned`: not implemented in this repo yet.

## Next Candidate For Implementation

Recommended next build:

```text
import_creators
```

Reason:

- It supports the user's existing data preparation workflow.
- It does not require external web search.
- It makes `screen_creator` useful on batches of real creator data.
- It is easier to verify than outreach, negotiation, or logistics.

