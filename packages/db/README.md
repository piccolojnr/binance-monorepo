# @binance/db

Shared Prisma package containing the database schema, migrations, and seed scripts.

## Usage

```typescript
import { PrismaClient, type User, type SecuritySession } from '@binance/db';

const prisma = new PrismaClient();
```

## Models

- `User` - Admin and caller accounts
- `SecuritySession` - User verification sessions
- `Batch` - Groups of security sessions

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Generate Prisma client |
| `pnpm prisma:generate` | Generate Prisma client |
| `pnpm prisma:migrate` | Run migrations (dev) |
| `pnpm prisma:deploy` | Deploy migrations (prod) |
| `pnpm prisma:push` | Push schema to database |
| `pnpm prisma:studio` | Open Prisma Studio |
| `pnpm prisma:seed` | Seed the database |

## Seed

The seed script creates an admin user with credentials: `admin@admin.com` / `admin`
