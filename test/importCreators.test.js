import test from "node:test";
import assert from "node:assert/strict";
import { importCreatorsFromCsv } from "../src/importCreators.js";

test("importCreatorsFromCsv parses creator CSV and normalizes fields", () => {
  const result = importCreatorsFromCsv(`Creator Name,Platform,Profile URL,Example Video URL,Category,Notes
Maya Tech Finds,TikTok,https://example.com/maya,https://example.com/video,UGC tech review,Strong short demos
Alex Home Lab,YouTube,https://example.com/alex,,Home tech,Long-form reviews`);

  assert.equal(result.imported.length, 2);
  assert.deepEqual(result.imported[0], {
    name: "Maya Tech Finds",
    platform: "TikTok",
    profileUrl: "https://example.com/maya",
    exampleVideoUrl: "https://example.com/video",
    category: "UGC tech review",
    notes: "Strong short demos",
    status: "To Screen"
  });
  assert.deepEqual(result.summary, {
    totalRows: 2,
    imported: 2,
    duplicates: 0,
    errors: 0
  });
});

test("importCreatorsFromCsv deduplicates by profile URL", () => {
  const result = importCreatorsFromCsv(`Creator Name,Platform,Profile URL
Maya Tech Finds,TikTok,https://example.com/maya
Maya Duplicate,TikTok,https://example.com/maya`);

  assert.equal(result.imported.length, 1);
  assert.equal(result.duplicates.length, 1);
  assert.equal(result.duplicates[0].rowNumber, 3);
  assert.equal(result.duplicates[0].profileUrl, "https://example.com/maya");
});

test("importCreatorsFromCsv reports rows missing required fields", () => {
  const result = importCreatorsFromCsv(`Creator Name,Platform,Profile URL
,TikTok,https://example.com/missing-name
No Platform,,https://example.com/no-platform
No URL,TikTok,`);

  assert.equal(result.imported.length, 0);
  assert.equal(result.errors.length, 3);
  assert.deepEqual(result.errors.map((error) => error.missing), [
    ["Creator Name"],
    ["Platform"],
    ["Profile URL"]
  ]);
});

