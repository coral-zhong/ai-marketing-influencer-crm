export function recommendContentRepurpose(input) {
  const content = input.content || {};
  const performance = input.performance || {};

  if (performance.performanceStatus !== "Ready For Review") {
    return buildResult({
      content,
      performance,
      repurposeStatus: "Wait For Performance Review",
      repurposeIdeas: [],
      nextAction: "Finish performance review before deciding how to reuse the content.",
      blockers: ["Performance record is not ready for review."]
    });
  }

  if (content.rightsStatus !== "Usage Rights Approved") {
    return buildResult({
      content,
      performance,
      repurposeStatus: "Needs Rights Approval",
      repurposeIdeas: [],
      nextAction: "Confirm usage rights with the creator before repurposing this content.",
      blockers: ["Usage rights are not approved."]
    });
  }

  if (performance.performanceTier !== "Strong" && performance.performanceTier !== "Promising") {
    return buildResult({
      content,
      performance,
      repurposeStatus: "Do Not Repurpose Yet",
      repurposeIdeas: [],
      nextAction: "Archive learnings and wait for stronger content before reuse.",
      blockers: []
    });
  }

  return buildResult({
    content,
    performance,
    repurposeStatus: "Recommended",
    repurposeIdeas: [
      {
        channel: "Paid Social Ad",
        angle: "Use the creator's clearest product demo moment as the opening hook.",
        approvalRequired: true
      },
      {
        channel: "Email Proof Point",
        angle: "Quote the creator result as social proof in a campaign email.",
        approvalRequired: true
      },
      {
        channel: "Product Page Social Proof",
        angle: "Embed or summarize the post near product benefits after rights review.",
        approvalRequired: true
      }
    ],
    nextAction: "Review usage rights, brand claims, and channel fit before reusing the content.",
    blockers: []
  });
}

function buildResult({ content, performance, repurposeStatus, repurposeIdeas, nextAction, blockers }) {
  return {
    repurposeStatus,
    approvalRequired: true,
    permissionLevel: "review",
    publishedUrl: text(content.publishedUrl),
    sourcePerformanceTier: performance.performanceTier || "Unknown",
    repurposeIdeas,
    nextAction,
    blockers,
    summary: `${content.title || "Content"} reuse status: ${repurposeStatus}. ${nextAction}`
  };
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
