# Influencer Marketing Workflow Roadmap

Last updated: 2026-06-04

This roadmap expands the product beyond the completed Creator capture and Feishu writeback loop.

The product goal is not only to store creator data. The goal is to help an operator run an influencer marketing campaign from creator database preparation through campaign planning, outreach, negotiation, fulfillment, tracking, and reuse.

## Current Completed Slice

The current public repo supports this local/installable slice:

```text
Creator captured
-> screen_creator endpoint
-> deterministic screening output
-> optional Feishu Creator row writeback
```

This proves the core system shape:

- Feishu Base is the control panel.
- Agent service performs work.
- Human review remains required before external commitments.

## End-to-End Workflow

```text
1. Data Preparation
2. Campaign Creation And Decomposition
3. Creator Search And Ingestion
4. Outreach And Negotiation
5. Fulfillment And Tracking
6. Review, Reuse, And Second Collaboration
```

## Now / Next / Later Roadmap

### Now: Make The First Agent Loop Useful

Goal: make creator capture + screening usable enough for a real operator test.

| Initiative | User Value | Output | Status |
|---|---|---|---|
| Minimal Feishu schema | User has the required Base fields | `schema/minimal-crm.schema.json` | Done |
| Local install verification | Another AI agent can clone and verify the repo | `npm run verify:local` | Done |
| Feishu Creator writeback | Agent can update a real Creator row | `src/feishuClient.js` | Done |
| Feishu credential setup guide | User can configure real writeback manually | `docs/feishu-api-credentials-setup.md` | Done |
| Campaign context in screening | Screening uses campaign criteria, claims, and target market | enriched `screen_creator` input | Next |
| Creator import | User can upload existing creator data | CSV import script + mapping guide | Next |

### Next: Campaign-To-Creator Pipeline

Goal: support the first campaign planning workflow.

| Initiative | User Value | Agent Capability | Dependencies |
|---|---|---|---|
| Campaign creation | User creates a structured campaign brief | `campaign_planner` | Campaigns table |
| Campaign decomposition | Campaign turns into creator tasks | `decompose_campaign_tasks` | Agent Tasks table |
| Creator search task | Agent knows what creator profiles to search for | `creator_search_planner` | Campaign task spec |
| Creator ingestion | Found creators are recorded into Feishu | `capture_creator` / `import_creators` | Creators table |
| Screening queue | New creators move to reviewable screening | `screen_creator` | Creator Status workflow |

### Later: Outreach, Fulfillment, Performance, Reuse

Goal: support the full influencer operating loop.

| Initiative | User Value | Agent Capability |
|---|---|---|
| Outreach drafts | User gets personalized outreach copy | `draft_outreach` |
| Negotiation assistant | User gets safe response suggestions | `negotiation_assistant` |
| Collaboration confirmation | Approved deal becomes a collaboration record | `create_collaboration_from_approval` |
| Sample tracking | User can monitor shipping/sample state | `sample_tracking_agent` |
| Content delivery tracking | User sees what content is due/reviewed/published | `content_delivery_agent` |
| Content performance tracking | User can record and summarize results | `summarize_performance` |
| Second collaboration | Agent recommends rehire/new angle/reject | `second_collaboration_agent` |
| Content reuse | Agent identifies reusable hooks and content | `content_repurpose_agent` |

## Workflow Detail

### 1. Data Preparation

User workflow:

1. Upload existing creator data.
2. Normalize creator fields.
3. Run screening.
4. Build the creator database.

Required tables:

- `Creators`
- `Agent Tasks`

Agent capabilities:

- `import_creators`
- `normalize_creator_profile`
- `screen_creator`

Acceptance criteria:

- CSV import creates Creator records.
- Duplicate creators are detected by profile URL or handle.
- Imported creators can enter `To Screen`.
- Screening output writes back to Feishu.

### 2. Campaign Creation And Decomposition

User workflow:

1. Create a Campaign.
2. Add product, market, goals, offer, claims, and creator criteria.
3. Agent decomposes the Campaign into creator tasks.

Required tables:

- `Campaigns`
- `Agent Tasks`

Agent capabilities:

- `campaign_planner`
- `decompose_campaign_tasks`

Acceptance criteria:

- Campaign row stores product and marketing constraints.
- Agent produces target creator segments.
- Agent creates or proposes tasks such as creator search, screening, outreach, and brief generation.
- Human approves before downstream tasks are activated.

### 3. Creator Search And Ingestion

User workflow:

1. Agent searches websites or platforms for creators based on tasks.
2. Agent records candidates into the system.
3. User reviews new candidates.

Required tables:

- `Campaigns`
- `Creators`
- `Videos`
- `Agent Tasks`

Agent capabilities:

- `creator_search_planner`
- `capture_creator`
- `capture_video`
- `screen_creator`

Acceptance criteria:

- Agent records source URL and reason for adding each creator.
- New creators are tagged to campaign/task context.
- Creator records include enough information for screening.
- Search sources and confidence are visible.

### 4. Outreach And Negotiation

User workflow:

1. Filter screened creators.
2. Draft outreach.
3. Send outreach after human approval.
4. Track replies and negotiation.
5. Confirm collaboration terms.

Required tables:

- `Creators`
- `Outreach`
- `Collaborations`
- `Agent Tasks`

Agent capabilities:

- `draft_outreach`
- `draft_follow_up`
- `negotiation_assistant`
- `create_collaboration_from_approval`

Acceptance criteria:

- Outreach drafts are written to Feishu, not sent automatically.
- Human approval is required before external sending.
- Negotiation suggestions include risks and guardrails.
- Confirmed collaboration creates a Collaboration record.

### 5. Fulfillment And Tracking

User workflow:

1. Send product samples.
2. Track sample logistics and status.
3. Track content delivery.
4. Track published content performance.

Required tables:

- `Collaborations`
- `Content Assets`
- `Performance`
- `Agent Tasks`

Agent capabilities:

- `sample_tracking_agent`
- `content_delivery_agent`
- `content_monitoring_agent`
- `summarize_performance`

Acceptance criteria:

- Sample status is visible.
- Content due dates and blockers are visible.
- Submitted content can be reviewed.
- Published content can be tied to performance records.

### 6. Review, Reuse, And Second Collaboration

User workflow:

1. Review performance.
2. Decide whether to rehire, test a new angle, reject, or reuse content.
3. Save reusable hooks and assets.

Required tables:

- `Performance`
- `Content Assets`
- `Creators`
- `Collaborations`

Agent capabilities:

- `recommend_next_actions`
- `second_collaboration_agent`
- `content_repurpose_agent`

Acceptance criteria:

- Agent recommends next action with reasoning.
- Rehire recommendations remain review-only.
- Reusable content is tagged with rights and risk.
- Winning hooks and angles are written back to Feishu.

## Suggested Build Order

1. `import_creators`
2. `campaign_planner`
3. `decompose_campaign_tasks`
4. `creator_search_planner`
5. `draft_outreach`
6. `negotiation_assistant`
7. `sample_tracking_agent`
8. `content_delivery_agent`
9. `summarize_performance`
10. `second_collaboration_agent`
11. `content_repurpose_agent`

## Product Principle

Agents can prepare, score, draft, summarize, and recommend.

Humans approve external communication, payment, shipment, content approval, and publishing.

