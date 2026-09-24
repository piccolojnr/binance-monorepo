# Admin Dashboard

Next.js 15 admin dashboard for managing users, callers, and security sessions.

## Features

- User management (admin & caller accounts)
- Security session monitoring
- Batch management
- Telegram notifications

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption |
| `NEXTAUTH_URL` | Base URL of the application |
| `TELEGRAM_BOT_TOKEN` | Telegram bot API token |
| `TELEGRAM_TEAM_CHAT_ID` | Telegram chat ID for notifications |

## Routes

- `/` - Dashboard with stats overview
- `/callers` - Manage caller accounts
- `/monitoring` - View and manage security sessions
- `/caller` - Caller dashboard (non-admin users)

## Default Admin

After seeding: `admin@admin.com` / `admin`
