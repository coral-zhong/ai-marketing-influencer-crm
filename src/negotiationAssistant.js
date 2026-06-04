export function assistNegotiation(input) {
  const missingInputs = requiredMissing(input);
  if (missingInputs.length > 0) {
    return {
      status: "Needs Inputs",
      permissionLevel: "review",
      missingInputs,
      suggestedReply: "",
      risks: [],
      guardrails: baseGuardrails(input.campaign || {})
    };
  }

  const creatorName = input.creator?.name || "there";
  const firstName = creatorName.split(/\s+/)[0];
  const campaign = input.campaign || {};
  const inbound = input.inboundMessage || "";
  const risks = detectRisks(inbound, campaign);

  return {
    status: "Needs Review",
    permissionLevel: "review",
    missingInputs: [],
    suggestedReply: [
      `Hi ${firstName},`,
      "",
      "Thanks for sharing this. I can take it back to the team and confirm internally before we lock anything in.",
      "",
      `For context, we are discussing ${campaign.productName || "this campaign"} with ${campaign.brand || "our team"}. I want to make sure the scope, usage, timing, and compensation are all clear before either side commits.`,
      "",
      "Could you confirm your preferred deliverables, timeline, and any usage-rights expectations?",
      "",
      "Best,"
    ].join("\n"),
    risks,
    guardrails: baseGuardrails(campaign)
  };
}

function requiredMissing(input) {
  const missing = [];
  if (!text(input.inboundMessage)) missing.push("inboundMessage");
  return missing;
}

function detectRisks(inboundMessage, campaign) {
  const normalized = inboundMessage.toLowerCase();
  const risks = [];

  if (/\$[3-9]\d{2,}|\$[1-9]\d{3,}/.test(normalized) && text(campaign.offerRange)) {
    risks.push("Creator requested compensation outside the stated offer range.");
  }
  if (normalized.includes("full creative freedom")) {
    risks.push("Creator requested broad creative freedom; confirm brand and claims guardrails.");
  }
  if (normalized.includes("usage rights") || normalized.includes("whitelist") || normalized.includes("spark ads")) {
    risks.push("Usage rights or paid amplification terms need explicit human approval.");
  }

  return risks;
}

function baseGuardrails(campaign) {
  return [
    "Do not promise payment, samples, timelines, exclusivity, or usage rights without human approval.",
    "Do not approve claims that are outside the campaign guardrails.",
    `Claims to avoid: ${text(campaign.claimsToAvoid) || "not specified"}.`,
    `Offer range: ${text(campaign.offerRange) || "not specified"}.`
  ];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

