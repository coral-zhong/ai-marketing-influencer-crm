export function breakDownViralContent(input) {
  const content = input.content || {};
  const campaign = input.campaign || {};

  if (!text(content.publishedUrl)) {
    return buildResult({
      content,
      campaign,
      breakdownStatus: "Needs Published URL",
      blockers: ["Add the live content URL before saving a viral breakdown."],
      nextAction: "Add the published URL, then run the breakdown again."
    });
  }

  const context = [content.transcript, content.caption, content.visualNotes].map(text).filter(Boolean).join(" ");
  if (!context) {
    return buildResult({
      content,
      campaign,
      breakdownStatus: "Needs Content Context",
      blockers: ["Add transcript, caption, or visual notes before breaking down the content."],
      nextAction: "Add transcript, caption, or visual notes."
    });
  }

  const hook = firstSentence(content.transcript || content.caption || context);
  const primaryAngle = inferPrimaryAngle(context);
  const scriptStructure = inferScriptStructure(context);
  const whyItWorked = inferWhyItWorked(content, context);
  const reusablePattern = buildReusablePattern(primaryAngle);
  const suggestedRepurpose = buildSuggestedRepurpose(content, campaign, hook, primaryAngle);

  return buildResult({
    content,
    campaign,
    breakdownStatus: "Ready For Review",
    hook,
    primaryAngle,
    scriptStructure,
    whyItWorked,
    reusablePattern,
    suggestedRepurpose,
    nextAction: "Review the reusable pattern and decide which hook or angle should be tested next."
  });
}

function buildResult({ content, campaign, breakdownStatus, hook = "", primaryAngle = "", scriptStructure = [], whyItWorked = [], reusablePattern = "", suggestedRepurpose = [], blockers = [], nextAction }) {
  return {
    breakdownStatus,
    contentTitle: text(content.title) || "Untitled content",
    publishedUrl: text(content.publishedUrl),
    platform: text(content.platform) || "Unknown",
    campaignGoal: text(campaign.campaignGoal),
    hook,
    primaryAngle,
    scriptStructure,
    whyItWorked,
    reusablePattern,
    suggestedRepurpose,
    blockers,
    nextAction,
    summary: `${text(content.title) || "Content"} breakdown for ${text(campaign.productName) || "the campaign"} is ${breakdownStatus}. ${nextAction}`
  };
}

function inferPrimaryAngle(context) {
  const lower = context.toLowerCase();
  if (lower.includes("stopped") || lower.includes("messy") || lower.includes("problem")) return "Simple problem-to-demo product proof";
  if (lower.includes("before") && lower.includes("after")) return "Before-and-after transformation";
  if (lower.includes("test") || lower.includes("demo")) return "Fast proof-led product demo";
  return "Clear hook with practical product proof";
}

function inferScriptStructure(context) {
  const lower = context.toLowerCase();
  const structure = ["Hook"];
  if (lower.includes("stopped") || lower.includes("messy") || lower.includes("problem")) structure.push("Problem");
  if (lower.includes("snap") || lower.includes("reveal") || lower.includes("product")) structure.push("Product reveal");
  if (lower.includes("demo") || lower.includes("test") || lower.includes("close-up")) structure.push("Proof demo");
  if (lower.includes("bag") || lower.includes("desk") || lower.includes("use")) structure.push("Use case");
  structure.push("CTA");
  return dedupe(structure.length >= 4 ? structure.filter((item) => item !== "Hook") : structure);
}

function inferWhyItWorked(content, context) {
  const reasons = [];
  const lower = context.toLowerCase();
  if (lower.includes("stopped") || lower.includes("messy") || lower.includes("three")) reasons.push("It starts with a concrete everyday friction point.");
  if (lower.includes("snap") || lower.includes("close-up")) reasons.push("It shows the product mechanism visually instead of only explaining it.");
  if (lower.includes("test") || lower.includes("demo")) reasons.push("It uses a quick proof moment that is easy to understand.");
  if ((content.metrics?.views || 0) > 10000) reasons.push("The content has enough reach to justify extracting reusable creative patterns.");
  if ((content.metrics?.shares || 0) > 0) reasons.push("Shares suggest the idea may be useful beyond the original post.");
  return reasons.length ? reasons : ["It has a clear hook, product proof, and reusable angle."];
}

function buildReusablePattern(primaryAngle) {
  if (primaryAngle === "Simple problem-to-demo product proof") {
    return "Start with a concrete friction point, reveal the product quickly, show one proof demo, then close with a practical use case.";
  }
  if (primaryAngle === "Before-and-after transformation") {
    return "Open with the before state, show the product intervention, then make the improvement visible in one shot.";
  }
  return "Start with a direct hook, show product proof quickly, and end with a repeatable use case.";
}

function buildSuggestedRepurpose(content, campaign, hook, primaryAngle) {
  return [
    {
      format: "Paid social hook",
      idea: `${hook || "Lead with the strongest friction point"}`
    },
    {
      format: "Creator brief angle",
      idea: `Ask future creators to test: ${primaryAngle}.`
    },
    {
      format: "Product page proof point",
      idea: `Use the clearest demo moment for ${text(campaign.productName) || text(content.title) || "the product"}.`
    }
  ];
}

function firstSentence(value) {
  const cleaned = text(value);
  if (!cleaned) return "";
  const match = cleaned.match(/^(.+?[.!?。！？])\s/);
  return (match ? match[1] : cleaned.split(/\s+/).slice(0, 12).join(" ")).trim();
}

function text(value) {
  return String(value || "").trim();
}

function dedupe(items) {
  return [...new Set(items)];
}
