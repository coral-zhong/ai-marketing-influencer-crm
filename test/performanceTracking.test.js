import test from "node:test";
import assert from "node:assert/strict";
import { trackPublishedPerformance } from "../src/performanceTracking.js";

test("trackPublishedPerformance reports missing published URL", () => {
  const result = trackPublishedPerformance({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test"
    },
    publishedContent: {
      platform: "TikTok"
    }
  });

  assert.equal(result.performanceStatus, "Needs Published URL");
  assert.deepEqual(result.blockers, ["Published content URL is missing."]);
  assert.equal(result.nextAction, "Ask the creator for the live post URL before performance tracking starts.");
});

test("trackPublishedPerformance calculates engagement rate from metrics", () => {
  const result = trackPublishedPerformance({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test",
      creatorName: "Maya Tech Finds"
    },
    publishedContent: {
      platform: "TikTok",
      publishedUrl: "https://www.tiktok.com/@mayatechfinds/video/123",
      metrics: {
        views: 10000,
        likes: 650,
        comments: 80,
        saves: 120,
        shares: 150
      }
    }
  });

  assert.equal(result.performanceStatus, "Ready For Review");
  assert.equal(result.metrics.views, 10000);
  assert.equal(result.metrics.engagementRate, 0.1);
  assert.equal(result.performanceTier, "Strong");
  assert.equal(result.blockers.length, 0);
});

test("trackPublishedPerformance waits for metrics when live URL exists without metrics", () => {
  const result = trackPublishedPerformance({
    collaboration: {
      collaborationName: "Maya Tech Finds x Spring TikTok UGC Test"
    },
    publishedContent: {
      platform: "TikTok",
      publishedUrl: "https://www.tiktok.com/@mayatechfinds/video/123"
    }
  });

  assert.equal(result.performanceStatus, "Needs Metrics");
  assert.deepEqual(result.blockers, ["Performance metrics are missing."]);
});
