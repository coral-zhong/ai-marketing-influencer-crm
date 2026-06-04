# Agent Instructions

This repository is a public MVP for an AI Marketing Influencer CRM cloud agent.

## Primary Goal

Help a user install and verify the repo locally, then optionally configure Feishu writeback.

The minimum successful local install is:

```bash
npm run verify:local
```

Expected result:

- all tests pass
- smoke check returns `ok: true`
- `screen_creator` returns a fit score and tier
- writeback mode is `demo` unless Feishu credentials are configured

## Do Not

- Do not ask the user to configure macOS launchd.
- Do not use ngrok for the local verification path.
- Do not put real Feishu secrets, OpenAI keys, or GitHub tokens into committed files.
- Do not claim Feishu writeback works unless you have configured real environment variables and verified a real Creator record update.
- Do not auto-send outreach, promise payment, approve content, ship samples, or publish posts.

## Install Path

1. Confirm Node.js 20 or newer:

   ```bash
   node --version
   ```

2. Clone and enter the repo:

   ```bash
   git clone https://github.com/coral-zhong/ai-marketing-influencer-crm.git
   cd ai-marketing-influencer-crm
   ```

3. Run local verification:

   ```bash
   npm run verify:local
   ```

4. If the user wants real Feishu writeback, copy `.env.example` to `.env`, fill credentials locally, and run:

   ```bash
   source .env
   npm start
   ```

## Key Files

- `README.md`: user-facing overview and quick start
- `docs/ai-agent-local-install.md`: detailed install handoff for AI agents
- `schema/minimal-crm.schema.json`: minimal Feishu Base schema
- `src/server.js`: HTTP server and endpoints
- `src/feishuClient.js`: Feishu OpenAPI writeback boundary
- `scripts/local-smoke-test.mjs`: local smoke verification

