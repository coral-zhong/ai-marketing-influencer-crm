import test from "node:test";
import assert from "node:assert/strict";
import { buildFeishuInstallPlan, validateFeishuOAuthCallback } from "../src/feishuInstall.js";

test("buildFeishuInstallPlan creates an OAuth authorize URL when configured", () => {
  const result = buildFeishuInstallPlan({
    feishuAppId: "demo-app-id",
    feishuOAuthRedirectUri: "https://example.com/api/install/feishu/callback",
    feishuOAuthScopes: "bitable:app:readonly offline_access"
  }, {
    state: "local-test-state"
  });

  assert.equal(result.installStatus, "Ready");
  assert.equal(result.requiredHumanAction, "Open authUrl and approve the Feishu app.");
  assert.match(result.authUrl, /^https:\/\/accounts\.feishu\.cn\/open-apis\/authen\/v1\/authorize/);
  assert.match(result.authUrl, /client_id=demo-app-id/);
  assert.match(result.authUrl, /response_type=code/);
  assert.match(result.authUrl, /state=local-test-state/);
});

test("buildFeishuInstallPlan reports missing hosted OAuth config", () => {
  const result = buildFeishuInstallPlan({
    feishuAppId: "",
    feishuOAuthRedirectUri: ""
  });

  assert.equal(result.installStatus, "Config Missing");
  assert.deepEqual(result.missing, ["FEISHU_APP_ID", "FEISHU_OAUTH_REDIRECT_URI"]);
});

test("validateFeishuOAuthCallback accepts matching code and state", () => {
  const result = validateFeishuOAuthCallback({
    code: "auth-code",
    state: "local-test-state"
  }, {
    expectedState: "local-test-state"
  });

  assert.equal(result.callbackStatus, "Ready To Exchange Token");
  assert.equal(result.nextAction, "Exchange the one-time code for user_access_token on the hosted server.");
});

test("validateFeishuOAuthCallback rejects missing code or mismatched state", () => {
  const result = validateFeishuOAuthCallback({
    state: "wrong-state"
  }, {
    expectedState: "local-test-state"
  });

  assert.equal(result.callbackStatus, "Invalid Callback");
  assert.deepEqual(result.errors, ["code is required", "state does not match expected value"]);
});
