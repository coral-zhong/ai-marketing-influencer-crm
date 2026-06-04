#!/usr/bin/env node

import { createApp } from "../src/server.js";

const server = createApp({
  port: 0,
  agentApiSecret: "",
  demoMode: true,
  feishuAppId: "",
  feishuAppSecret: "",
  feishuBaseToken: "",
  feishuCreatorsTableId: ""
});

await new Promise((resolve) => server.listen(0, resolve));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  const health = await requestJson(`${baseUrl}/health`);
  assert(health.ok === true, "health check should return ok=true");

  const screening = await requestJson(`${baseUrl}/api/tasks/screen-creator`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      creatorRecordId: "local_smoke_creator",
      creator: {
        name: "Maya Tech Finds",
        platform: "TikTok",
        profileUrl: "https://example.com/maya",
        exampleVideoUrl: "https://example.com/video",
        category: "UGC tech review"
      },
      campaign: {
        campaignGoal: "Find creators for short tutorial demos",
        creatorCriteria: "TikTok UGC review creators"
      }
    })
  });

  assert(screening.ok === true, "screening request should return ok=true");
  assert(screening.result.fitScore === 100, "screening result should include expected fitScore");
  assert(screening.result.tier === "A", "screening result should include expected tier");
  assert(screening.writeback.mode === "demo", "local smoke test should use demo writeback");

  console.log(JSON.stringify({
    ok: true,
    checks: ["health", "screen_creator"],
    fitScore: screening.result.fitScore,
    tier: screening.result.tier,
    writebackMode: screening.writeback.mode
  }, null, 2));
} finally {
  await new Promise((resolve) => server.close(resolve));
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json();
  assert(response.ok, `${url} returned HTTP ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

