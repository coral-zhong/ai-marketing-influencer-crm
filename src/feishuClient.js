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

export async function resolveAgentTaskFromFeishu(config, payload, fetchImpl = fetch) {
  const hasCredentials = Boolean(config.feishuAppId && config.feishuAppSecret && config.feishuBaseToken);
  if (!hasCredentials || config.demoMode) {
    throw new Error("Feishu credentials are required to resolve an Agent Tasks record.");
  }

  const agentTasksTableId = config.feishuTables?.["Agent Tasks"];
  if (!agentTasksTableId || !payload.taskRecordId) {
    throw new Error("Agent Tasks table id and taskRecordId are required to resolve hosted task input.");
  }

  const tenantAccessToken = await getTenantAccessToken(config, fetchImpl);
  const taskRecord = await getBitableRecord({
    baseToken: config.feishuBaseToken,
    tableId: agentTasksTableId,
    recordId: payload.taskRecordId,
    tenantAccessToken
  }, fetchImpl);
  const taskFields = taskRecord.fields || {};
  const taskType = textField(taskFields["Task Type"]);
  const inputRecordType = textField(taskFields["Input Record Type"]);
  const inputRecordId = textField(taskFields["Input Record ID"]);

  if (taskType === "campaign_plan" && inputRecordType === "Campaign") {
    const campaignsTableId = config.feishuTables?.Campaigns;
    if (!campaignsTableId) throw new Error("Campaigns table id is required to resolve campaign_plan input.");
    if (!inputRecordId) throw new Error("Input Record ID is required for campaign_plan tasks.");

    const campaignRecord = await getBitableRecord({
      baseToken: config.feishuBaseToken,
      tableId: campaignsTableId,
      recordId: inputRecordId,
      tenantAccessToken
    }, fetchImpl);

    return {
      taskType,
      input: {
        campaign: mapCampaignFields(campaignRecord.fields || {})
      }
    };
  }

  return {
    taskType,
    input: {}
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

async function getBitableRecord(input, fetchImpl) {
  const url = `${FEISHU_OPENAPI_BASE_URL}/bitable/v1/apps/${encodeURIComponent(input.baseToken)}/tables/${encodeURIComponent(input.tableId)}/records/${encodeURIComponent(input.recordId)}`;
  const body = await parseFeishuResponse(
    await fetchImpl(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${input.tenantAccessToken}`,
        "content-type": "application/json; charset=utf-8"
      }
    })
  );
  return body.data?.record || {};
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

function mapCampaignFields(fields) {
  return {
    campaignName: textField(fields["Campaign Name"]),
    brand: textField(fields.Brand),
    productName: textField(fields["Product Name"]),
    campaignGoal: textField(fields["Campaign Goal"]),
    targetMarket: textField(fields["Target Market"]),
    creatorCriteria: textField(fields["Creator Criteria"]),
    claimsAllowed: textField(fields["Claims Allowed"]),
    claimsToAvoid: textField(fields["Claims To Avoid"])
  };
}

function textField(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(textField).filter(Boolean).join("\n");
  if (value && typeof value === "object") {
    return textField(value.text || value.name || value.value || value.id || "");
  }
  return "";
}
