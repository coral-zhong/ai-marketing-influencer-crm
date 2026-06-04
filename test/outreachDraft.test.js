import test from "node:test";
import assert from "node:assert/strict";
import { draftOutreach } from "../src/outreachDraft.js";

test("draftOutreach creates a review-only creator outreach draft", () => {
  const result = draftOutreach({
    creator: {
      name: "Maya Tech Finds",
      platform: "TikTok",
      category: "UGC tech review",
      strengths: ["Includes an example video for content fit review.", "Can be evaluated against the campaign goal."]
    },
    campaign: {
      brand: "Demo Brand",
      productName: "Magnetic power bank",
      campaignGoal: "Find creators who can make short tutorial demos.",
      claimsAllowed: "Portable charger, magnetic attachment.",
      claimsToAvoid: "Guaranteed battery life."
    }
  });

  assert.equal(result.status, "Needs Review");
  assert.equal(result.permissionLevel, "review");
  assert.match(result.subject, /Demo Brand/);
  assert.match(result.message, /Maya/);
  assert.match(result.message, /Magnetic power bank/);
  assert.match(result.reviewChecklist.join("\n"), /No payment or shipping promise/);
  assert.deepEqual(result.guardrails.claimsToAvoid, ["Guaranteed battery life."]);
});

test("draftOutreach reports missing required inputs", () => {
  const result = draftOutreach({
    creator: { name: "Maya Tech Finds" },
    campaign: { brand: "Demo Brand" }
  });

  assert.equal(result.status, "Needs Inputs");
  assert.deepEqual(result.missingInputs, ["creator.platform", "campaign.productName"]);
  assert.equal(result.message, "");
});

