# Binance Monorepo

A monorepo containing the admin dashboard and security page applications.

## 📁 Structure

```
.
├── apps/
│   ├── admin/          # Admin dashboard (Next.js 15)
│   └── page/           # Security page (Next.js 15)
├── packages/
│   └── db/             # Shared Prisma schema & client
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL

### Local Development

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   # Root .env (database connection)
   DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
   
   # apps/admin/.env
   DATABASE_URL="..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   TELEGRAM_BOT_TOKEN="your-token"
   TELEGRAM_TEAM_CHAT_ID="your-chat-id"
   
   # apps/page/.env
   DATABASE_URL="..."
   TELEGRAM_BOT_TOKEN="your-token"
   TELEGRAM_TEAM_CHAT_ID="your-chat-id"
   ```

3. **Run database migrations:**
   ```bash
   pnpm db:deploy
   ```

4. **Seed the database (creates admin user):**
   ```bash
   pnpm db:seed
   ```
   
   Default admin credentials: `admin@admin.com` / `admin`

5. **Start development servers:**
   ```bash
   # Admin dashboard (port 3000)
   pnpm dev:admin
   
   # Security page (port 3001)
   pnpm dev:page
   ```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:admin` | Start admin dashboard in dev mode |
| `pnpm dev:page` | Start security page in dev mode |
| `pnpm build:admin` | Build admin dashboard for production |
| `pnpm build:page` | Build security page for production |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run migrations (dev) |
| `pnpm db:deploy` | Deploy migrations (prod) |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed the database |

## 🐳 Docker

Build and run with Docker:

```bash
# Build images
docker build -f apps/admin/Dockerfile -t binance-admin .
docker build -f apps/page/Dockerfile -t binance-page .

# Run containers
docker run -p 3000:3000 -e DATABASE_URL=... binance-admin
docker run -p 3001:3000 -e DATABASE_URL=... binance-page
```

## 🚢 CI/CD

Images are automatically published to GitHub Container Registry on push to `master`:

- `ghcr.io/<owner>/binance-admin:latest`
- `ghcr.io/<owner>/binance-page:latest`

## 🔐 Environment Variables

See individual app READMEs for complete environment variable documentation.
