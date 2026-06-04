import assert from "node:assert/strict";
import test from "node:test";

import { breakDownViralContent } from "../src/viralBreakdown.js";

test("breakDownViralContent extracts reusable creative patterns", () => {
  const result = breakDownViralContent({
    content: {
      title: "Magnetic power bank desk setup review",
      platform: "TikTok",
      publishedUrl: "https://example.com/video",
      transcript: "I stopped carrying three chargers. This magnetic power bank snaps on, charges my phone, and still fits in my small bag. Here is the 10 second desk setup test.",
      visualNotes: "Fast opening shot with messy cables, close-up snap-on demo, side-by-side bag fit test, final desk setup shot.",
      metrics: {
        views: 120000,
        likes: 9600,
        comments: 420,
        shares: 1100
      }
    },
    campaign: {
      productName: "Magnetic power bank",
      campaignGoal: "Find reusable hooks for UGC ads"
    }
  });

  assert.equal(result.breakdownStatus, "Ready For Review");
  assert.equal(result.hook, "I stopped carrying three chargers.");
  assert.equal(result.primaryAngle, "Simple problem-to-demo product proof");
  assert.deepEqual(result.scriptStructure, ["Problem", "Product reveal", "Proof demo", "Use case", "CTA"]);
  assert.ok(result.whyItWorked.length >= 3);
  assert.ok(result.reusablePattern.includes("Start with a concrete friction point"));
  assert.equal(result.suggestedRepurpose.length, 3);
  assert.match(result.summary, /Magnetic power bank/);
});

test("breakDownViralContent waits when content has no transcript or notes", () => {
  const result = breakDownViralContent({
    content: {
      title: "Untitled video",
      publishedUrl: "https://example.com/video"
    }
  });

  assert.equal(result.breakdownStatus, "Needs Content Context");
  assert.deepEqual(result.blockers, ["Add transcript, caption, or visual notes before breaking down the content."]);
});

test("breakDownViralContent waits when published URL is missing", () => {
  const result = breakDownViralContent({
    content: {
      title: "Draft content",
      transcript: "A useful product demo."
    }
  });

  assert.equal(result.breakdownStatus, "Needs Published URL");
  assert.deepEqual(result.blockers, ["Add the live content URL before saving a viral breakdown."]);
});
