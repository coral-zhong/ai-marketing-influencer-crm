# Product Build Checklist

Last updated: 2026-06-04

Working rule:

> Finish one product task, test it, update this checklist, then move to the next task.

## Checklist

- [x] Creator search from websites
- [x] Outreach send workflow
- [x] Negotiation assistant
- [x] Collaboration confirmation
- [x] Sample tracking
- [x] Content delivery tracking
- [x] Published content / performance tracking
- [x] Second collaboration recommendation
- [ ] Content repurpose recommendation
- [ ] One-click Feishu install / OAuth hosted app

## Done Before This Checklist

- [x] Creator CSV import
- [x] Creator screening
- [x] Feishu Creator writeback boundary
- [x] Campaign planning and task decomposition
- [x] Review-only outreach draft
- [x] Local AI-agent install verification

## Completion Log

- 2026-06-04: Completed `Creator search from websites` with `POST /api/creators/search`, local tests, smoke coverage, and website-source candidate extraction.
- 2026-06-04: Completed `Outreach send workflow` with `POST /api/outreach/send-package`, approval gate, send-ready package output, local tests, and smoke coverage.
- 2026-06-04: Completed `Negotiation assistant` with `POST /api/negotiation/assist`, review-only reply suggestions, risk detection, guardrails, local tests, and smoke coverage.
- 2026-06-04: Completed `Collaboration confirmation` with `POST /api/collaborations/confirm`, approval gate, collaboration draft output, fulfillment-start defaults, local tests, and smoke coverage.
- 2026-06-04: Completed `Sample tracking` with `POST /api/samples/track`, tracking status classification, missing-info blockers, content kickoff reminder draft, local tests, and smoke coverage.
- 2026-06-04: Completed `Content delivery tracking` with `POST /api/content/delivery-track`, submitted/overdue/revision-needed status classification, blockers, local tests, and smoke coverage.
- 2026-06-04: Completed `Published content / performance tracking` with `POST /api/performance/track`, published URL and metric readiness checks, engagement-rate calculation, performance tiering, local tests, and smoke coverage.
- 2026-06-04: Completed `Second collaboration recommendation` with `POST /api/recommendations/second-collaboration`, approval-gated re-engagement recommendations, wait-state blockers, local tests, and smoke coverage.
