# Agent Capability Map

Last updated: 2026-06-04

This map links the influencer marketing workflow to agent tasks, Feishu tables, and product maturity.

| Workflow Stage | Agent Capability | Input | Writes To | Human Approval Required | Status |
|---|---|---|---|---|---|
| Data Preparation | `import_creators` | CSV or pasted creator rows | parsed import preview | No, unless deleting/merging | Implemented MVP |
| Data Preparation | `normalize_creator_profile` | raw creator record | `Creators` | No | Planned |
| Data Preparation | `screen_creator` | creator + campaign context | `Creators`, `Agent Tasks` | Yes before outreach | Implemented MVP |
| Campaign Creation | `campaign_planner` | product/campaign notes | campaign task preview | Yes | Implemented MVP |
| Campaign Creation | `decompose_campaign_tasks` | campaign row | campaign task preview | Yes before activation | Implemented MVP |
| Creator Search | `creator_search_planner` | website/source snippets | creator candidate preview | Yes before broad search | Implemented MVP |
| Creator Search | `capture_creator` | profile URL / search result | `Creators` | No | Partially covered by MVP endpoint shape |
| Creator Search | `capture_video` | video URL / source result | `Videos` | No | Planned |
| Outreach | `draft_outreach` | creator + campaign | review-only outreach draft | Yes before send | Implemented MVP |
| Outreach | `prepare_outreach_send_package` | approved outreach draft | send-ready package | Yes before send | Implemented MVP |
| Outreach | `draft_follow_up` | outreach record | `Outreach` | Yes before send | Planned |
| Negotiation | `negotiation_assistant` | reply/context | review-only reply guidance | Yes | Implemented MVP |
| Fulfillment | `create_collaboration_from_approval` | approved outreach/campaign terms | collaboration draft | Yes | Implemented MVP |
| Fulfillment | `sample_tracking_agent` | collaboration + logistics | sample tracking summary | Yes before external message | Implemented MVP |
| Content Delivery | `content_delivery_agent` | collaboration/content status | content delivery summary | Yes for approval | Implemented MVP |
| Content Delivery | `content_monitoring_agent` | published URL + metrics | performance tracking summary | No for internal tracking | Implemented MVP |
| Review | `summarize_performance` | performance metrics | performance tier + next action | No | Implemented MVP |
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
second_collaboration_agent
```

Reason:

- It uses the performance output that now exists.
- It turns reporting into the next business action.
- It keeps external commitments behind human approval.
