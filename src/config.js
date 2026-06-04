export function loadConfig(env = process.env) {
  return {
    port: Number(env.AGENT_PORT || 3215),
    agentApiSecret: env.AGENT_API_SECRET || "",
    demoMode: env.AGENT_DEMO_MODE === "true",
    feishuAppId: env.FEISHU_APP_ID || "",
    feishuAppSecret: env.FEISHU_APP_SECRET || "",
    feishuBaseToken: env.FEISHU_BASE_TOKEN || "",
    feishuCreatorsTableId: env.FEISHU_CREATORS_TABLE_ID || "",
    feishuOAuthRedirectUri: env.FEISHU_OAUTH_REDIRECT_URI || "",
    feishuOAuthScopes: env.FEISHU_OAUTH_SCOPES || "",
    feishuOAuthExpectedState: env.FEISHU_OAUTH_EXPECTED_STATE || ""
  };
}
