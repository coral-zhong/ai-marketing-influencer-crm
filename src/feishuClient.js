const FEISHU_OPENAPI_BASE_URL = "https://open.feishu.cn/open-apis";

export async function writeCreatorScreeningResult(config, payload, fetchImpl = fetch) {
  const hasCredentials = Boolean(config.feishuAppId && config.feishuAppSecret && config.feishuBaseToken);

  if (!hasCredentials || config.demoMode) {
    return {
      mode: "demo",
      written: false,
      message: "Feishu credentials are not configured; returning screening result without writeback."
    };
  }

  if (!config.feishuCreatorsTableId || !payload.creatorRecordId) {
    return {
      mode: "config_missing",
      written: false,
      message: "FEISHU_CREATORS_TABLE_ID and creatorRecordId are required for Feishu writeback.",
      creatorRecordId: payload.creatorRecordId || null
    };
  }

  const tenantAccessToken = await getTenantAccessToken(config, fetchImpl);
  await updateCreatorRecord(
    {
      baseToken: config.feishuBaseToken,
      creatorsTableId: config.feishuCreatorsTableId,
      creatorRecordId: payload.creatorRecordId,
      tenantAccessToken,
      fields: buildCreatorScreeningFields(payload.result)
    },
    fetchImpl
  );

  return {
    mode: "feishu_openapi",
    written: true,
    message: "Creator screening result written to Feishu.",
    creatorRecordId: payload.creatorRecordId
  };
}

export async function writeAgentTaskResult(config, payload, fetchImpl = fetch) {
  const hasCredentials = Boolean(config.feishuAppId && config.feishuAppSecret && config.feishuBaseToken);

  if (!hasCredentials || config.demoMode) {
    return {
      mode: "demo",
      written: false,
      message: "Feishu credentials are not configured; returning agent task result without writeback."
    };
  }

  const agentTasksTableId = config.feishuTables?.["Agent Tasks"];
  if (!agentTasksTableId || !payload.taskRecordId) {
    return {
      mode: "config_missing",
      written: false,
      message: "Agent Tasks table id and taskRecordId are required for hosted task writeback.",
      taskRecordId: payload.taskRecordId || null
    };
  }

  const tenantAccessToken = await getTenantAccessToken(config, fetchImpl);
  await updateBitableRecord(
    {
      baseToken: config.feishuBaseToken,
      tableId: agentTasksTableId,
      recordId: payload.taskRecordId,
      tenantAccessToken,
      fields: buildAgentTaskResultFields(payload.result)
    },
    fetchImpl
  );

  return {
    mode: "feishu_openapi",
    written: true,
    message: "Agent task result written to Feishu.",
    taskRecordId: payload.taskRecordId
  };
}

export function buildCreatorScreeningFields(result) {
  return {
    "Fit Score": result.fitScore,
    Tier: result.tier,
    "Score Confidence": result.scoreConfidence,
    Strengths: arrayToText(result.strengths),
    Risks: arrayToText(result.risks),
    "Recommended Collaboration": result.recommendedCollaboration,
    "Screening Summary": result.screeningSummary,
    "Agent Error": "",
    "Creator Status": "Needs Review"
  };
}

export function buildAgentTaskResultFields(result) {
  return {
    Status: result.status || "needs_review",
    "Permission Level": result.permissionLevel || "review",
    "Output Summary": result.outputSummary || "",
    "Output JSON": JSON.stringify(result.output || {}, null, 2),
    "Error Message": ""
  };
}

async function getTenantAccessToken(config, fetchImpl) {
  const response = await fetchImpl(`${FEISHU_OPENAPI_BASE_URL}/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      app_id: config.feishuAppId,
      app_secret: config.feishuAppSecret
    })
  });
  const body = await parseFeishuResponse(response);
  return body.tenant_access_token;
}

async function updateCreatorRecord(input, fetchImpl) {
  return updateBitableRecord({
    baseToken: input.baseToken,
    tableId: input.creatorsTableId,
    recordId: input.creatorRecordId,
    tenantAccessToken: input.tenantAccessToken,
    fields: input.fields
  }, fetchImpl);
}

async function updateBitableRecord(input, fetchImpl) {
  const url = `${FEISHU_OPENAPI_BASE_URL}/bitable/v1/apps/${encodeURIComponent(input.baseToken)}/tables/${encodeURIComponent(input.tableId)}/records/${encodeURIComponent(input.recordId)}`;
  await parseFeishuResponse(
    await fetchImpl(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${input.tenantAccessToken}`,
        "content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        fields: input.fields
      })
    })
  );
}

async function parseFeishuResponse(response) {
  const body = await response.json();
  if (!response.ok || body.code !== 0) {
    const message = body.msg || body.message || response.statusText || "Feishu API request failed";
    throw new Error(`Feishu API error: ${message}`);
  }
  return body;
}

function arrayToText(value) {
  if (Array.isArray(value)) return value.join("\n");
  return value || "";
}
