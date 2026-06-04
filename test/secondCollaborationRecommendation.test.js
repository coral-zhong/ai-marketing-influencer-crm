import test from "node:test";
import assert from "node:assert/strict";
import { recommendSecondCollaboration } from "../src/secondCollaborationRecommendation.js";

test("recommendSecondCollaboration recommends re-engagement for strong performance", () => {
  const result = recommendSecondCollaboration({
    creator: {
      name: "Maya Tech Finds",
      platform: "TikTok"
    },
    campaign: {
      campaignName: "Spring TikTok UGC Test",
      productName: "Magnetic power bank"
    },
    performance: {
      performanceStatus: "Ready For Review",
      performanceTier: "Strong",
      metrics: {
        views: 10000,
        engagementRate: 0.1
      }
    }
  });

  assert.equal(result.recommendationStatus, "Recommended");
  assert.equal(result.approvalRequired, true);
  assert.equal(result.recommendedNextCollaboration.type, "Second Paid Collaboration");
  assert.match(result.rationale.join(" "), /Strong/);
});

test("recommendSecondCollaboration waits when performance is not review ready", () => {
  const result = recommendSecondCollaboration({
    creator: {
      name: "Maya Tech Finds"
    },
    performance: {
      performanceStatus: "Needs Metrics",
      performanceTier: "Unknown"
    }
  });

  assert.equal(result.recommendationStatus, "Wait For Data");
  assert.deepEqual(result.blockers, ["Performance record is not ready for review."]);
});

test("recommendSecondCollaboration does not recommend weak performance", () => {
  const result = recommendSecondCollaboration({
    creator: {
      name: "Maya Tech Finds"
    },
    performance: {
      performanceStatus: "Ready For Review",
      performanceTier: "Needs Review",
      metrics: {
        views: 1000,
        engagementRate: 0.01
      }
    }
  });

  assert.equal(result.recommendationStatus, "Do Not Re-engage Yet");
  assert.equal(result.recommendedNextCollaboration, null);
});
