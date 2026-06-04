export function loadConfig(env = process.env) {
  return {
    port: Number(env.AGENT_PORT || 3215),
    agentApiSecret: env.AGENT_API_SECRET || "",
    demoMode: env.AGENT_DEMO_MODE === "true",
    feishuAppId: env.FEISHU_APP_ID || "",
    feishuAppSecret: env.FEISHU_APP_SECRET || "",
    feishuBaseToken: env.FEISHU_BASE_TOKEN || ""
  };
}

