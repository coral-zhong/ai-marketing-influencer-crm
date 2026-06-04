import { readFile } from "node:fs/promises";

const FEISHU_OPENAPI_BASE_URL = "https://open.feishu.cn/open-apis";
const DEFAULT_SCHEMA_URL = new URL("../schema/full-template.schema.json", import.meta.url);

const FIELD_TYPES = {
  text: { type: 1, ui_type: "Text" },
  long_text: { type: 1, ui_type: "Text" },
  number: { type: 2, ui_type: "Number" },
  select: { type: 3, ui_type: "SingleSelect" },
  datetime: { type: 5, ui_type: "DateTime" },
  url: { type: 15, ui_type: "Url" }
};

export function parseFeishuBaseUrl(baseUrl) {
  const url = new URL(baseUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  const baseIndex = parts.indexOf("base");
  if (baseIndex === -1 || !parts[baseIndex + 1]) {
    throw new Error("Feishu Base URL must include /base/{base_token}.");
  }

  return {
    baseToken: parts[baseIndex + 1],
    tableId: url.searchParams.get("table") || ""
  };
}

export function buildFeishuFieldDefinition(field) {
  const type = FIELD_TYPES[field.type];
  if (!type) throw new Error(`Unsupported Feishu schema field type: ${field.type}`);

  const definition = {
    field_name: field.name,
    type: type.type,
    ui_type: type.ui_type
  };

  if (field.type === "select") {
    definition.property = {
      options: (field.options || []).map((name) => ({ name }))
    };
  }

  return definition;
}

export async function createFeishuCrmBase(config, input = {}, fetchImpl = fetch) {
  if (input.baseUrl) {
    const parsed = parseFeishuBaseUrl(input.baseUrl);
    const tables = await maybeListExistingTables(config, parsed.baseToken, fetchImpl);
    return {
      mode: "existing_base_url",
      baseToken: parsed.baseToken,
      creatorsTableId: tables.Creators || parsed.tableId,
      tables: Object.keys(tables).length ? tables : { Creators: parsed.tableId },
      views: {},
      seededRecords: {}
    };
  }

  if (!config.feishuAppId || !config.feishuAppSecret) {
    throw new Error("FEISHU_APP_ID and FEISHU_APP_SECRET are required to create a Feishu CRM Base.");
  }

  const schema = input.schema || await loadDefaultSchema();
  const tenantAccessToken = await getTenantAccessToken(config, fetchImpl);
  const baseToken = await createBase({
    name: input.baseName || schema.name || "AI Marketing Influencer CRM",
    tenantAccessToken
  }, fetchImpl);

  const tables = {};
  const views = {};
  const seededRecords = {};
  for (const table of schema.tables || []) {
    tables[table.name] = await createTable({
      baseToken,
      table,
      tenantAccessToken
    }, fetchImpl);
    views[table.name] = await createViews({
      baseToken,
      tableId: tables[table.name],
      views: table.views || [],
      tenantAccessToken
    }, fetchImpl);
    seededRecords[table.name] = await createRecords({
      baseToken,
      tableId: tables[table.name],
      records: table.records || [],
      tenantAccessToken
    }, fetchImpl);
  }

  return {
    mode: "created",
    baseToken,
    creatorsTableId: tables.Creators || "",
    tables,
    views,
    seededRecords
  };
}

export async function seedFeishuTableRecords(config, input = {}, fetchImpl = fetch) {
  if (!config.feishuAppId || !config.feishuAppSecret) {
    throw new Error("FEISHU_APP_ID and FEISHU_APP_SECRET are required to seed Feishu table records.");
  }
  if (!input.baseToken || !input.tableId) {
    throw new Error("baseToken and tableId are required to seed Feishu table records.");
  }

  const tenantAccessToken = await getTenantAccessToken(config, fetchImpl);
  return createRecords({
    baseToken: input.baseToken,
    tableId: input.tableId,
    records: input.records || [],
    tenantAccessToken
  }, fetchImpl);
}

async function loadDefaultSchema() {
  return JSON.parse(await readFile(DEFAULT_SCHEMA_URL, "utf8"));
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

async function maybeListExistingTables(config, baseToken, fetchImpl) {
  if (!config.feishuAppId || !config.feishuAppSecret) return {};

  try {
    const tenantAccessToken = await getTenantAccessToken(config, fetchImpl);
    const response = await fetchImpl(`${FEISHU_OPENAPI_BASE_URL}/bitable/v1/apps/${encodeURIComponent(baseToken)}/tables`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tenantAccessToken}`
      }
    });
    const body = await parseFeishuResponse(response);
    return Object.fromEntries((body.data?.items || []).map((table) => [table.name, table.table_id]));
  } catch {
    return {};
  }
}

async function createBase(input, fetchImpl) {
  const response = await fetchImpl(`${FEISHU_OPENAPI_BASE_URL}/bitable/v1/apps`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.tenantAccessToken}`,
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      name: input.name
    })
  });
  const body = await parseFeishuResponse(response);
  return body.data?.app?.app_token || body.data?.app_token || body.app_token;
}

async function createTable(input, fetchImpl) {
  const response = await fetchImpl(`${FEISHU_OPENAPI_BASE_URL}/bitable/v1/apps/${encodeURIComponent(input.baseToken)}/tables`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.tenantAccessToken}`,
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      table: {
        name: input.table.name,
        default_view_name: input.table.views?.[0]?.name || "Grid",
        fields: (input.table.fields || []).map(buildFeishuFieldDefinition)
      }
    })
  });
  const body = await parseFeishuResponse(response);
  return body.data?.table_id || body.data?.table?.table_id || body.table_id;
}

async function createViews(input, fetchImpl) {
  const created = {};
  const views = input.views.slice(1);
  for (const view of views) {
    const response = await fetchImpl(`${FEISHU_OPENAPI_BASE_URL}/bitable/v1/apps/${encodeURIComponent(input.baseToken)}/tables/${encodeURIComponent(input.tableId)}/views`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.tenantAccessToken}`,
        "content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        view_name: view.name,
        view_type: view.type || "grid"
      })
    });
    const body = await parseFeishuResponse(response);
    created[view.name] = body.data?.view?.view_id || body.data?.view_id || body.view_id || "";
  }
  return created;
}

async function createRecords(input, fetchImpl) {
  if (!input.records.length) return 0;

  const response = await fetchImpl(`${FEISHU_OPENAPI_BASE_URL}/bitable/v1/apps/${encodeURIComponent(input.baseToken)}/tables/${encodeURIComponent(input.tableId)}/records/batch_create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.tenantAccessToken}`,
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      records: input.records.map((record) => ({ fields: record.fields || {} }))
    })
  });
  const body = await parseFeishuResponse(response);
  return body.data?.records?.length || input.records.length;
}

async function parseFeishuResponse(response) {
  const body = await response.json();
  if (!response.ok || body.code !== 0) {
    const message = body.msg || body.message || response.statusText || "Feishu API request failed";
    throw new Error(`Feishu API error: ${message}`);
  }
  return body;
}
