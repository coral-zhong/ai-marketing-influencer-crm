export function screenCreator(input) {
  const creator = input.creator;
  const campaign = input.campaign || {};
  const notes = [creator.category, creator.notes, campaign.creatorCriteria, campaign.campaignGoal]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const hasVideo = Boolean(creator.exampleVideoUrl);
  const hasCampaignFit = keywordScore(notes, ["ugc", "review", "tutorial", "demo", "tiktok", "short", "affiliate"]);
  const hasRisk = keywordScore(notes, ["fake", "low quality", "controversial", "unverified", "spam"]);

  const fitScore = clamp(55 + (hasVideo ? 12 : 0) + hasCampaignFit * 6 - hasRisk * 10, 0, 100);
  const tier = fitScore >= 85 ? "A" : fitScore >= 70 ? "B" : fitScore >= 50 ? "C" : "Reject";
  const scoreConfidence = hasVideo && campaign.campaignGoal ? "High" : hasVideo || campaign.campaignGoal ? "Medium" : "Low";
  const recommendedCollaboration = tier === "A" ? "Paid" : tier === "B" ? "Seed" : tier === "C" ? "Needs Review" : "Reject";

  const strengths = [
    hasVideo ? "Includes an example video for content fit review." : "Has enough profile context for an initial screen.",
    campaign.campaignGoal ? "Can be evaluated against the campaign goal." : "Campaign context is limited, so the first pass is conservative."
  ];

  const risks = [
    !hasVideo ? "No example video URL was provided." : "",
    !campaign.campaignGoal ? "Campaign goal is missing or incomplete." : "",
    hasRisk > 0 ? "Input notes include terms that may indicate quality or brand-safety risk." : ""
  ].filter(Boolean);

  return {
    fitScore,
    tier,
    scoreConfidence,
    strengths,
    risks,
    recommendedCollaboration,
    screeningSummary: `${creator.name} is a ${tier} tier creator for this campaign with a ${fitScore}/100 fit score. Recommended next action: ${recommendedCollaboration}.`
  };
}

function keywordScore(text, keywords) {
  return keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

