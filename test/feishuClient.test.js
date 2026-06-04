import test from "node:test";
import assert from "node:assert/strict";
import { buildCreatorScreeningFields, writeCreatorScreeningResult } from "../src/feishuClient.js";

test("buildCreatorScreeningFields maps screening result to Feishu field names", () => {
  const fields = buildCreatorScreeningFields({
    fitScore: 88,
    tier: "A",
    scoreConfidence: "High",
    strengths: ["Strong demos", "Good category fit"],
    risks: ["Needs claim review"],
    recommendedCollaboration: "Paid",
    screeningSummary: "Strong creator fit."
  });

  assert.deepEqual(fields, {
    "Fit Score": 88,
    Tier: "A",
    "Score Confidence": "High",
    Strengths: "Strong demos\nGood category fit",
    Risks: "Needs claim review",
    "Recommended Collaboration": "Paid",
    "Screening Summary": "Strong creator fit.",
    "Agent Error": "",
    "Creator Status": "Needs Review"
  });
});

test("writeCreatorScreeningResult updates a Feishu creator record through OpenAPI", async () => {
  const calls = [];
  const fakeFetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("/auth/v3/tenant_access_token/internal")) {
      return jsonResponse({ code: 0, msg: "ok", tenant_access_token: "tenant-token", expire: 7200 });
    }
    if (url.includes("/bitable/v1/apps/base-token/tables/table-creators/records/rec123")) {
      return jsonResponse({ code: 0, msg: "ok", data: { record: { record_id: "rec123" } } });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const writeback = await writeCreatorScreeningResult(
    {
      feishuAppId: "app-id",
      feishuAppSecret: "app-secret",
      feishuBaseToken: "base-token",
      feishuCreatorsTableId: "table-creators",
      demoMode: false
    },
    {
      creatorRecordId: "rec123",
      result: {
        fitScore: 88,
        tier: "A",
        scoreConfidence: "High",
        strengths: ["Strong demos"],
        risks: [],
        recommendedCollaboration: "Paid",
        screeningSummary: "Strong creator fit."
      }
    },
    fakeFetch
  );

  assert.equal(writeback.mode, "feishu_openapi");
  assert.equal(writeback.written, true);
  assert.equal(writeback.creatorRecordId, "rec123");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].options.method, "POST");
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    app_id: "app-id",
    app_secret: "app-secret"
  });
  assert.equal(calls[1].options.method, "PUT");
  assert.equal(calls[1].options.headers.Authorization, "Bearer tenant-token");
  assert.deepEqual(JSON.parse(calls[1].options.body).fields["Creator Status"], "Needs Review");
});

test("writeCreatorScreeningResult returns config_missing when table or record is missing", async () => {
  const writeback = await writeCreatorScreeningResult(
    {
      feishuAppId: "app-id",
      feishuAppSecret: "app-secret",
      feishuBaseToken: "base-token",
      feishuCreatorsTableId: "",
      demoMode: false
    },
    {
      creatorRecordId: "rec123",
      result: { fitScore: 70 }
    },
    async () => {
      throw new Error("fetch should not be called");
    }
  );

  assert.equal(writeback.mode, "config_missing");
  assert.equal(writeback.written, false);
  assert.match(writeback.message, /FEISHU_CREATORS_TABLE_ID/);
});

function jsonResponse(body) {
  return {
    ok: true,
    status: 200,
    async json() {
      return body;
    },
    async text() {
      return JSON.stringify(body);
    }
  };
}

