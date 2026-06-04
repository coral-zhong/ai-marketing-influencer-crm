import http from "node:http";
import { loadConfig } from "./config.js";
import { screenCreator } from "./screenCreator.js";
import { writeCreatorScreeningResult } from "./feishuClient.js";
import { importCreatorsFromCsv } from "./importCreators.js";
import { planCampaignTasks } from "./campaignPlanner.js";
import { draftOutreach } from "./outreachDraft.js";
import { searchCreatorsFromWebsiteSources } from "./creatorSearch.js";
import { prepareOutreachSendPackage } from "./outreachSendWorkflow.js";

export function createApp(config = loadConfig()) {
  return http.createServer(async (request, response) => {
    try {
      if (request.method === "GET" && request.url === "/health") {
        return sendJson(response, 200, { ok: true, service: "ai-marketing-influencer-crm" });
      }

      if (request.method === "POST" && request.url === "/api/tasks/screen-creator") {
        const authError = validateSecret(request, config);
        if (authError) return sendJson(response, 401, { ok: false, error: authError });

        const body = await readJson(request);
        const creator = body.creator || {};
        if (!creator.name || typeof creator.name !== "string") {
          return sendJson(response, 400, { ok: false, error: "creator.name is required" });
        }

        const result = screenCreator({
          creator,
          campaign: body.campaign || {}
        });
        const writeback = await writeCreatorScreeningResult(config, {
          creatorRecordId: body.creatorRecordId,
          result
        });

        return sendJson(response, 200, { ok: true, result, writeback });
      }

      if (request.method === "POST" && request.url === "/api/creators/import") {
        const authError = validateSecret(request, config);
        if (authError) return sendJson(response, 401, { ok: false, error: authError });

        const body = await readJson(request);
        if (!body.csv || typeof body.csv !== "string") {
          return sendJson(response, 400, { ok: false, error: "csv is required" });
        }

        const result = importCreatorsFromCsv(body.csv);
        return sendJson(response, 200, {
          ok: true,
          creators: result.imported,
          duplicates: result.duplicates,
          errors: result.errors,
          summary: result.summary
        });
      }

      if (request.method === "POST" && request.url === "/api/campaigns/plan") {
        const authError = validateSecret(request, config);
        if (authError) return sendJson(response, 401, { ok: false, error: authError });

        const body = await readJson(request);
        if (!body.campaign || typeof body.campaign !== "object") {
          return sendJson(response, 400, { ok: false, error: "campaign is required" });
        }

        return sendJson(response, 200, {
          ok: true,
          plan: planCampaignTasks(body.campaign)
        });
      }

      if (request.method === "POST" && request.url === "/api/outreach/draft") {
        const authError = validateSecret(request, config);
        if (authError) return sendJson(response, 401, { ok: false, error: authError });

        const body = await readJson(request);
        if (!body.creator || !body.campaign) {
          return sendJson(response, 400, { ok: false, error: "creator and campaign are required" });
        }

        return sendJson(response, 200, {
          ok: true,
          draft: draftOutreach({
            creator: body.creator,
            campaign: body.campaign
          })
        });
      }

      if (request.method === "POST" && request.url === "/api/creators/search") {
        const authError = validateSecret(request, config);
        if (authError) return sendJson(response, 401, { ok: false, error: authError });

        const body = await readJson(request);
        if (!Array.isArray(body.sources)) {
          return sendJson(response, 400, { ok: false, error: "sources must be an array" });
        }

        const result = searchCreatorsFromWebsiteSources({
          campaign: body.campaign || {},
          sources: body.sources
        });
        return sendJson(response, 200, {
          ok: true,
          candidates: result.candidates,
          duplicates: result.duplicates,
          errors: result.errors,
          summary: result.summary
        });
      }

      if (request.method === "POST" && request.url === "/api/outreach/send-package") {
        const authError = validateSecret(request, config);
        if (authError) return sendJson(response, 401, { ok: false, error: authError });

        const body = await readJson(request);
        if (Object.keys(body).length === 0) {
          return sendJson(response, 400, { ok: false, error: "outreach send package input is required" });
        }

        return sendJson(response, 200, {
          ok: true,
          package: prepareOutreachSendPackage(body)
        });
      }

      return sendJson(response, 404, { ok: false, error: "not_found" });
    } catch (error) {
      return sendJson(response, 500, { ok: false, error: error.message });
    }
  });
}

export function startServer(config = loadConfig()) {
  const server = createApp(config);
  server.listen(config.port, () => {
    console.log(`AI Marketing Influencer CRM agent listening on :${config.port}`);
  });
  return server;
}

function validateSecret(request, config) {
  if (!config.agentApiSecret) return "";
  const received = request.headers["x-agent-secret"];
  return received === config.agentApiSecret ? "" : "invalid or missing x-agent-secret";
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
