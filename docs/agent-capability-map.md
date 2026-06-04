# Agent Capability Map

Last updated: 2026-06-04

This map links the influencer marketing workflow to agent tasks, Feishu tables, and product maturity.

| Workflow Stage | Agent Capability | Input | Writes To | Human Approval Required | Status |
|---|---|---|---|---|---|
| Data Preparation | `import_creators` | CSV or pasted creator rows | parsed import preview | No, unless deleting/merging | Included |
| Data Preparation | `normalize_creator_profile` | raw creator record | `Creators` | No | Planned |
| Data Preparation | `screen_creator` | creator + campaign context | `Creators`, `Agent Tasks` | Yes before outreach | Included |
| Campaign Creation | `campaign_planner` | product/campaign notes | campaign task preview | Yes | Included |
| Campaign Creation | `decompose_campaign_tasks` | campaign row | campaign task preview | Yes before activation | Included |
| Creator Search | `creator_search_planner` | website/source snippets | creator candidate preview | Yes before broad search | Included |
| Creator Search | `capture_creator` | profile URL / search result | `Creators` | No | Partially covered by current endpoint shape |
| Creator Search | `capture_video` | video URL / source result | `Videos` | No | Planned |
| Outreach | `draft_outreach` | creator + campaign | review-only outreach draft | Yes before send | Included |
| Outreach | `prepare_outreach_send_package` | approved outreach draft | send-ready package | Yes before send | Included |
| Outreach | `draft_follow_up` | outreach record | `Outreach` | Yes before send | Planned |
| Negotiation | `negotiation_assistant` | reply/context | review-only reply guidance | Yes | Included |
| Fulfillment | `create_collaboration_from_approval` | approved outreach/campaign terms | collaboration draft | Yes | Included |
| Fulfillment | `sample_tracking_agent` | collaboration + logistics | sample tracking summary | Yes before external message | Included |
| Content Delivery | `content_delivery_agent` | collaboration/content status | content delivery summary | Yes for approval | Included |
| Content Delivery | `content_monitoring_agent` | published URL + metrics | performance tracking summary | No for internal tracking | Included |
| Review | `summarize_performance` | performance metrics | performance tier + next action | No | Included |
| Review | `viral_breakdown_agent` | published content + transcript/notes | hook, angle, script structure, reusable pattern | Yes before reuse | Included |
| Review | `recommend_next_actions` | performance + creator history | second collaboration recommendation | Yes before rehire | Included |
| Reuse | `second_collaboration_agent` | performance record | second collaboration draft recommendation | Yes | Included |
| Reuse | `content_repurpose_agent` | content asset + performance | content repurpose recommendations | Yes before reuse | Included |
| Install | `feishu_oauth_install` | hosted app config | OAuth install URL + callback validation | Yes by Feishu user/admin | Install boundary included |

## Status Definitions

- `Included`: runnable in the public repo.
- `Install boundary included`: install entry point is runnable; production credentials and token storage stay in the hosted app.
- `Partially covered`: data model or endpoint shape exists, but production behavior is incomplete.
- `Planned`: not implemented in this repo yet.

## Next Candidate For Implementation

Recommended next build:

```text
hosted_token_exchange_and_base_template_copy
```

Reason:

- It completes the OAuth entry point as a managed hosted install flow.
- It should exchange Feishu's one-time code for tokens server-side.
- It should copy or create the Feishu Base template after authorization.
