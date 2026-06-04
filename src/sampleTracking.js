export function trackSample(input) {
  const collaboration = input.collaboration || {};
  const sample = input.sample || {};
  const blockers = [];

  if (!text(sample.trackingNumber) || !text(sample.carrier)) {
    blockers.push("Tracking number or carrier is missing.");
    return response({
      collaboration,
      sample,
      sampleStatus: "Needs Tracking Info",
      nextAction: "Add carrier and tracking number before monitoring sample delivery.",
      blockers
    });
  }

  if (text(sample.deliveredAt) || text(sample.latestEvent).toLowerCase().includes("delivered")) {
    return response({
      collaboration,
      sample,
      sampleStatus: "Received",
      nextAction: "Create content kickoff reminder for the creator.",
      blockers: []
    });
  }

  if (text(sample.shippedAt) || text(sample.latestEvent)) {
    return response({
      collaboration,
      sample,
      sampleStatus: "In Transit",
      nextAction: "Monitor delivery and prepare content kickoff reminder.",
      blockers: []
    });
  }

  return response({
    collaboration,
    sample,
    sampleStatus: "Ready To Ship",
    nextAction: "Ship sample and add tracking details.",
    blockers: []
  });
}

function response({ collaboration, sample, sampleStatus, nextAction, blockers }) {
  const creatorName = collaboration.creatorName || "creator";
  return {
    sampleStatus,
    nextAction,
    blockers,
    reminderDraft: sampleStatus === "Received"
      ? `Hi ${firstToken(creatorName)}, glad the sample arrived. When you are ready, please confirm your content timeline and any questions before filming.`
      : "",
    summary: `${collaboration.collaborationName || "Collaboration"} sample status: ${sampleStatus}${sample.carrier ? ` via ${sample.carrier}` : ""}. ${nextAction}`
  };
}

function firstToken(value) {
  return text(value).split(/\s+/)[0];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

