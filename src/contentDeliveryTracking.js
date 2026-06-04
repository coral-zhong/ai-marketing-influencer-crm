export function trackContentDelivery(input) {
  const collaboration = input.collaboration || {};
  const content = input.content || {};
  const today = parseDate(input.today || new Date().toISOString().slice(0, 10));

  if (content.reviewStatus === "Revision Requested") {
    return buildResult({
      collaboration,
      content,
      deliveryStatus: "Revision Needed",
      nextAction: `Share revision notes with the creator: ${content.revisionNotes || "Revision details needed."}`,
      blockers: content.revisionNotes ? [] : ["Revision notes are missing."]
    });
  }

  if (text(content.submittedUrl) || text(content.submittedAt)) {
    return buildResult({
      collaboration,
      content,
      deliveryStatus: "Awaiting Review",
      nextAction: "Review submitted content against the brief and claims guardrails.",
      blockers: []
    });
  }

  const dueDate = parseDate(content.dueDate);
  if (dueDate && today > dueDate) {
    return buildResult({
      collaboration,
      content,
      deliveryStatus: "Overdue",
      nextAction: "Ask the creator for an updated delivery timeline.",
      blockers: ["Content is past due and has not been submitted."]
    });
  }

  return buildResult({
    collaboration,
    content,
    deliveryStatus: "Pending Delivery",
    nextAction: "Monitor due date and prepare review checklist.",
    blockers: []
  });
}

function buildResult({ collaboration, content, deliveryStatus, nextAction, blockers }) {
  return {
    deliveryStatus,
    nextAction,
    blockers,
    summary: `${content.deliverableName || "Content"} for ${collaboration.collaborationName || "collaboration"} is ${deliveryStatus}. ${nextAction}`
  };
}

function parseDate(value) {
  if (!text(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

