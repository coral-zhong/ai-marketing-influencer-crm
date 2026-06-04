import test from "node:test";
import assert from "node:assert/strict";
import { trackContentDelivery } from "../src/contentDeliveryTracking.js";

test("trackContentDelivery marks submitted content as awaiting review", () => {
  const result = trackContentDelivery({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test",
      creatorName: "Maya Tech Finds"
    },
    content: {
      deliverableName: "TikTok demo video",
      dueDate: "2026-07-01",
      submittedAt: "2026-06-29",
      submittedUrl: "https://example.com/submitted-video"
    },
    today: "2026-06-30"
  });

  assert.equal(result.deliveryStatus, "Awaiting Review");
  assert.equal(result.nextAction, "Review submitted content against the brief and claims guardrails.");
  assert.equal(result.blockers.length, 0);
});

test("trackContentDelivery marks overdue content", () => {
  const result = trackContentDelivery({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test"
    },
    content: {
      deliverableName: "TikTok demo video",
      dueDate: "2026-07-01"
    },
    today: "2026-07-03"
  });

  assert.equal(result.deliveryStatus, "Overdue");
  assert.deepEqual(result.blockers, ["Content is past due and has not been submitted."]);
});

test("trackContentDelivery marks revision requested content", () => {
  const result = trackContentDelivery({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test"
    },
    content: {
      deliverableName: "TikTok demo video",
      dueDate: "2026-07-01",
      submittedUrl: "https://example.com/submitted-video",
      reviewStatus: "Revision Requested",
      revisionNotes: "Remove unsupported battery-life claim."
    },
    today: "2026-07-01"
  });

  assert.equal(result.deliveryStatus, "Revision Needed");
  assert.match(result.nextAction, /Share revision notes/);
});

