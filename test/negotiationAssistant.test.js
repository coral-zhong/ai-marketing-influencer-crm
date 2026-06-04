import test from "node:test";
import assert from "node:assert/strict";
import { assistNegotiation } from "../src/negotiationAssistant.js";

test("assistNegotiation creates a review-only reply suggestion", () => {
  const result = assistNegotiation({
    creator: { name: "Maya Tech Finds" },
    campaign: {
      brand: "Demo Brand",
      productName: "Magnetic power bank",
      offerRange: "$100-$200 plus sample",
      claimsToAvoid: "Guaranteed battery life"
    },
    inboundMessage: "Can you pay $500 and give me full creative freedom?"
  });

  assert.equal(result.status, "Needs Review");
  assert.equal(result.permissionLevel, "review");
  assert.match(result.suggestedReply, /Maya/);
  assert.match(result.suggestedReply, /confirm internally/);
  assert.deepEqual(result.risks, [
    "Creator requested compensation outside the stated offer range.",
    "Creator requested broad creative freedom; confirm brand and claims guardrails."
  ]);
  assert.match(result.guardrails.join("\n"), /Do not promise payment/);
});

test("assistNegotiation flags missing inbound message", () => {
  const result = assistNegotiation({
    creator: { name: "Maya Tech Finds" },
    campaign: { brand: "Demo Brand" }
  });

  assert.equal(result.status, "Needs Inputs");
  assert.deepEqual(result.missingInputs, ["inboundMessage"]);
  assert.equal(result.suggestedReply, "");
});
