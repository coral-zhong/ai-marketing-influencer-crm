export function prepareOutreachSendPackage(input) {
  if (input.approvalStatus !== "Approved") {
    return {
      status: "Blocked",
      permissionLevel: "manual",
      missingInputs: [],
      blockers: ["Human approval is required before outreach can be sent."],
      sendPackage: null,
      auditNote: "Outreach is blocked until a human approves the draft."
    };
  }

  const missingInputs = requiredMissing(input);
  if (missingInputs.length > 0) {
    return {
      status: "Needs Inputs",
      permissionLevel: "manual",
      missingInputs,
      blockers: [],
      sendPackage: null,
      auditNote: "Approved outreach is missing required send fields."
    };
  }

  return {
    status: "Ready To Send",
    permissionLevel: "manual",
    missingInputs: [],
    blockers: [],
    sendPackage: {
      channel: input.channel,
      recipient: input.recipient,
      subject: input.subject,
      message: input.message,
      creatorName: input.creator?.name || "",
      campaignBrand: input.campaign?.brand || "",
      productName: input.campaign?.productName || ""
    },
    auditNote: "Human approved this outreach package. Agent prepared send details but did not send externally."
  };
}

function requiredMissing(input) {
  return ["recipient", "subject", "message"].filter((field) => !text(input[field]));
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

