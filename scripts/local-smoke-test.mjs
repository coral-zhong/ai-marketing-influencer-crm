#!/usr/bin/env node

import { createApp } from "../src/server.js";

const server = createApp({
  port: 0,
  agentApiSecret: "",
  demoMode: true,
  feishuAppId: "",
  feishuAppSecret: "",
  feishuBaseToken: "",
  feishuCreatorsTableId: ""
});

await new Promise((resolve) => server.listen(0, resolve));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  const health = await requestJson(`${baseUrl}/health`);
  assert(health.ok === true, "health check should return ok=true");

  const screening = await requestJson(`${baseUrl}/api/tasks/screen-creator`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      creatorRecordId: "local_smoke_creator",
      creator: {
        name: "Maya Tech Finds",
        platform: "TikTok",
        profileUrl: "https://example.com/maya",
        exampleVideoUrl: "https://example.com/video",
        category: "UGC tech review"
      },
      campaign: {
        campaignGoal: "Find creators for short tutorial demos",
        creatorCriteria: "TikTok UGC review creators"
      }
    })
  });

  assert(screening.ok === true, "screening request should return ok=true");
  assert(screening.result.fitScore === 100, "screening result should include expected fitScore");
  assert(screening.result.tier === "A", "screening result should include expected tier");
  assert(screening.writeback.mode === "demo", "local smoke test should use demo writeback");

  const importResult = await requestJson(`${baseUrl}/api/creators/import`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      csv: `Creator Name,Platform,Profile URL,Category
Maya Tech Finds,TikTok,https://example.com/maya,UGC tech review
Maya Duplicate,TikTok,https://example.com/maya,UGC tech review`
    })
  });

  assert(importResult.ok === true, "creator import should return ok=true");
  assert(importResult.summary.imported === 1, "creator import should import one unique creator");
  assert(importResult.summary.duplicates === 1, "creator import should report duplicate creators");

  const campaignPlan = await requestJson(`${baseUrl}/api/campaigns/plan`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      campaign: {
        campaignName: "Spring TikTok UGC Test",
        brand: "Demo Brand",
        productName: "Magnetic power bank",
        campaignGoal: "Find creators who can make short tutorial demos.",
        creatorCriteria: "TikTok UGC review creators with clear product demos."
      }
    })
  });

  assert(campaignPlan.ok === true, "campaign plan should return ok=true");
  assert(campaignPlan.plan.tasks.length === 3, "campaign plan should create three task previews");

  const outreachDraft = await requestJson(`${baseUrl}/api/outreach/draft`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      creator: {
        name: "Maya Tech Finds",
        platform: "TikTok",
        category: "UGC tech review"
      },
      campaign: {
        brand: "Demo Brand",
        productName: "Magnetic power bank",
        campaignGoal: "Find creators who can make short tutorial demos."
      }
    })
  });

  assert(outreachDraft.ok === true, "outreach draft should return ok=true");
  assert(outreachDraft.draft.status === "Needs Review", "outreach draft should require review");
  assert(outreachDraft.draft.permissionLevel === "review", "outreach draft should be review-only");

  const creatorSearch = await requestJson(`${baseUrl}/api/creators/search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      campaign: {
        creatorCriteria: "UGC tech review creators"
      },
      sources: [
        {
          url: "https://example.com/top-tech-creators",
          text: "Maya Tech Finds - TikTok product demos. Profile: https://www.tiktok.com/@mayatechfinds"
        }
      ]
    })
  });

  assert(creatorSearch.ok === true, "creator search should return ok=true");
  assert(creatorSearch.summary.candidates === 1, "creator search should find one candidate");

  const sendPackage = await requestJson(`${baseUrl}/api/outreach/send-package`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      approvalStatus: "Approved",
      channel: "email",
      recipient: "maya@example.com",
      subject: "Demo Brand x Maya Tech Finds",
      message: "Hi Maya,\nWould you be open to reviewing a brief?",
      creator: { name: "Maya Tech Finds" },
      campaign: { brand: "Demo Brand", productName: "Magnetic power bank" }
    })
  });

  assert(sendPackage.ok === true, "send package should return ok=true");
  assert(sendPackage.package.status === "Ready To Send", "send package should be ready after approval");

  const negotiation = await requestJson(`${baseUrl}/api/negotiation/assist`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      creator: { name: "Maya Tech Finds" },
      campaign: {
        brand: "Demo Brand",
        productName: "Magnetic power bank",
        offerRange: "$100-$200 plus sample"
      },
      inboundMessage: "Can you pay $500?"
    })
  });

  assert(negotiation.ok === true, "negotiation assist should return ok=true");
  assert(negotiation.guidance.status === "Needs Review", "negotiation guidance should require review");

  const collaboration = await requestJson(`${baseUrl}/api/collaborations/confirm`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      approvalStatus: "Approved",
      creator: { name: "Maya Tech Finds" },
      campaign: { campaignName: "Spring TikTok UGC Test", productName: "Magnetic power bank" },
      terms: {
        deliverables: "1 TikTok video",
        offer: "$150 plus sample",
        deadline: "2026-07-01"
      }
    })
  });

  assert(collaboration.ok === true, "collaboration confirmation should return ok=true");
  assert(collaboration.confirmation.status === "Ready For Fulfillment", "collaboration should be ready for fulfillment after approval");

  const sampleTracking = await requestJson(`${baseUrl}/api/samples/track`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      collaboration: {
        collaborationName: "Maya Tech Finds x Spring TikTok UGC Test",
        creatorName: "Maya Tech Finds"
      },
      sample: {
        trackingNumber: "1Z999",
        carrier: "UPS",
        deliveredAt: "2026-06-08",
        latestEvent: "Delivered"
      }
    })
  });

  assert(sampleTracking.ok === true, "sample tracking should return ok=true");
  assert(sampleTracking.tracking.sampleStatus === "Received", "sample tracking should detect delivered sample");

  const contentDelivery = await requestJson(`${baseUrl}/api/content/delivery-track`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      collaboration: {
        collaborationName: "Maya Tech Finds x Spring TikTok UGC Test",
        creatorName: "Maya Tech Finds"
      },
      content: {
        deliverableName: "TikTok demo video",
        dueDate: "2026-07-01",
        submittedAt: "2026-06-29",
        submittedUrl: "https://example.com/submitted-video"
      },
      today: "2026-06-30"
    })
  });

  assert(contentDelivery.ok === true, "content delivery tracking should return ok=true");
  assert(contentDelivery.delivery.deliveryStatus === "Awaiting Review", "submitted content should await review");

  console.log(JSON.stringify({
    ok: true,
    checks: ["health", "screen_creator", "import_creators", "campaign_plan", "draft_outreach", "creator_search", "outreach_send_package", "negotiation_assistant", "collaboration_confirmation", "sample_tracking", "content_delivery_tracking"],
    fitScore: screening.result.fitScore,
    tier: screening.result.tier,
    writebackMode: screening.writeback.mode,
    importedCreators: importResult.summary.imported,
    duplicateCreators: importResult.summary.duplicates,
    campaignTasks: campaignPlan.plan.tasks.map((task) => task.taskType),
    outreachStatus: outreachDraft.draft.status,
    creatorSearchCandidates: creatorSearch.summary.candidates,
    sendPackageStatus: sendPackage.package.status,
    negotiationStatus: negotiation.guidance.status,
    collaborationStatus: collaboration.confirmation.status,
    sampleStatus: sampleTracking.tracking.sampleStatus,
    contentDeliveryStatus: contentDelivery.delivery.deliveryStatus
  }, null, 2));
} finally {
  await new Promise((resolve) => server.close(resolve));
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json();
  assert(response.ok, `${url} returned HTTP ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
