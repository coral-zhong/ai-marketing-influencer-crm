import { access, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";

import { parseEnvText, upsertEnvValues } from "../src/envFile.js";
import { createFeishuCrmBase } from "../src/feishuSetup.js";

const cwd = process.cwd();
const envPath = join(cwd, ".env");
const envExamplePath = join(cwd, ".env.example");

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const envText = await readLocalEnvText();
  const env = parseEnvText(envText);

  const setup = await createFeishuCrmBase({
    feishuAppId: env.FEISHU_APP_ID || process.env.FEISHU_APP_ID || "",
    feishuAppSecret: env.FEISHU_APP_SECRET || process.env.FEISHU_APP_SECRET || ""
  }, {
    baseUrl: args.baseUrl || env.FEISHU_BASE_URL || "",
    createNewBase: args.createNewBase,
    baseName: args.baseName || "AI Marketing Influencer CRM"
  }, fetch);

  const updated = upsertEnvValues(envText, {
    FEISHU_BASE_TOKEN: setup.baseToken,
    FEISHU_CREATORS_TABLE_ID: setup.creatorsTableId,
    AGENT_DEMO_MODE: "false"
  });
  await writeFile(envPath, updated, "utf8");

  console.log(JSON.stringify({
    ok: true,
    mode: setup.mode,
    envUpdated: ".env",
    baseToken: setup.baseToken,
    creatorsTableId: setup.creatorsTableId,
    tables: setup.tables,
    views: setup.views
  }, null, 2));
}

function parseArgs(args) {
  const parsed = {
    baseUrl: "",
    baseName: "",
    createNewBase: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--base-url") {
      parsed.baseUrl = args[index + 1] || "";
      index += 1;
    } else if (arg === "--base-name") {
      parsed.baseName = args[index + 1] || "";
      index += 1;
    } else if (arg === "--create-new-base") {
      parsed.createNewBase = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  if (!parsed.baseUrl && !parsed.createNewBase) {
    printHelp();
    throw new Error("Choose --base-url or --create-new-base.");
  }

  return parsed;
}

async function readLocalEnvText() {
  if (await exists(envPath)) return readFile(envPath, "utf8");
  if (await exists(envExamplePath)) return readFile(envExamplePath, "utf8");
  return "";
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function printHelp() {
  console.log(`Set up Feishu Base values for AI Marketing Influencer CRM.

Use an existing Feishu Base:
  npm run setup:feishu -- --base-url "https://your-domain.feishu.cn/base/bascnxxxx?table=tblxxxx"

Create a new Feishu Base:
  npm run setup:feishu -- --create-new-base --base-name "AI Marketing Influencer CRM"

Before creating a new Base, fill FEISHU_APP_ID and FEISHU_APP_SECRET in .env.
`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
