import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.js";

test("GET /health returns service status", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.service, "ai-marketing-influencer-crm");
  });
});

test("POST /api/tasks/screen-creator returns a screening result", async () => {
  await withServer({ demoMode: true }, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/tasks/screen-creator`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
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
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.result.fitScore, 100);
    assert.equal(body.result.tier, "A");
    assert.equal(body.result.recommendedCollaboration, "Paid");
    assert.equal(body.writeback.mode, "demo");
  });
});

test("POST /api/tasks/screen-creator rejects invalid secret", async () => {
  await withServer({ agentApiSecret: "expected" }, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/tasks/screen-creator`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-agent-secret": "wrong" },
      body: JSON.stringify({ creator: { name: "Creator" } })
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.ok, false);
    assert.equal(body.error, "invalid or missing x-agent-secret");
  });
});

test("POST /api/tasks/screen-creator validates creator name", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/tasks/screen-creator`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ creator: { platform: "TikTok" } })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.ok, false);
    assert.equal(body.error, "creator.name is required");
  });
});

async function withServer(config, callback) {
  const server = createApp({
    port: 0,
    agentApiSecret: "",
    demoMode: false,
    feishuAppId: "",
    feishuAppSecret: "",
    feishuBaseToken: "",
    ...config
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}`;

  try {
    return await callback(url);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

