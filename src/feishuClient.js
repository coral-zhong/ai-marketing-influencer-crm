export async function writeCreatorScreeningResult(config, payload) {
  const hasCredentials = Boolean(config.feishuAppId && config.feishuAppSecret && config.feishuBaseToken);

  if (!hasCredentials || config.demoMode) {
    return {
      mode: "demo",
      written: false,
      message: "Feishu credentials are not configured; returning screening result without writeback."
    };
  }

  return {
    mode: "not_implemented",
    written: false,
    message: "Direct Feishu OpenAPI writeback is not implemented in this public MVP yet.",
    creatorRecordId: payload.creatorRecordId || null
  };
}

