import test from "node:test";
import assert from "node:assert/strict";
import { searchCreatorsFromWebsiteSources } from "../src/creatorSearch.js";

test("searchCreatorsFromWebsiteSources extracts creator candidates from website snippets", () => {
  const result = searchCreatorsFromWebsiteSources({
    campaign: {
      platform: "TikTok",
      creatorCriteria: "UGC tech review creators",
      targetMarket: "US"
    },
    sources: [
      {
        url: "https://example.com/top-tech-creators",
        title: "Top UGC tech review creators",
        text: "Maya Tech Finds - TikTok creator focused on short product demos. Profile: https://www.tiktok.com/@mayatechfinds"
      },
      {
        url: "https://example.com/home-lab",
        title: "Home lab reviewers",
        text: "Alex Home Lab reviews long-form YouTube gadgets. Profile: https://youtube.com/@alexhomelab"
      }
    ]
  });

  assert.equal(result.summary.sources, 2);
  assert.equal(result.summary.candidates, 2);
  assert.deepEqual(result.candidates[0], {
    name: "Maya Tech Finds",
    platform: "TikTok",
    profileUrl: "https://www.tiktok.com/@mayatechfinds",
    category: "UGC tech review creators",
    sourceUrl: "https://example.com/top-tech-creators",
    reason: "Matched campaign criteria: UGC tech review creators."
  });
});

test("searchCreatorsFromWebsiteSources deduplicates candidates by profile URL", () => {
  const result = searchCreatorsFromWebsiteSources({
    campaign: { creatorCriteria: "tech creators" },
    sources: [
      {
        url: "https://example.com/a",
        text: "Maya Tech Finds - Profile: https://www.tiktok.com/@mayatechfinds"
      },
      {
        url: "https://example.com/b",
        text: "Maya Tech Finds again - Profile: https://www.tiktok.com/@mayatechfinds"
      }
    ]
  });

  assert.equal(result.candidates.length, 1);
  assert.equal(result.duplicates.length, 1);
  assert.equal(result.duplicates[0].profileUrl, "https://www.tiktok.com/@mayatechfinds");
});

test("searchCreatorsFromWebsiteSources reports missing sources", () => {
  const result = searchCreatorsFromWebsiteSources({
    campaign: { creatorCriteria: "tech creators" },
    sources: []
  });

  assert.equal(result.candidates.length, 0);
  assert.equal(result.errors[0].message, "At least one website source is required.");
});

