export function recommendSecondCollaboration(input) {
  const creator = input.creator || {};
  const campaign = input.campaign || {};
  const performance = input.performance || {};

  if (performance.performanceStatus !== "Ready For Review") {
    return buildResult({
      creator,
      campaign,
      performance,
      recommendationStatus: "Wait For Data",
      recommendedNextCollaboration: null,
      nextAction: "Finish performance tracking before deciding on a second collaboration.",
      blockers: ["Performance record is not ready for review."],
      rationale: ["Performance data is not ready yet."]
    });
  }

  if (performance.performanceTier !== "Strong" && performance.performanceTier !== "Promising") {
    return buildResult({
      creator,
      campaign,
      performance,
      recommendationStatus: "Do Not Re-engage Yet",
      recommendedNextCollaboration: null,
      nextAction: "Document learnings and keep the creator in the database without starting a new offer.",
      blockers: [],
      rationale: [`Performance tier is ${performance.performanceTier || "Unknown"}.`]
    });
  }

  return buildResult({
    creator,
    campaign,
    performance,
    recommendationStatus: "Recommended",
    recommendedNextCollaboration: {
      type: performance.performanceTier === "Strong" ? "Second Paid Collaboration" : "Lightweight Retest",
      creatorName: text(creator.name) || "Creator",
      productName: text(campaign.productName) || "Product",
      brief: `Invite ${text(creator.name) || "the creator"} to a follow-up campaign with a clearer CTA and reuse rights discussion.`
    },
    nextAction: "Review budget, usage rights, and campaign fit before sending a new collaboration offer.",
    blockers: [],
    rationale: [
      `${performance.performanceTier} performance tier.`,
      `Engagement rate: ${formatRate(performance.metrics?.engagementRate)}.`
    ]
  });
}

function buildResult({ creator, campaign, performance, recommendationStatus, recommendedNextCollaboration, nextAction, blockers, rationale }) {
  return {
    recommendationStatus,
    approvalRequired: true,
    permissionLevel: "review",
    recommendedNextCollaboration,
    nextAction,
    blockers,
    rationale,
    summary: `${creator.name || "Creator"} after ${campaign.campaignName || "campaign"}: ${recommendationStatus}. ${nextAction}`,
    sourcePerformanceTier: performance.performanceTier || "Unknown"
  };
}

function formatRate(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? `${Math.round(parsed * 10000) / 100}%` : "unknown";
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
