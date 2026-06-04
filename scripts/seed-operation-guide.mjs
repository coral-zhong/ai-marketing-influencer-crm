import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { parseEnvText } from "../src/envFile.js";
import { seedFeishuTableRecords } from "../src/feishuSetup.js";

const env = parseEnvText(await readFile(join(process.cwd(), ".env"), "utf8"));
const schema = JSON.parse(await readFile(new URL("../schema/full-template.schema.json", import.meta.url), "utf8"));
const tables = JSON.parse(env.FEISHU_TABLES_JSON || "{}");
const operationGuide = schema.tables.find((table) => table.name === "Operation Guide");

if (!operationGuide) throw new Error("Operation Guide table is missing from full template schema.");
if (!env.FEISHU_BASE_TOKEN) throw new Error("FEISHU_BASE_TOKEN is missing from .env.");
if (!tables["Operation Guide"]) throw new Error("FEISHU_TABLES_JSON is missing the Operation Guide table id.");

const seeded = await seedFeishuTableRecords({
  feishuAppId: env.FEISHU_APP_ID || "",
  feishuAppSecret: env.FEISHU_APP_SECRET || ""
}, {
  baseToken: env.FEISHU_BASE_TOKEN,
  tableId: tables["Operation Guide"],
  records: operationGuide.records || []
}, fetch);

console.log(JSON.stringify({
  ok: true,
  table: "Operation Guide",
  seededRecords: seeded
}, null, 2));
