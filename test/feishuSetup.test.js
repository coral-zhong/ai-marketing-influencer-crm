import test from "node:test";
import assert from "node:assert/strict";
import { buildFeishuFieldDefinition, createFeishuCrmBase, parseFeishuBaseUrl } from "../src/feishuSetup.js";

test("parseFeishuBaseUrl extracts base token and table id from a Feishu Base link", () => {
  const result = parseFeishuBaseUrl("https://example.feishu.cn/base/bascnDemoToken?table=tblCreators&view=vew123");

  assert.deepEqual(result, {
    baseToken: "bascnDemoToken",
    tableId: "tblCreators"
  });
});

test("parseFeishuBaseUrl rejects links without a base token", () => {
  assert.throws(
    () => parseFeishuBaseUrl("https://example.feishu.cn/docx/doc123?table=tblCreators"),
    /Feishu Base URL must include \/base\//
  );
});

test("buildFeishuFieldDefinition maps CRM schema fields to Bitable field payloads", () => {
  assert.deepEqual(
    buildFeishuFieldDefinition({ name: "Creator Status", type: "select", options: ["Captured", "Needs Review"] }),
    {
      field_name: "Creator Status",
      type: 3,
      ui_type: "SingleSelect",
      property: {
        options: [{ name: "Captured" }, { name: "Needs Review" }]
      }
    }
  );

  assert.deepEqual(
    buildFeishuFieldDefinition({ name: "Profile URL", type: "url" }),
    {
      field_name: "Profile URL",
      type: 15,
      ui_type: "Url"
    }
  );
});

test("createFeishuCrmBase creates a Base and schema tables through OpenAPI", async () => {
  const calls = [];
  const fakeFetch = async (url, options) => {
    calls.push({ url, options });

    if (url.endsWith("/auth/v3/tenant_access_token/internal")) {
      return jsonResponse({ code: 0, tenant_access_token: "tenant-token" });
    }

    if (url.endsWith("/bitable/v1/apps")) {
      return jsonResponse({ code: 0, data: { app: { app_token: "base-token" } } });
    }

    if (url.endsWith("/bitable/v1/apps/base-token/tables")) {
      const body = JSON.parse(options.body);
      return jsonResponse({
        code: 0,
        data: {
          table_id: `tbl_${body.table.name.replaceAll(" ", "_")}`
        }
      });
    }

    if (url.match(/\/bitable\/v1\/apps\/base-token\/tables\/tbl_.+\/views$/)) {
      const body = JSON.parse(options.body);
      return jsonResponse({
        code: 0,
        data: {
          view: {
            view_id: `vew_${body.view_name.replaceAll(" ", "_")}`,
            view_name: body.view_name,
            view_type: body.view_type
          }
        }
      });
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const setup = await createFeishuCrmBase(
    {
      feishuAppId: "app-id",
      feishuAppSecret: "app-secret"
    },
    {
      baseName: "AI Marketing CRM Test",
      schema: {
        tables: [
          {
            name: "Creators",
            views: [
              { name: "To Screen", type: "grid" },
              { name: "Needs Review", type: "grid" }
            ],
            fields: [
              { name: "Creator Name", type: "text" },
              { name: "Fit Score", type: "number" },
              { name: "Creator Status", type: "select", options: ["Captured", "Needs Review"] }
            ]
          },
          {
            name: "Agent Tasks",
            fields: [
              { name: "Task Name", type: "text" },
              { name: "Status", type: "select", options: ["pending"] }
            ]
          }
        ]
      }
    },
    fakeFetch
  );

  assert.equal(setup.mode, "created");
  assert.equal(setup.baseToken, "base-token");
  assert.equal(setup.tables.Creators, "tbl_Creators");
  assert.equal(setup.views.Creators["Needs Review"], "vew_Needs_Review");
  assert.equal(setup.creatorsTableId, "tbl_Creators");
  assert.equal(calls.length, 5);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[1].options.headers.Authorization, "Bearer tenant-token");
  assert.deepEqual(JSON.parse(calls[1].options.body), { name: "AI Marketing CRM Test" });
  assert.equal(JSON.parse(calls[2].options.body).table.fields[2].property.options[1].name, "Needs Review");
  assert.deepEqual(JSON.parse(calls[3].options.body), { view_name: "Needs Review", view_type: "grid" });
});

test("createFeishuCrmBase returns parsed setup from an existing Base URL", async () => {
  const setup = await createFeishuCrmBase(
    {},
    {
      baseUrl: "https://example.feishu.cn/base/bascnExisting?table=tblExistingCreators"
    },
    async () => {
      throw new Error("fetch should not be called");
    }
  );

  assert.deepEqual(setup, {
    mode: "existing_base_url",
    baseToken: "bascnExisting",
    creatorsTableId: "tblExistingCreators",
    tables: {
      Creators: "tblExistingCreators"
    },
    views: {}
  });
});

function jsonResponse(body) {
  return {
    ok: true,
    status: 200,
    async json() {
      return body;
    }
  };
}
