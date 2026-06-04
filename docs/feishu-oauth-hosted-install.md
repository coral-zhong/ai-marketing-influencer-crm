# Feishu OAuth Hosted Install

This repo includes a tested install scaffold, not a production Feishu marketplace app.

## What Is Implemented

- `GET /api/install/feishu` builds a Feishu OAuth authorization URL.
- `GET /api/install/feishu/callback` validates that Feishu returned a `code` and matching `state`.
- `npm run verify:local` tests both endpoints without real credentials.

## Production Boundary

The real hosted app must keep `FEISHU_APP_SECRET` server-side. Do not put it in this public repo, a browser bundle, a Feishu Base, or a user-facing setup form.

After callback validation, the hosted service should:

1. Exchange the one-time authorization `code` for `user_access_token`.
2. Store tenant/user install state securely.
3. Create or copy the Feishu Base template.
4. Save table IDs needed by the agent writeback.
5. Show the user a success page with the installed Base link.

## Required Environment

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_OAUTH_REDIRECT_URI=https://your-hosted-domain.com/api/install/feishu/callback
FEISHU_OAUTH_SCOPES=bitable:app:readonly offline_access
FEISHU_OAUTH_EXPECTED_STATE=
```

## Local Smoke Shape

```bash
npm run verify:local
```

Expected smoke fields include:

```json
{
  "feishuInstallStatus": "Ready",
  "feishuCallbackStatus": "Ready To Exchange Token"
}
```

## Official Feishu References

- OAuth authorize URL: https://open.feishu.cn/document/common-capabilities/sso/api/obtain-oauth-code
- OAuth token exchange: https://open.feishu.cn/document/authentication-management/access-token/get-user-access-token
