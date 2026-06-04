import test from "node:test";
import assert from "node:assert/strict";
import { confirmCollaboration } from "../src/collaborationConfirmation.js";

test("confirmCollaboration creates a collaboration draft when approved", () => {
  const result = confirmCollaboration({
    approvalStatus: "Approved",
    creator: { name: "Maya Tech Finds" },
    campaign: { campaignName: "Spring TikTok UGC Test", productName: "Magnetic power bank" },
    terms: {
      deliverables: "1 TikTok video",
      offer: "$150 plus sample",
      usageRights: "Organic repost only",
      deadline: "2026-07-01"
    }
  });

  assert.equal(result.status, "Ready For Fulfillment");
  assert.equal(result.permissionLevel, "manual");
  assert.equal(result.collaboration.collaborationName, "Maya Tech Finds x Spring TikTok UGC Test");
  assert.equal(result.collaboration.sampleStatus, "Not Sent");
  assert.match(result.reviewChecklist.join("\n"), /Confirm shipping details/);
});

test("confirmCollaboration blocks unapproved collaboration", () => {
  const result = confirmCollaboration({
    approvalStatus: "Needs Review",
    creator: { name: "Maya Tech Finds" },
    campaign: { campaignName: "Spring TikTok UGC Test" },
    terms: { offer: "$150 plus sample" }
  });

  assert.equal(result.status, "Blocked");
  assert.equal(result.collaboration, null);
  assert.deepEqual(result.blockers, ["Human approval is required before creating a collaboration."]);
});

test("confirmCollaboration reports missing collaboration terms", () => {
  const result = confirmCollaboration({
    approvalStatus: "Approved",
    creator: { name: "Maya Tech Finds" },
    campaign: { campaignName: "Spring TikTok UGC Test" },
    terms: { offer: "$150 plus sample" }
  });

  assert.equal(result.status, "Needs Inputs");
  assert.deepEqual(result.missingInputs, ["terms.deliverables", "terms.deadline"]);
});

