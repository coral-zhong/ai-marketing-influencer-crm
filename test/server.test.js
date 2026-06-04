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

test("POST /api/creators/import parses CSV and returns imported creators", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/creators/import`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        csv: `Creator Name,Platform,Profile URL,Category
Maya Tech Finds,TikTok,https://example.com/maya,UGC tech review`
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.summary.imported, 1);
    assert.equal(body.creators[0].name, "Maya Tech Finds");
    assert.equal(body.creators[0].status, "To Screen");
  });
});

test("POST /api/creators/import validates CSV body", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/creators/import`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({})
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.ok, false);
    assert.equal(body.error, "csv is required");
  });
});

test("POST /api/campaigns/plan returns campaign task decomposition", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/campaigns/plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        campaign: {
          campaignName: "Spring TikTok UGC Test",
          brand: "Demo Brand",
          productName: "Magnetic power bank",
          campaignGoal: "Find creators who can make short tutorial-style TikTok demos.",
          creatorCriteria: "TikTok UGC review creators with clear product demos."
        }
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.plan.tasks.length, 3);
    assert.equal(body.plan.tasks[0].taskType, "creator_search_planner");
  });
});

test("POST /api/campaigns/plan validates campaign body", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/campaigns/plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({})
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.ok, false);
    assert.equal(body.error, "campaign is required");
  });
});

test("POST /api/outreach/draft returns a review-only outreach draft", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/outreach/draft`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        creator: {
          name: "Maya Tech Finds",
          platform: "TikTok",
          category: "UGC tech review"
        },
        campaign: {
          brand: "Demo Brand",
          productName: "Magnetic power bank",
          campaignGoal: "Find creators who can make short tutorial demos."
        }
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.draft.status, "Needs Review");
    assert.equal(body.draft.permissionLevel, "review");
    assert.match(body.draft.message, /Magnetic power bank/);
  });
});

test("POST /api/outreach/draft validates request body", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/outreach/draft`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ creator: { name: "Maya" } })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.ok, false);
    assert.equal(body.error, "creator and campaign are required");
  });
});

test("POST /api/creators/search extracts website creator candidates", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/creators/search`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        campaign: {
          creatorCriteria: "UGC tech review creators"
        },
        sources: [
          {
            url: "https://example.com/top-tech-creators",
            text: "Maya Tech Finds - TikTok product demos. Profile: https://www.tiktok.com/@mayatechfinds"
          }
        ]
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.candidates.length, 1);
    assert.equal(body.candidates[0].profileUrl, "https://www.tiktok.com/@mayatechfinds");
  });
});

test("POST /api/creators/search validates source body", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/creators/search`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ campaign: {} })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.ok, false);
    assert.equal(body.error, "sources must be an array");
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
