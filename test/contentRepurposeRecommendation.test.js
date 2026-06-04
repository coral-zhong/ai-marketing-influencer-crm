import test from "node:test";
import assert from "node:assert/strict";
import { recommendContentRepurpose } from "../src/contentRepurposeRecommendation.js";

test("recommendContentRepurpose suggests reuse options for strong content", () => {
  const result = recommendContentRepurpose({
    content: {
      title: "TikTok demo video",
      publishedUrl: "https://www.tiktok.com/@mayatechfinds/video/123",
      rightsStatus: "Usage Rights Approved"
    },
    performance: {
      performanceStatus: "Ready For Review",
      performanceTier: "Strong",
      metrics: {
        engagementRate: 0.1
      }
    }
  });

  assert.equal(result.repurposeStatus, "Recommended");
  assert.equal(result.approvalRequired, true);
  assert.deepEqual(result.repurposeIdeas.map((idea) => idea.channel), ["Paid Social Ad", "Email Proof Point", "Product Page Social Proof"]);
  assert.equal(result.blockers.length, 0);
});

test("recommendContentRepurpose waits when usage rights are not approved", () => {
  const result = recommendContentRepurpose({
    content: {
      title: "TikTok demo video",
      publishedUrl: "https://www.tiktok.com/@mayatechfinds/video/123",
      rightsStatus: "Rights Not Requested"
    },
    performance: {
      performanceStatus: "Ready For Review",
      performanceTier: "Strong"
    }
  });

  assert.equal(result.repurposeStatus, "Needs Rights Approval");
  assert.deepEqual(result.blockers, ["Usage rights are not approved."]);
  assert.equal(result.repurposeIdeas.length, 0);
});

test("recommendContentRepurpose does not recommend weak content", () => {
  const result = recommendContentRepurpose({
    content: {
      title: "TikTok demo video",
      publishedUrl: "https://www.tiktok.com/@mayatechfinds/video/123",
      rightsStatus: "Usage Rights Approved"
    },
    performance: {
      performanceStatus: "Ready For Review",
      performanceTier: "Needs Review"
    }
  });

  assert.equal(result.repurposeStatus, "Do Not Repurpose Yet");
  assert.equal(result.repurposeIdeas.length, 0);
});
