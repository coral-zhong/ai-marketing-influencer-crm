import assert from "node:assert/strict";
import test from "node:test";

import { parseEnvText, upsertEnvValues } from "../src/envFile.js";

test("parseEnvText reads simple .env values without exposing comments", () => {
  const env = parseEnvText(`
# Local Feishu config
FEISHU_APP_ID=local_app_id
FEISHU_APP_SECRET=local_app_secret
AGENT_DEMO_MODE=false
`);

  assert.equal(env.FEISHU_APP_ID, "local_app_id");
  assert.equal(env.FEISHU_APP_SECRET, "local_app_secret");
  assert.equal(env.AGENT_DEMO_MODE, "false");
});

test("upsertEnvValues replaces existing keys and appends missing keys", () => {
  const updated = upsertEnvValues(`FEISHU_APP_ID=local_app_id
FEISHU_BASE_TOKEN=
AGENT_DEMO_MODE=true
`, {
    FEISHU_BASE_TOKEN: "bascnCreated",
    FEISHU_CREATORS_TABLE_ID: "tblCreators",
    FEISHU_TABLES_JSON: JSON.stringify({ Creators: "tblCreators", Outreach: "tblOutreach" }),
    AGENT_DEMO_MODE: "false"
  });

  assert.match(updated, /^FEISHU_BASE_TOKEN=bascnCreated$/m);
  assert.match(updated, /^FEISHU_CREATORS_TABLE_ID=tblCreators$/m);
  assert.match(updated, /^FEISHU_TABLES_JSON=/m);
  assert.match(updated, /tblOutreach/);
  assert.match(updated, /^AGENT_DEMO_MODE=false$/m);
});
