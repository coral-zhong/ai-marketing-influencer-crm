export function draftOutreach(input) {
  const creator = input.creator || {};
  const campaign = input.campaign || {};
  const missingInputs = requiredMissing(creator, campaign);

  if (missingInputs.length > 0) {
    return {
      status: "Needs Inputs",
      permissionLevel: "review",
      missingInputs,
      subject: "",
      message: "",
      reviewChecklist: [],
      guardrails: buildGuardrails(campaign)
    };
  }

  const firstName = firstToken(creator.name);
  const categoryLine = creator.category ? `I liked your work around ${creator.category}` : `I liked your ${creator.platform} content`;
  const productName = campaign.productName;
  const brand = campaign.brand || "our team";

  return {
    status: "Needs Review",
    permissionLevel: "review",
    subject: `${brand} x ${creator.name} - ${productName} collaboration idea`,
    message: [
      `Hi ${firstName},`,
      "",
      `${categoryLine}, and I thought your style could be a strong fit for ${productName}.`,
      "",
      `We are exploring creator partners for ${brand}. The campaign goal is: ${campaign.campaignGoal || "clear, useful product content that helps people understand the product."}`,
      "",
      "Would you be open to reviewing a potential collaboration brief?",
      "",
      "Best,",
      `${brand}`
    ].join("\n"),
    reviewChecklist: [
      "Human must review tone and personalization before sending.",
      "No payment or shipping promise has been made.",
      "Claims must stay within the approved campaign guardrails.",
      "Do not send until creator fit and campaign terms are approved."
    ],
    guardrails: buildGuardrails(campaign)
  };
}

function requiredMissing(creator, campaign) {
  const missing = [];
  if (!text(creator.name)) missing.push("creator.name");
  if (!text(creator.platform)) missing.push("creator.platform");
  if (!text(campaign.productName)) missing.push("campaign.productName");
  return missing;
}

function buildGuardrails(campaign) {
  return {
    claimsAllowed: splitList(campaign.claimsAllowed),
    claimsToAvoid: splitList(campaign.claimsToAvoid),
    externalAction: "review_only"
  };
}

function splitList(value) {
  if (!text(value)) return [];
  return text(value)
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstToken(value) {
  return text(value).split(/\s+/)[0];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

