export function confirmCollaboration(input) {
  if (input.approvalStatus !== "Approved") {
    return {
      status: "Blocked",
      permissionLevel: "manual",
      missingInputs: [],
      blockers: ["Human approval is required before creating a collaboration."],
      collaboration: null,
      reviewChecklist: []
    };
  }

  const missingInputs = requiredMissing(input);
  if (missingInputs.length > 0) {
    return {
      status: "Needs Inputs",
      permissionLevel: "manual",
      missingInputs,
      blockers: [],
      collaboration: null,
      reviewChecklist: []
    };
  }

  const creatorName = input.creator?.name || "Creator";
  const campaignName = input.campaign?.campaignName || "Campaign";
  const terms = input.terms || {};

  return {
    status: "Ready For Fulfillment",
    permissionLevel: "manual",
    missingInputs: [],
    blockers: [],
    collaboration: {
      collaborationName: `${creatorName} x ${campaignName}`,
      creatorName,
      campaignName,
      productName: input.campaign?.productName || "",
      deliverables: terms.deliverables,
      offer: terms.offer || "",
      usageRights: terms.usageRights || "Needs confirmation",
      deadline: terms.deadline,
      sampleStatus: "Not Sent",
      deliveryStatus: "Not Started"
    },
    reviewChecklist: [
      "Confirm shipping details before sample fulfillment.",
      "Confirm final offer and payment terms outside the agent.",
      "Confirm usage rights and content approval requirements.",
      "Do not treat this as a signed contract."
    ]
  };
}

function requiredMissing(input) {
  const terms = input.terms || {};
  const missing = [];
  if (!text(input.creator?.name)) missing.push("creator.name");
  if (!text(input.campaign?.campaignName)) missing.push("campaign.campaignName");
  if (!text(terms.deliverables)) missing.push("terms.deliverables");
  if (!text(terms.deadline)) missing.push("terms.deadline");
  return missing;
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

