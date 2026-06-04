import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("minimal CRM schema contains the product tables and required fields", async () => {
  const schema = JSON.parse(await readFile(new URL("../schema/minimal-crm.schema.json", import.meta.url), "utf8"));

  assert.deepEqual(
    schema.tables.map((table) => table.name),
    ["Campaigns", "Creators", "Agent Tasks"]
  );

  assertHasFields(schema, "Campaigns", [
    "Campaign Name",
    "Brand",
    "Product Name",
    "Campaign Goal",
    "Status"
  ]);
  assertHasFields(schema, "Creators", [
    "Creator Name",
    "Platform",
    "Profile URL",
    "Creator Status",
    "Fit Score",
    "Tier",
    "Strengths",
    "Risks",
    "Recommended Collaboration",
    "Screening Summary",
    "Agent Error"
  ]);
  assertHasFields(schema, "Agent Tasks", [
    "Task Name",
    "Task Type",
    "Input Record Type",
    "Input Record ID",
    "Status",
    "Permission Level",
    "Output Summary",
    "Error Message"
  ]);
});

test("select fields define non-empty options", async () => {
  const schema = JSON.parse(await readFile(new URL("../schema/minimal-crm.schema.json", import.meta.url), "utf8"));

  for (const table of schema.tables) {
    for (const field of table.fields) {
      if (field.type === "select") {
        assert.ok(Array.isArray(field.options), `${table.name}.${field.name} options must be an array`);
        assert.ok(field.options.length > 0, `${table.name}.${field.name} must have options`);
      }
    }
  }
});

function assertHasFields(schema, tableName, expectedFields) {
  const table = schema.tables.find((item) => item.name === tableName);
  assert.ok(table, `${tableName} table should exist`);

  const actualFields = new Set(table.fields.map((field) => field.name));
  for (const field of expectedFields) {
    assert.ok(actualFields.has(field), `${tableName}.${field} should exist`);
  }
}
