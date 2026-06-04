const FEISHU_AUTHORIZE_URL = "https://accounts.feishu.cn/open-apis/authen/v1/authorize";

export function buildFeishuInstallPlan(config, options = {}) {
  const missing = [];
  if (!text(config.feishuAppId)) missing.push("FEISHU_APP_ID");
  if (!text(config.feishuOAuthRedirectUri)) missing.push("FEISHU_OAUTH_REDIRECT_URI");

  if (missing.length > 0) {
    return {
      installStatus: "Config Missing",
      missing,
      authUrl: "",
      requiredHumanAction: "Configure hosted Feishu OAuth settings before sharing one-click install."
    };
  }

  const state = text(options.state) || "replace-with-csrf-state";
  const url = new URL(FEISHU_AUTHORIZE_URL);
  url.searchParams.set("client_id", config.feishuAppId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", config.feishuOAuthRedirectUri);
  if (text(config.feishuOAuthScopes)) url.searchParams.set("scope", config.feishuOAuthScopes);
  url.searchParams.set("state", state);

  return {
    installStatus: "Ready",
    authUrl: url.toString(),
    state,
    tokenExchangeUrl: "https://open.feishu.cn/open-apis/authen/v2/oauth/token",
    requiredHumanAction: "Open authUrl and approve the Feishu app.",
    nextServerAction: "Exchange the one-time code for user_access_token on the hosted server."
  };
}

export function validateFeishuOAuthCallback(callback, options = {}) {
  const errors = [];
  if (!text(callback.code)) errors.push("code is required");
  if (text(options.expectedState) && callback.state !== options.expectedState) {
    errors.push("state does not match expected value");
  }

  if (errors.length > 0) {
    return {
      callbackStatus: "Invalid Callback",
      errors,
      nextAction: "Restart OAuth authorization from the hosted install URL."
    };
  }

  return {
    callbackStatus: "Ready To Exchange Token",
    code: callback.code,
    state: callback.state || "",
    nextAction: "Exchange the one-time code for user_access_token on the hosted server."
  };
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
