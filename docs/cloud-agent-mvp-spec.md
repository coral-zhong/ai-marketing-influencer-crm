# Cloud Agent MVP Spec

Last updated: 2026-06-04

## Goal

Validate the core promise with the smallest useful cloud-agent loop:

```text
Capture one creator
-> run screen_creator in the cloud
-> write reviewable screening output back to Feishu
```

## Target User Experience

A non-technical operator should be able to:

1. Open the installed Feishu CRM.
2. Add a creator through a form or table row.
3. Trigger screening.
4. See AI-generated fit score, strengths, risks, and next action in Feishu.
5. Review the result before taking any external action.

The user should not run a local server, install Node.js, install `lark-cli`, configure launchd, expose ngrok, or read terminal logs.

## MVP Tables

### Campaigns

| Field | Type | Notes |
|---|---|---|
| Campaign Name | text | Primary field |
| Brand | text | Brand or store name |
| Product Name | text | Product being promoted |
| Campaign Goal | long text | What success means |
| Target Market | text | Region/language/audience |
| Creator Criteria | long text | Who the system should prefer |
| Claims Allowed | long text | Safe claims |
| Claims To Avoid | long text | Forbidden claims |
| Status | select | Draft, Active, Paused, Completed |

### Creators

| Field | Type | Notes |
|---|---|---|
| Creator Name | text | Primary field |
| Platform | select | TikTok, Instagram, YouTube, Xiaohongshu, Other |
| Profile URL | url/text | Creator profile |
| Example Video URL | url/text | Optional |
| Category | text/select | Optional |
| Notes | long text | Human notes |
| Creator Status | select | Captured, To Screen, Needs Review, To Outreach, Rejected |
| Fit Score | number | 0-100 |
| Tier | select | A, B, C, Reject |
| Score Confidence | select | High, Medium, Low |
| Strengths | long text | Agent-written |
| Risks | long text | Agent-written |
| Recommended Collaboration | select/text | Seed, Paid, Affiliate, Re-hire, Reject, Needs Review |
| Screening Summary | long text | Human-readable result |
| Last Agent Run At | date/time | Traceability |
| Agent Error | long text | User-visible error |

### Agent Tasks

| Field | Type | Notes |
|---|---|---|
| Task Name | text | Primary field |
| Task Type | select | screen_creator |
| Input Record Type | select | Creator |
| Input Record ID | text | Feishu record ID |
| Status | select | pending, processing, needs_review, done, failed |
| Permission Level | select | auto, review, manual |
| Output Summary | long text | Human-readable result |
| Output JSON | long text | Structured output |
| Error Message | long text | User-visible error |
| Started At | date/time | Optional |
| Finished At | date/time | Optional |

## Trigger Options

Preferred:

```http
POST /api/tasks/screen-creator
```

Fallback:

Cloud worker polls the user's `Agent Tasks` table for `pending` tasks.

Both paths are product-safe because neither requires local launchd.

## Human Control Rules

- Agent may score and recommend.
- Agent may write draft notes.
- Agent may set `Creator Status = Needs Review`.
- Agent must not send outreach.
- Agent must not promise payment, samples, discounts, or contract terms.
- Agent must not move a creator to external communication without human review.

## Success Criteria

The MVP test passes when a clean Feishu CRM can be installed or copied, a creator can be captured without technical setup, the cloud agent processes that creator, Feishu shows useful output, and Feishu shows visible errors if the agent fails.

