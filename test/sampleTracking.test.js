import test from "node:test";
import assert from "node:assert/strict";
import { trackSample } from "../src/sampleTracking.js";

test("trackSample marks shipped sample as in transit", () => {
  const result = trackSample({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test",
      creatorName: "Maya Tech Finds"
    },
    sample: {
      trackingNumber: "1Z999",
      carrier: "UPS",
      shippedAt: "2026-06-04",
      latestEvent: "Departed facility"
    }
  });

  assert.equal(result.sampleStatus, "In Transit");
  assert.equal(result.nextAction, "Monitor delivery and prepare content kickoff reminder.");
  assert.equal(result.blockers.length, 0);
  assert.match(result.summary, /UPS/);
});

test("trackSample marks delivered sample as received and suggests content kickoff", () => {
  const result = trackSample({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test",
      creatorName: "Maya Tech Finds"
    },
    sample: {
      trackingNumber: "1Z999",
      carrier: "UPS",
      deliveredAt: "2026-06-08",
      latestEvent: "Delivered"
    }
  });

  assert.equal(result.sampleStatus, "Received");
  assert.equal(result.nextAction, "Create content kickoff reminder for the creator.");
  assert.match(result.reminderDraft, /Maya/);
});

test("trackSample reports missing tracking information", () => {
  const result = trackSample({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test"
    },
    sample: {}
  });

  assert.equal(result.sampleStatus, "Needs Tracking Info");
  assert.deepEqual(result.blockers, ["Tracking number or carrier is missing."]);
});

