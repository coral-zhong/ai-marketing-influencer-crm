import test from "node:test";
import assert from "node:assert/strict";
import { prepareOutreachSendPackage } from "../src/outreachSendWorkflow.js";

test("prepareOutreachSendPackage creates a send-ready package when approved", () => {
  const result = prepareOutreachSendPackage({
    approvalStatus: "Approved",
    channel: "email",
    recipient: "maya@example.com",
    subject: "Demo Brand x Maya Tech Finds",
    message: "Hi Maya,\nWould you be open to reviewing a brief?",
    creator: { name: "Maya Tech Finds" },
    campaign: { brand: "Demo Brand", productName: "Magnetic power bank" }
  });

  assert.equal(result.status, "Ready To Send");
  assert.equal(result.permissionLevel, "manual");
  assert.equal(result.sendPackage.channel, "email");
  assert.equal(result.sendPackage.recipient, "maya@example.com");
  assert.match(result.auditNote, /Human approved/);
});

test("prepareOutreachSendPackage blocks sending when approval is missing", () => {
  const result = prepareOutreachSendPackage({
    approvalStatus: "Needs Review",
    channel: "email",
    recipient: "maya@example.com",
    subject: "Demo Brand x Maya Tech Finds",
    message: "Hi Maya",
    creator: { name: "Maya Tech Finds" },
    campaign: { brand: "Demo Brand" }
  });

  assert.equal(result.status, "Blocked");
  assert.equal(result.permissionLevel, "manual");
  assert.equal(result.sendPackage, null);
  assert.deepEqual(result.blockers, ["Human approval is required before outreach can be sent."]);
});

test("prepareOutreachSendPackage reports missing send fields", () => {
  const result = prepareOutreachSendPackage({
    approvalStatus: "Approved",
    channel: "email",
    creator: { name: "Maya Tech Finds" },
    campaign: { brand: "Demo Brand" }
  });

  assert.equal(result.status, "Needs Inputs");
  assert.deepEqual(result.missingInputs, ["recipient", "subject", "message"]);
});

